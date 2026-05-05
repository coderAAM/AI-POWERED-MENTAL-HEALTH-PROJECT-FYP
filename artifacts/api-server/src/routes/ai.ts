import { Router, type IRouter } from "express";
import { AiChatBody, AiAssessBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const LANGUAGE_INSTRUCTION: Record<string, string> = {
  en: "Respond in clear, warm English only.",
  ur: "Respond fully in Urdu (Nastaliq script). Use natural, gentle Urdu — not Hindi.",
  both:
    "Respond first in English, then provide an Urdu (Nastaliq) translation under a heading 'اردو میں:'. Keep both versions short and equally compassionate.",
};

const PERSONA_PROMPT: Record<string, string> = {
  therapist: `You are Psychwell, a warm and skillful AI mental-health companion built for users in Pakistan. You speak the way a kind, well-trained therapist speaks: you listen first, validate the feeling, ask one careful follow-up question, then offer one or two small grounded suggestions (breathing, sleep hygiene, journaling prompt, gentle movement, food/water reminder, who to talk to). You never diagnose. You always remind the user that for severe distress or any thoughts of self-harm they should call Umang helpline (0311-7786264) in Pakistan or visit an emergency department. You keep replies concise (2-5 short paragraphs). You use the user's name when known. You reference Pakistani daily life respectfully (work, family, prayer rhythm, weather, food).`,
  doctor: `You are an AI Doctor — a simulated psychiatry consultation for users in Pakistan. You are NOT a substitute for a real doctor and you say so once at the start of the call. You take a structured history: presenting concern, duration, sleep, appetite, energy, concentration, mood, anxiety, any thoughts of self-harm, current medications, medical history. You ask ONE question at a time, briefly, and respond compassionately. Once you have enough information you offer: (a) a likely category in plain language (e.g. "this sounds like moderate generalized anxiety"), (b) lifestyle guidance, (c) clearly say if they should see a real psychiatrist soon and recommend calling Umang helpline (0311-7786264) for crisis. Do NOT prescribe specific prescription medications by name; you may mention general categories like "an SSRI prescribed by a doctor" but always defer the prescribing to a real psychiatrist.`,
};

router.post("/ai/chat", async (req, res, next) => {
  try {
    const body = AiChatBody.parse(req.body);

    const persona = PERSONA_PROMPT[body.persona] ?? PERSONA_PROMPT.therapist;
    const language = LANGUAGE_INSTRUCTION[body.language] ?? LANGUAGE_INSTRUCTION.en;
    const userName = body.userName ? `The user's name is ${body.userName}.` : "";
    const emotion = body.emotion
      ? `The user has just self-reported their current emotion as: ${body.emotion}. Acknowledge it gently in your first reply.`
      : "";

    const systemPrompt = [persona, language, userName, emotion].filter(Boolean).join("\n\n");

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...body.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      next(err);
    } else {
      try {
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      } catch {
        // ignore
      }
      res.end();
    }
  }
});

router.post("/ai/assess", async (req, res, next) => {
  try {
    const body = AiAssessBody.parse(req.body);
    const language = LANGUAGE_INSTRUCTION[body.language] ?? LANGUAGE_INSTRUCTION.en;
    const userName = body.userName ? `User name: ${body.userName}.` : "";
    const emotion = body.emotion ? `Self-reported current emotion: ${body.emotion}.` : "";
    const recent =
      body.recentMoodNotes && body.recentMoodNotes.length
        ? `Recent mood notes:\n${body.recentMoodNotes.map((n) => `- ${n}`).join("\n")}`
        : "";

    const scoresText = JSON.stringify(body.scores, null, 2);

    const systemPrompt = `You are Psychwell's AI care planner. You read self-administered assessment scores and produce a JSON care plan tailored to a Pakistani user. You DO NOT diagnose. You return realistic, gentle, locally appropriate advice (food in desi context, sleep, prayer/dua-friendly grounding, exercise that fits Pakistani weather/space, supplements with general dose ranges).
${language}
Return ONLY a valid JSON object that matches this exact TypeScript shape and nothing else:
{
  "summary": string,
  "severity": "minimal" | "mild" | "moderate" | "severe",
  "sleep":       { "title": string, "detail": string },
  "food":        { "title": string, "detail": string },
  "exercise":    { "title": string, "detail": string },
  "supplements": { "title": string, "detail": string },
  "coping": [ { "title": string, "detail": string }, ... 3-5 items ],
  "warning"?: string
}
If the depression score is 15+ or anxiety 15+ or any indication of self-harm, set severity to "severe" and add a "warning" string urging them to call Umang helpline 0311-7786264 in Pakistan and contact a psychiatrist within 48 hours.`;

    const userPrompt = `Scores:\n${scoresText}\n\n${userName}\n${emotion}\n${recent}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    let plan: unknown;
    try {
      plan = JSON.parse(text);
    } catch {
      throw new Error("AI returned invalid JSON");
    }
    res.json(plan);
  } catch (err) {
    next(err);
  }
});

export default router;
