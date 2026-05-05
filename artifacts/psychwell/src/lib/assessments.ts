import type { Lang, TranslationKey } from "./translations";

export type AssessmentType = "gad7" | "phq9" | "pss10" | "big5";

export type Question = {
  text: { en: string; ur: string };
  reverse?: boolean;
  trait?: "O" | "C" | "E" | "A" | "N";
};

export type Scale = {
  options: { value: number; label: { en: string; ur: string } }[];
  scaleHeader: TranslationKey;
};

export type AssessmentDef = {
  type: AssessmentType;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  scale: Scale;
  questions: Question[];
};

const FREQ_GAD: Scale = {
  scaleHeader: "scale_gad",
  options: [
    { value: 0, label: { en: "Not at all", ur: "بالکل نہیں" } },
    { value: 1, label: { en: "Several days", ur: "کئی دن" } },
    { value: 2, label: { en: "More than half the days", ur: "آدھے سے زیادہ دن" } },
    { value: 3, label: { en: "Nearly every day", ur: "تقریباً ہر دن" } },
  ],
};

const FREQ_PHQ: Scale = { ...FREQ_GAD, scaleHeader: "scale_phq" };

const FREQ_PSS: Scale = {
  scaleHeader: "scale_pss",
  options: [
    { value: 0, label: { en: "Never", ur: "کبھی نہیں" } },
    { value: 1, label: { en: "Almost never", ur: "تقریباً کبھی نہیں" } },
    { value: 2, label: { en: "Sometimes", ur: "کبھی کبھی" } },
    { value: 3, label: { en: "Fairly often", ur: "اکثر" } },
    { value: 4, label: { en: "Very often", ur: "بہت اکثر" } },
  ],
};

const LIKERT_BIG5: Scale = {
  scaleHeader: "scale_big5",
  options: [
    { value: 1, label: { en: "Disagree strongly", ur: "بالکل اختلاف" } },
    { value: 2, label: { en: "Disagree a little", ur: "تھوڑا اختلاف" } },
    { value: 3, label: { en: "Neutral", ur: "غیر جانبدار" } },
    { value: 4, label: { en: "Agree a little", ur: "تھوڑا اتفاق" } },
    { value: 5, label: { en: "Agree strongly", ur: "مکمل اتفاق" } },
  ],
};

export const GAD7: AssessmentDef = {
  type: "gad7",
  titleKey: "gad7_title",
  descKey: "gad7_desc",
  scale: FREQ_GAD,
  questions: [
    { text: { en: "Feeling nervous, anxious, or on edge", ur: "بے چینی، گھبراہٹ یا ذہنی تناؤ محسوس کرنا" } },
    { text: { en: "Not being able to stop or control worrying", ur: "فکر کو روک نہ پانا" } },
    { text: { en: "Worrying too much about different things", ur: "مختلف باتوں پر بہت زیادہ فکر کرنا" } },
    { text: { en: "Trouble relaxing", ur: "آرام کرنے میں دشواری" } },
    { text: { en: "Being so restless that it is hard to sit still", ur: "اتنی بے چینی کہ بیٹھنا مشکل ہو" } },
    { text: { en: "Becoming easily annoyed or irritable", ur: "جلدی چڑچڑاہٹ ہونا" } },
    { text: { en: "Feeling afraid as if something awful might happen", ur: "ایسا خوف جیسے کچھ بُرا ہونے والا ہو" } },
  ],
};

export const PHQ9: AssessmentDef = {
  type: "phq9",
  titleKey: "phq9_title",
  descKey: "phq9_desc",
  scale: FREQ_PHQ,
  questions: [
    { text: { en: "Little interest or pleasure in doing things", ur: "کاموں میں دلچسپی یا خوشی کی کمی" } },
    { text: { en: "Feeling down, depressed, or hopeless", ur: "افسردہ یا ناامید محسوس کرنا" } },
    { text: { en: "Trouble falling or staying asleep, or sleeping too much", ur: "نیند آنے یا سونے میں دشواری، یا بہت زیادہ سونا" } },
    { text: { en: "Feeling tired or having little energy", ur: "تھکاوٹ یا کم توانائی محسوس کرنا" } },
    { text: { en: "Poor appetite or overeating", ur: "بھوک کی کمی یا زیادہ کھانا" } },
    { text: { en: "Feeling bad about yourself or that you are a failure", ur: "خود کو بُرا یا ناکام محسوس کرنا" } },
    { text: { en: "Trouble concentrating on things", ur: "توجہ مرکوز کرنے میں دشواری" } },
    { text: { en: "Moving or speaking so slowly that others noticed; or being fidgety", ur: "سست رفتاری یا بے چینی جو دوسروں نے محسوس کی" } },
    { text: { en: "Thoughts that you would be better off dead or hurting yourself", ur: "خود کو نقصان پہنچانے یا مر جانے کے خیالات" } },
  ],
};

