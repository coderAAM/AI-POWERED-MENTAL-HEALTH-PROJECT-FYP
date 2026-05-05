export type Lang = "en" | "ur";

type Entry = { en: string; ur: string };

export const translations = {
  // Brand
  app_name: { en: "Psychwell", ur: "سائیک‌ویل" },
  brand_tagline: { en: "Your safe space for the mind", ur: "ذہن کے لیے آپ کی محفوظ جگہ" },

  // Welcome
  welcome_title: { en: "A calmer mind starts here.", ur: "پرسکون ذہن یہاں سے شروع ہوتا ہے۔" },
  welcome_subtitle: {
    en: "Psychwell is a private, AI-guided wellness companion built for Pakistan. Talk things out, take real assessments, and find a doctor who speaks your language.",
    ur: "سائیک‌ویل ایک نجی، اے آئی پر مبنی ذہنی صحت کا ساتھی ہے جو پاکستان کے لیے بنایا گیا ہے۔ بات کریں، حقیقی جائزے لیں، اور ایسا ڈاکٹر تلاش کریں جو آپ کی زبان بولتا ہو۔",
  },
  get_started: { en: "Get Started", ur: "شروع کریں" },
  learn_more: { en: "Learn more", ur: "مزید جانیں" },
  feature_chat_title: { en: "Talk to an AI Therapist", ur: "اے آئی تھیراپسٹ سے بات کریں" },
  feature_chat_desc: { en: "Anytime, in English or Urdu. Judgement-free.", ur: "کسی بھی وقت، انگریزی یا اردو میں۔ بغیر کسی فیصلے کے۔" },
  feature_assess_title: { en: "Real Assessments", ur: "حقیقی جائزے" },
  feature_assess_desc: { en: "GAD-7, PHQ-9, PSS-10 and Big Five — scored on the spot.", ur: "GAD-7، PHQ-9، PSS-10 اور Big Five — موقع پر اسکور۔" },
  feature_plan_title: { en: "A Plan Made For You", ur: "آپ کے لیے خاص منصوبہ" },
  feature_plan_desc: { en: "Sleep, food, movement and coping — personalised by AI.", ur: "نیند، خوراک، حرکت اور موافقت — اے آئی کے ذریعے ذاتی۔" },
  feature_doctor_title: { en: "Real Pakistani Doctors", ur: "حقیقی پاکستانی ڈاکٹرز" },
  feature_doctor_desc: { en: "Browse psychiatrists and psychologists in your city.", ur: "اپنے شہر میں ماہر نفسیات اور سائیکالوجسٹ تلاش کریں۔" },

  // Login
  login_title: { en: "Welcome to Psychwell", ur: "سائیک‌ویل میں خوش آمدید" },
  login_subtitle: { en: "Sign in to your safe space", ur: "اپنی محفوظ جگہ میں سائن ان کریں" },
  name: { en: "Full Name", ur: "پورا نام" },
  email: { en: "Email Address", ur: "ای میل ایڈریس" },
  continue_demo: { en: "Continue as Demo Patient", ur: "ڈیمو مریض کے طور پر جاری رکھیں" },
  login: { en: "Log In", ur: "لاگ ان" },
  login_disclaimer: {
    en: "Your data stays on this device. We don't store anything on a server.",
    ur: "آپ کا ڈیٹا اسی ڈیوائس پر رہتا ہے۔ ہم سرور پر کچھ نہیں رکھتے۔",
  },

  // Nav
  dashboard: { en: "Dashboard", ur: "ڈیش بورڈ" },
  chat: { en: "AI Therapist", ur: "اے آئی تھیراپسٹ" },
  assess: { en: "Assessments", ur: "جائزے" },
  mood: { en: "Mood Tracker", ur: "موڈ ٹریکر" },
  doctors: { en: "Find Doctors", ur: "ڈاکٹرز تلاش کریں" },
  appointments: { en: "Appointments", ur: "ملاقاتیں" },
  call_doctor: { en: "Call AI Doctor", ur: "اے آئی ڈاکٹر کو کال کریں" },
  settings: { en: "Settings", ur: "ترتیبات" },
  logout: { en: "Log out", ur: "لاگ آؤٹ" },
  clear_data: { en: "Clear All Data", ur: "تمام ڈیٹا صاف کریں" },

  // Dashboard
  hello: { en: "Hello", ur: "السلام علیکم" },
  how_feel_today: { en: "How are you feeling today?", ur: "آج آپ کیسا محسوس کر رہے ہیں؟" },
  today_mood: { en: "Today's Mood", ur: "آج کا موڈ" },
  not_logged_today: { en: "Not logged yet", ur: "ابھی درج نہیں" },
  log_now: { en: "Log now", ur: "ابھی درج کریں" },
  streak: { en: "Day Streak", ur: "روزانہ سلسلہ" },
  streak_day: { en: "day", ur: "دن" },
  streak_days: { en: "days", ur: "دن" },
  entries: { en: "Mood Entries", ur: "موڈ اندراجات" },
  recent_severity: { en: "Latest Severity", ur: "حالیہ شدت" },
  none_yet: { en: "None yet", ur: "ابھی کوئی نہیں" },
  trend: { en: "Mood Trend", ur: "موڈ کا رجحان" },
  next_appt: { en: "Next Appointment", ur: "اگلی ملاقات" },
  no_upcoming: { en: "No upcoming", ur: "آنے والی نہیں" },
  mood_history: { en: "Mood, Last 14 Days", ur: "موڈ، گزشتہ 14 دن" },
  recent_appts: { en: "Recent Appointments", ur: "حالیہ ملاقاتیں" },
  quick_actions: { en: "Quick actions", ur: "فوری اعمال" },
  open: { en: "Open", ur: "کھولیں" },

  // Chat
  not_substitute: {
    en: "Psychwell is not a substitute for emergency care. If you're in crisis, please call Umang helpline: 0311-7786264.",
    ur: "سائیک‌ویل ہنگامی دیکھ بھال کا متبادل نہیں ہے۔ بحران کی صورت میں، اُمنگ ہیلپ لائن پر کال کریں: 0311-7786264۔",
  },
  type_message: { en: "Type your message...", ur: "اپنا پیغام لکھیں..." },
  send: { en: "Send", ur: "بھیجیں" },
  thinking: { en: "Thinking...", ur: "سوچ رہا ہوں..." },
  chat_intro_therapist: {
    en: "I'm here to listen. What's on your mind today?",
    ur: "میں سننے کے لیے یہاں ہوں۔ آج آپ کے ذہن میں کیا ہے؟",
  },
  chat_intro_doctor: {
    en: "Hello, I'm an AI Doctor. This is a simulated consultation, not real medical care. Tell me what's been bothering you, and I'll ask a few questions.",
    ur: "السلام علیکم، میں ایک اے آئی ڈاکٹر ہوں۔ یہ ایک نقلی مشاورت ہے، حقیقی طبی دیکھ بھال نہیں۔ بتائیں کیا تکلیف ہے، میں چند سوالات پوچھوں گا۔",
  },
  end_call: { en: "End Call", ur: "کال ختم کریں" },
  doctor_on_call: { en: "AI Doctor is on the line", ur: "اے آئی ڈاکٹر کال پر ہیں" },
  call_starting: { en: "Connecting...", ur: "رابطہ ہو رہا ہے..." },
  speak_freely: { en: "Speak freely. Everything stays on your device.", ur: "آزادانہ بات کریں۔ سب کچھ آپ کی ڈیوائس پر رہتا ہے۔" },

  // Doctors
  book_appointment: { en: "Book Appointment", ur: "ملاقات بک کریں" },
  date: { en: "Date", ur: "تاریخ" },
  time: { en: "Time", ur: "وقت" },
  reason: { en: "Reason for visit", ur: "وجہ" },
  confirm_booking: { en: "Confirm Booking", ur: "بکنگ کی تصدیق کریں" },
  cancel: { en: "Cancel", ur: "منسوخ کریں" },
  available_days: { en: "Available Days", ur: "دستیاب دن" },
  fee: { en: "Consultation Fee", ur: "فیس" },
  experience: { en: "Experience", ur: "تجربہ" },
  years: { en: "years", ur: "سال" },
  search_doctors: { en: "Search by name or hospital...", ur: "نام یا ہسپتال سے تلاش کریں..." },
  filter_city: { en: "City", ur: "شہر" },
  filter_specialty: { en: "Specialty", ur: "مہارت" },
  all_cities: { en: "All cities", ur: "تمام شہر" },
  all_specialties: { en: "All specialties", ur: "تمام مہارتیں" },
  view_profile: { en: "View Profile", ur: "پروفائل دیکھیں" },
  bio: { en: "About", ur: "تعارف" },
  qualifications: { en: "Qualifications", ur: "اہلیتیں" },
  hospital: { en: "Hospital", ur: "ہسپتال" },
  address: { en: "Address", ur: "پتہ" },
  phone: { en: "Phone", ur: "فون" },
  languages: { en: "Languages", ur: "زبانیں" },
  back: { en: "Back", ur: "واپس" },
  no_doctors: { en: "No doctors match your filters.", ur: "آپ کے فلٹرز سے کوئی ڈاکٹر مماثل نہیں۔" },
  booked_toast: { en: "Appointment booked.", ur: "ملاقات بک ہو گئی۔" },

  // Appointments
  upcoming: { en: "Upcoming", ur: "آنے والی" },
  past: { en: "Past & Cancelled", ur: "پرانی و منسوخ" },
  no_appts: { en: "You have no appointments yet.", ur: "ابھی آپ کی کوئی ملاقات نہیں۔" },
  cancel_appt: { en: "Cancel appointment", ur: "ملاقات منسوخ کریں" },
  status_booked: { en: "Booked", ur: "بک شدہ" },
  status_cancelled: { en: "Cancelled", ur: "منسوخ" },

  // Mood
  log_mood: { en: "How are you today?", ur: "آج آپ کیسے ہیں؟" },
  mood_1: { en: "Very low", ur: "بہت کم" },
  mood_2: { en: "Low", ur: "کم" },
  mood_3: { en: "Okay", ur: "ٹھیک" },
  mood_4: { en: "Good", ur: "اچھا" },
  mood_5: { en: "Great", ur: "بہترین" },
  note: { en: "Add a note (optional)", ur: "نوٹ شامل کریں (اختیاری)" },
  see_yourself: { en: "See yourself", ur: "خود کو دیکھیں" },
  open_camera: { en: "Open camera", ur: "کیمرہ کھولیں" },
  close_camera: { en: "Close camera", ur: "کیمرہ بند کریں" },
  camera_connecting: { en: "Connecting camera...", ur: "کیمرہ جوڑا جا رہا ہے..." },
  camera_note: {
    en: "Looking at yourself helps you name what you feel. The AI cannot read your face — you choose the word that fits.",
    ur: "خود کو دیکھنے سے آپ کو اپنے جذبات کو نام دینے میں مدد ملتی ہے۔ اے آئی آپ کا چہرہ نہیں پڑھ سکتا — آپ خود مناسب لفظ منتخب کریں۔",
  },
  camera_denied: { en: "Camera blocked. You can still pick an emotion below.", ur: "کیمرہ بلاک ہے۔ آپ پھر بھی نیچے سے جذبہ منتخب کر سکتے ہیں۔" },
  pick_emotion: { en: "Pick the closest word", ur: "قریب ترین لفظ چنیں" },
  emotion_happy: { en: "Happy", ur: "خوش" },
  emotion_sad: { en: "Sad", ur: "اداس" },
  emotion_anxious: { en: "Anxious", ur: "پریشان" },
  emotion_angry: { en: "Angry", ur: "ناراض" },
  emotion_numb: { en: "Numb", ur: "بے حس" },
  emotion_hopeful: { en: "Hopeful", ur: "پرامید" },
  emotion_tired: { en: "Tired", ur: "تھکا ہوا" },
  emotion_calm: { en: "Calm", ur: "پرسکون" },
  save_entry: { en: "Save entry", ur: "اندراج محفوظ کریں" },
  saved: { en: "Saved.", ur: "محفوظ ہو گیا۔" },
  recent_entries: { en: "Recent entries", ur: "حالیہ اندراجات" },
  no_entries: { en: "No mood entries yet.", ur: "ابھی کوئی موڈ اندراج نہیں۔" },

  // Assess
  assess_pick: { en: "Pick an assessment", ur: "ایک جائزہ چنیں" },
  start_assessment: { en: "Start", ur: "شروع کریں" },
  retake: { en: "Retake", ur: "دوبارہ لیں" },
  question: { en: "Question", ur: "سوال" },
  of: { en: "of", ur: "میں سے" },
  finish: { en: "Get my plan", ur: "میرا منصوبہ دیں" },
  generating_plan: { en: "Crafting your plan...", ur: "آپ کا منصوبہ تیار ہو رہا ہے..." },
  your_plan: { en: "Your Personalized Plan", ur: "آپ کا ذاتی منصوبہ" },
  plan_again: { en: "Take another assessment", ur: "ایک اور جائزہ لیں" },
  severity_minimal: { en: "Minimal", ur: "کم سے کم" },
  severity_mild: { en: "Mild", ur: "ہلکی" },
  severity_moderate: { en: "Moderate", ur: "درمیانی" },
  severity_severe: { en: "Severe", ur: "شدید" },
  sleep: { en: "Sleep", ur: "نیند" },
  food: { en: "Food", ur: "خوراک" },
  exercise: { en: "Exercise", ur: "ورزش" },
  supplements: { en: "Supplements", ur: "سپلیمنٹس" },
  coping: { en: "Coping Strategies", ur: "موافقتی تدابیر" },
  warning: { en: "Important", ur: "اہم نوٹس" },
  gad7_title: { en: "GAD-7 — Anxiety", ur: "GAD-7 — بے چینی" },
  gad7_desc: { en: "7 questions on anxiety symptoms.", ur: "بے چینی کی علامات پر 7 سوالات۔" },
  phq9_title: { en: "PHQ-9 — Depression", ur: "PHQ-9 — افسردگی" },
  phq9_desc: { en: "9 questions on depressive symptoms.", ur: "افسردگی کی علامات پر 9 سوالات۔" },
  pss10_title: { en: "PSS-10 — Stress", ur: "PSS-10 — تناؤ" },
  pss10_desc: { en: "10 questions on perceived stress.", ur: "محسوس کردہ تناؤ پر 10 سوالات۔" },
  big5_title: { en: "Big Five Personality", ur: "بِگ فائیو شخصیت" },
  big5_desc: { en: "44 short statements about who you are.", ur: "آپ کی شخصیت پر 44 مختصر بیانات۔" },
  scale_gad: {
    en: "Over the last 2 weeks, how often have you been bothered by:",
    ur: "گزشتہ 2 ہفتوں میں آپ کتنی بار ان سے پریشان ہوئے:",
  },
  scale_phq: {
    en: "Over the last 2 weeks, how often have you been bothered by:",
    ur: "گزشتہ 2 ہفتوں میں آپ کتنی بار ان سے پریشان ہوئے:",
  },
  scale_pss: {
    en: "In the last month, how often have you felt this?",
    ur: "گزشتہ مہینے میں آپ نے یہ کتنی بار محسوس کیا؟",
  },
  scale_big5: {
    en: "I see myself as someone who...",
    ur: "میں خود کو ایسا شخص سمجھتا ہوں جو...",
  },

  // Settings
  edit_profile: { en: "Edit profile", ur: "پروفائل میں ترمیم" },
  language: { en: "Language", ur: "زبان" },
  english: { en: "English", ur: "انگریزی" },
  urdu: { en: "Urdu", ur: "اردو" },
  save: { en: "Save", ur: "محفوظ کریں" },
  data: { en: "Your data", ur: "آپ کا ڈیٹا" },
  data_desc: {
    en: "Everything is stored only in this browser. Clearing data cannot be undone.",
    ur: "سب کچھ صرف اس براؤزر میں محفوظ ہے۔ ڈیٹا صاف کرنا ناقابلِ واپسی ہے۔",
  },
  confirm_clear: { en: "Yes, clear everything", ur: "ہاں، سب کچھ صاف کریں" },
  cleared: { en: "All data cleared.", ur: "تمام ڈیٹا صاف ہو گیا۔" },
  saved_profile: { en: "Profile saved.", ur: "پروفائل محفوظ ہو گئی۔" },

  // Theme
  theme: { en: "Appearance", ur: "ظاہری شکل" },
  theme_light: { en: "Light", ur: "لائٹ" },
  theme_dark: { en: "Dark", ur: "ڈارک" },
} satisfies Record<string, Entry>;

export type TranslationKey = keyof typeof translations;

export const t = (key: TranslationKey, lang: Lang) =>
  translations[key]?.[lang] ?? translations[key]?.en ?? String(key);
