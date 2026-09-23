// Static translations - no live translation API calls, so this works
// fully offline and never fails mid-demo. Add more languages by adding
// another key here (e.g. "bo" for Bodo, "kha" for Khasi) with the same
// set of string keys.

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "as", label: "অসমীয়া" },
  { code: "brx", label: "बड़ो" },      // Bodo - script/spelling unverified, check before demo
  { code: "mni", label: "Manipuri" },  // Meitei script label unverified, check before demo
  { code: "ne", label: "नेपाली" },
];

export const TRANSLATIONS = {
  en: {
    appTitle: "Memora",
    chooseRole: "Who is using this app?",
    patientRole: "Patient",
    patientRoleDesc: "Play memory games",
    caregiverRole: "Caregiver",
    caregiverRoleDesc: "View progress and trends",
    linkCodeLabel: "Family link code",
    linkCodeHint:
      "Use the same code on the patient's and caregiver's phone so the caregiver can see this patient's progress.",
    continueBtn: "Continue",
    hello: "Hello!",
    linkedAs: "Linked as",
    patternRecallTitle: "Pattern recall",
    patternRecallDesc: "Watch and repeat the sequence",
    faceNameTitle: "Face and name",
    faceNameDesc: "Remember who is who",
    switchRole: "Switch role",
    watchInstruction: "Watch the tiles light up, then tap them back in the same order.",
    yourTurnInstruction: "Your turn - tap the sequence",
    watchingText: "Watch...",
    startBtn: "Start",
    playAgainBtn: "Play again",
    rememberInstruction: "Remember each face and name, then pick the right name when asked.",
    rememberThisPerson: "Remember this person",
    whoIsThis: "Who is this?",
    greatJob: "Great job! Next round will be a bit harder.",
    goodTry: "Good try. Next round will be a bit easier.",
    niceWork: "Nice work. Same difficulty next round.",
    level: "Level",
  },
  as: {
    appTitle: "মেমোৰা",
    chooseRole: "এই এপ্‌টো কোনে ব্যৱহাৰ কৰিছে?",
    patientRole: "ৰোগী",
    patientRoleDesc: "স্মৃতি খেল খেলক",
    caregiverRole: "যত্নকাৰী",
    caregiverRoleDesc: "অগ্ৰগতি চাওক",
    linkCodeLabel: "পৰিয়ালৰ লিংক ক\u200cড",
    linkCodeHint:
      "ৰোগী আৰু যত্নকাৰী দুয়োৰে ফোনত একেটা ক\u200cড ব্যৱহাৰ কৰক।",
    continueBtn: "আগবাঢ়ক",
    hello: "নমস্কাৰ!",
    linkedAs: "লিংক কৰা হৈছে",
    patternRecallTitle: "আৰ্হি মনত ৰখা",
    patternRecallDesc: "ক্ৰম দেখি পুনৰাবৃত্তি কৰক",
    faceNameTitle: "মুখ আৰু নাম",
    faceNameDesc: "কোন কোন মনত ৰাখক",
    switchRole: "ভূমিকা সলনি কৰক",
    watchInstruction: "টাইলবোৰ চাওক, তাৰ পিছত একে ক্ৰমত টিপক।",
    yourTurnInstruction: "আপোনাৰ পাল - ক্ৰমটো টিপক",
    watchingText: "চাই থাকক...",
    startBtn: "আৰম্ভ কৰক",
    playAgainBtn: "পুনৰ খেলক",
    rememberInstruction: "প্ৰতিটো মুখ আৰু নাম মনত ৰাখক, তাৰ পিছত সঠিক নাম বাছক।",
    rememberThisPerson: "এই মানুহজনক মনত ৰাখক",
    whoIsThis: "এওঁ কোন?",
    greatJob: "ভাল হৈছে! পৰৱৰ্তী পৰ্ব অলপ কঠিন হ\u200cব।",
    goodTry: "ভাল চেষ্টা। পৰৱৰ্তী পৰ্ব অলপ সহজ হ\u200cব।",
    niceWork: "ভাল কাম। একে কঠিনতা পৰৱৰ্তী পৰ্বত।",
    level: "স্তৰ",
  },
};

export function translate(langCode, key) {
  return TRANSLATIONS[langCode]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}