export const PSS10: AssessmentDef = {
  type: "pss10",
  titleKey: "pss10_title",
  descKey: "pss10_desc",
  scale: FREQ_PSS,
  questions: [
    { text: { en: "Been upset because of something that happened unexpectedly", ur: "کسی غیر متوقع بات سے پریشان ہوئے" } },
    { text: { en: "Felt unable to control the important things in your life", ur: "اپنی زندگی کی اہم چیزوں کو قابو میں نہ پایا" } },
    { text: { en: "Felt nervous and stressed", ur: "گھبراہٹ اور تناؤ محسوس کیا" } },
    { text: { en: "Felt confident about handling personal problems", ur: "ذاتی مسائل سنبھالنے پر یقین تھا" }, reverse: true },
    { text: { en: "Felt that things were going your way", ur: "محسوس ہوا کہ چیزیں آپ کے حق میں ہیں" }, reverse: true },
    { text: { en: "Found that you could not cope with all the things you had to do", ur: "محسوس ہوا کہ آپ سارے کام نہیں سنبھال سکتے" } },
    { text: { en: "Were able to control irritations in your life", ur: "زندگی کی چڑچڑاہٹ پر قابو رکھ سکے" }, reverse: true },
    { text: { en: "Felt that you were on top of things", ur: "محسوس کیا کہ آپ سب پر قابو میں ہیں" }, reverse: true },
    { text: { en: "Been angered because of things outside of your control", ur: "بے قابو چیزوں پر غصہ آیا" } },
    { text: { en: "Felt difficulties were piling up so high you could not overcome them", ur: "مشکلات اتنی بڑھ گئیں کہ آپ ان پر قابو نہ پا سکیں" } },
  ],
};

const BIG5_ITEMS: Array<[string, string, "O" | "C" | "E" | "A" | "N", boolean]> = [
  ["is talkative", "بات چیت کرنے والا ہے", "E", false],
  ["tends to find fault with others", "دوسروں میں کیڑے نکالتا ہے", "A", true],
  ["does a thorough job", "کام مکمل اور باریک بینی سے کرتا ہے", "C", false],
  ["is depressed, blue", "اداس، افسردہ ہے", "N", false],
  ["is original, comes up with new ideas", "نئی سوچ رکھتا ہے", "O", false],
  ["is reserved", "خاموش طبیعت ہے", "E", true],
  ["is helpful and unselfish with others", "دوسروں کا مددگار اور بے غرض ہے", "A", false],
  ["can be somewhat careless", "کبھی لاپرواہ ہوتا ہے", "C", true],
  ["is relaxed, handles stress well", "پرسکون ہے، تناؤ سنبھال لیتا ہے", "N", true],
  ["is curious about many different things", "بہت سی چیزوں میں دلچسپی رکھتا ہے", "O", false],
  ["is full of energy", "توانائی سے بھرپور ہے", "E", false],
  ["starts quarrels with others", "جھگڑے شروع کرتا ہے", "A", true],
  ["is a reliable worker", "قابل اعتماد کارکن ہے", "C", false],
  ["can be tense", "تناؤ کا شکار ہو سکتا ہے", "N", false],
  ["is ingenious, a deep thinker", "گہرا سوچنے والا ہے", "O", false],
  ["generates a lot of enthusiasm", "بہت جوش پیدا کرتا ہے", "E", false],
  ["has a forgiving nature", "معاف کرنے والا مزاج رکھتا ہے", "A", false],
  ["tends to be disorganized", "بے ترتیب ہوتا ہے", "C", true],
  ["worries a lot", "بہت فکرمند رہتا ہے", "N", false],
  ["has an active imagination", "تخیل اچھا ہے", "O", false],
  ["tends to be quiet", "خاموش رہنے والا ہے", "E", true],
  ["is generally trusting", "عام طور پر دوسروں پر اعتماد کرتا ہے", "A", false],
  ["tends to be lazy", "سست ہو جاتا ہے", "C", true],
  ["is emotionally stable, not easily upset", "جذباتی طور پر مستحکم ہے", "N", true],
  ["is inventive", "اختراعی ہے", "O", false],
  ["has an assertive personality", "خود اعتماد شخصیت رکھتا ہے", "E", false],
  ["can be cold and aloof", "سرد اور لاتعلق ہو سکتا ہے", "A", true],
  ["perseveres until the task is finished", "کام مکمل ہونے تک ڈٹ جاتا ہے", "C", false],
  ["can be moody", "موڈ بدلتا رہتا ہے", "N", false],
  ["values artistic, aesthetic experiences", "فن اور خوبصورتی کو اہمیت دیتا ہے", "O", false],
  ["is sometimes shy, inhibited", "کبھی شرمیلا ہوتا ہے", "E", true],
  ["is considerate and kind to almost everyone", "تقریباً سب پر مہربان ہے", "A", false],
  ["does things efficiently", "کام مؤثر طریقے سے کرتا ہے", "C", false],
  ["remains calm in tense situations", "کشیدہ حالات میں پرسکون رہتا ہے", "N", true],
  ["prefers work that is routine", "روزمرہ کا کام پسند کرتا ہے", "O", true],
  ["is outgoing, sociable", "ملنسار ہے", "E", false],
  ["is sometimes rude to others", "کبھی دوسروں سے بدتمیزی کرتا ہے", "A", true],
  ["makes plans and follows through with them", "منصوبہ بناتا اور پورا کرتا ہے", "C", false],
  ["gets nervous easily", "جلدی گھبرا جاتا ہے", "N", false],
  ["likes to reflect, play with ideas", "غور و فکر کرنا پسند کرتا ہے", "O", false],
  ["has few artistic interests", "فنی دلچسپی کم ہے", "O", true],
  ["likes to cooperate with others", "دوسروں کے ساتھ تعاون پسند کرتا ہے", "A", false],
  ["is easily distracted", "آسانی سے توجہ بٹ جاتی ہے", "C", true],
  ["is sophisticated in art, music, or literature", "فن، موسیقی یا ادب میں شائستہ ہے", "O", false],
];

export const BIG5: AssessmentDef = {
  type: "big5",
  titleKey: "big5_title",
  descKey: "big5_desc",
  scale: LIKERT_BIG5,
  questions: BIG5_ITEMS.map(([en, ur, trait, reverse]) => ({
    text: { en, ur },
    trait,
    reverse,
  })),
};

export const ALL_ASSESSMENTS: AssessmentDef[] = [GAD7, PHQ9, PSS10, BIG5];

export function scoreAssessment(
  def: AssessmentDef,
  answers: number[]
): Record<string, number> {
  if (def.type === "big5") {
    const traits: Record<"O" | "C" | "E" | "A" | "N", number[]> = {
      O: [],
      C: [],
      E: [],
      A: [],
      N: [],
    };
    def.questions.forEach((q, i) => {
      const v = answers[i] ?? 3;
      const adjusted = q.reverse ? 6 - v : v;
      traits[q.trait!].push(adjusted);
    });
    const mean = (arr: number[]) =>
      arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
    return {
      openness: round(mean(traits.O)),
      conscientiousness: round(mean(traits.C)),
      extraversion: round(mean(traits.E)),
      agreeableness: round(mean(traits.A)),
      neuroticism: round(mean(traits.N)),
    };
  }
  // GAD-7, PHQ-9, PSS-10
  let total = 0;
  def.questions.forEach((q, i) => {
    const v = answers[i] ?? 0;
    total += q.reverse ? (def.scale.options.length - 1) - v : v;
  });
  const key =
    def.type === "gad7" ? "anxiety" : def.type === "phq9" ? "depression" : "stress";
  return { [key]: total };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

export function questionLabel(q: Question, lang: Lang): string {
  return q.text[lang] || q.text.en;
}
