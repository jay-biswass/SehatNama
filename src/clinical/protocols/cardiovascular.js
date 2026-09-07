/**
 * Cardiovascular Clinical History Protocols
 * 1. Chest Pain
 * 2. Palpitations
 * 3. Leg Swelling
 */

export const cardiovascularProtocols = {
  chest_pain: {
    id: 'chest_pain',
    title: { en: 'Chest Pain', hi: 'सीने में दर्द' },
    category: 'Cardiovascular',
    keywords: [
      'chest pain', 'seene mein dard', 'chhati mein dard', 'chest pressure',
      'chest heaviness', 'angina', 'seene me jalan', 'heart pain', 'chhati me dard'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where exactly in your chest do you feel the pain?",
          hi: "सीने में ठीक किस जगह दर्द महसूस हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Center of the chest", "Left side of the chest", "Right side of the chest", "Whole chest"],
          hi: ["सीने के बीच में (Center)", "सीने की बाईं तरफ (Left side)", "सीने की दाईं तरफ (Right side)", "पूरे सीने में"]
        }
      },
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did the pain start suddenly or gradually?",
          hi: "दर्द अचानक शुरू हुआ या धीरे-धीरे?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly", "Gradually"],
          hi: ["अचानक (Suddenly)", "धीरे-धीरे (Gradually)"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration || h?.hpi?.timing),
        text: {
          en: "When did the pain start or how long has it lasted?",
          hi: "दर्द कब शुरू हुआ था या कितने समय से है?"
        },
        type: 'single_choice',
        options: {
          en: ["Just now", "A few hours ago", "Since yesterday / 1 day", "2-3 days ago", "More than a week"],
          hi: ["अभी-अभी (Just now)", "कुछ घंटे पहले", "कल से (1 day ago)", "2-3 दिन से", "एक हफ्ते से ज्यादा"]
        }
      },
      {
        field: 'severity',
        isKnown: (h) => h?.hpi?.severity !== null && h?.hpi?.severity !== undefined,
        text: {
          en: "On a scale of 0 to 10, how severe is the pain?",
          hi: "0 से 10 के पैमाने पर दर्द कितना तेज़ है?"
        },
        type: 'scale',
        options: {
          en: ["2 (Mild)", "5 (Moderate)", "8 (Severe)", "10 (Unbearable)"],
          hi: ["2 (हल्का दर्द)", "5 (मध्यम दर्द)", "8 (बहुत तेज़ दर्द)", "10 (असहनीय)"]
        }
      },
      {
        id: 'dyspnea',
        field: 'breathing',
        canonical: 'dyspnea',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          const neg = h?.negated_symptoms || [];
          const status = h?.symptom_status?.dyspnea || h?.symptom_status?.breathing;
          const answered = (h?.answered_questions || []).includes('dyspnea') || (h?.answered_questions || []).includes('breathing');
          return answered || status !== undefined || s.includes('breathing difficulty') || neg.includes('breathing difficulty') || s.includes('dyspnea') || neg.includes('dyspnea');
        },
        text: {
          en: "Are you having any difficulty breathing?",
          hi: "क्या आपको सांस लेने में परेशानी हो रही है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, having difficulty breathing", "No difficulty breathing"],
          hi: ["हाँ, सांस लेने में परेशानी है", "नहीं, सांस ठीक है"]
        }
      },
      {
        id: 'sweating',
        field: 'sweating',
        canonical: 'sweating',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          const neg = h?.negated_symptoms || [];
          const status = h?.symptom_status?.sweating;
          const answered = (h?.answered_questions || []).includes('sweating');
          return answered || status !== undefined || s.includes('sweating') || neg.includes('sweating');
        },
        text: {
          en: "Are you experiencing unusual sweating or cold sweats?",
          hi: "क्या आपको असामान्य पसीना या घबराहट हो रही है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, sweating unusually", "No sweating"],
          hi: ["हाँ, पसीना आ रहा है", "नहीं, पसीना नहीं है"]
        }
      },
      {
        field: 'character',
        isKnown: (h) => Boolean(h?.hpi?.character),
        text: {
          en: "How would you describe the pain (e.g. pressure, sharp, burning)?",
          hi: "दर्द किस तरह का महसूस होता है (जैसे भारीपन, दबाव, चुभन या जलन)?"
        },
        type: 'single_choice',
        options: {
          en: ["Pressure or tightness", "Sharp or stabbing", "Burning sensation", "Heavy dull ache"],
          hi: ["दबाव या जकड़न (Pressure)", "तेज़ चुभन (Sharp)", "जलन जैसा (Burning)", "भारीपन (Heavy ache)"]
        }
      },
      {
        field: 'radiation',
        isKnown: (h) => Boolean(h?.hpi?.radiation),
        text: {
          en: "Does the pain spread to your arm, shoulder, neck, jaw, or back?",
          hi: "क्या यह दर्द आपके हाथ, कंधे, गर्दन, जबड़े या पीठ तक जा रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Spreads to left arm", "Spreads to jaw / neck", "Spreads to back", "Does not spread anywhere"],
          hi: ["बाएं हाथ में जा रहा है (Left arm)", "जबड़े / गर्दन तक", "पीठ तक", "कहीं नहीं फैलता (No spread)"]
        }
      },
      {
        field: 'nausea_dizziness',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('nausea') || s.includes('dizziness');
        },
        text: {
          en: "Are you feeling nausea, dizziness, or lightheadedness?",
          hi: "क्या आपको चक्कर, उल्टी जैसा लगना या सिर घूमना महसूस हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Feeling dizzy", "Feeling nauseous", "Both", "Neither"],
          hi: ["चक्कर आ रहे हैं", "उल्टी जैसा लग रहा है", "दोनों हो रहा है", "कोई नहीं"]
        }
      },
      {
        field: 'past_medical_history',
        isKnown: (h) => Array.isArray(h?.past_medical_history) && h.past_medical_history.length > 0,
        text: {
          en: "Do you have any known medical conditions like high BP, diabetes, or heart problems?",
          hi: "क्या आपको पहले से हाई बीपी, शुगर (डायबिटीज) या दिल की कोई बीमारी है?"
        },
        type: 'single_choice',
        options: {
          en: ["High Blood Pressure (BP)", "Diabetes (Sugar)", "Heart problem / Prior attack", "None of these"],
          hi: ["हाई ब्लड प्रेशर (High BP)", "डायबिटीज (शुगर)", "दिल की बीमारी / पहले अटैक", "इनमें से कोई नहीं"]
        }
      }
    ]
  },

  palpitations: {
    id: 'palpitations',
    title: { en: 'Palpitations', hi: 'दिल की धड़कन तेज होना (घबराहट)' },
    category: 'Cardiovascular',
    keywords: [
      'palpitations', 'dil ki dhadkan', 'dhadkan tez', 'racing heart', 'heart fluttering',
      'ghabrahat', 'skipping beats', 'pounding heart'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "When did you first notice your heart racing or fluttering?",
          hi: "धड़कन तेज या असामान्य महसूस होना कब से शुरू हुआ?"
        },
        type: 'single_choice',
        options: {
          en: ["Today / Just now", "A few days ago", "Weeks or months ago"],
          hi: ["आज / अभी से", "कुछ दिन पहले से", "हफ़्तों या महीनों से"]
        }
      },
      {
        field: 'regularity',
        isKnown: (h) => Boolean(h?.hpi?.regularity),
        text: {
          en: "Does the heartbeat feel regular (fast like running) or irregular (skipping beats)?",
          hi: "धड़कन नियमित रूप से तेज है या बीच-बीच में छूटती हुई (अनियमित) लगती है?"
        },
        type: 'single_choice',
        options: {
          en: ["Fast but regular", "Irregular / skipping beats", "Not sure"],
          hi: ["तेज़ लेकिन नियमित", "अनियमित / धड़कन छूट रही है", "पता नहीं"]
        }
      },
      {
        field: 'associated_chest_pain',
        isKnown: (h) => Boolean(h?.hpi?.associated_chest_pain),
        text: {
          en: "Are you also experiencing chest pain or tightness?",
          hi: "क्या इसके साथ सीने में दर्द या भारीपन भी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, experiencing chest pain", "No chest pain"],
          hi: ["हाँ, सीने में दर्द भी है", "नहीं, सीने में दर्द नहीं है"]
        }
      },
      {
        field: 'breathlessness',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('breathing difficulty');
        },
        text: {
          en: "Are you having difficulty breathing or shortness of breath?",
          hi: "क्या आपको सांस लेने में तकलीफ हो रही है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, breathless", "No breathing difficulty"],
          hi: ["हाँ, सांस फूल रही है", "नहीं, सांस ठीक है"]
        }
      },
      {
        field: 'dizziness_fainting',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('dizziness') || s.includes('fainting');
        },
        text: {
          en: "Have you felt faint, dizzy, or lost consciousness?",
          hi: "क्या चक्कर आए हैं या बेहोशी महसूस हुई है?"
        },
        type: 'single_choice',
        options: {
          en: ["Felt dizzy / lightheaded", "Passed out / fainted", "Neither"],
          hi: ["चक्कर आया", "बेहोशी हुई थी", "दोनों में से कुछ नहीं"]
        }
      }
    ]
  },

  leg_swelling: {
    id: 'leg_swelling',
    title: { en: 'Leg Swelling', hi: 'पैरों या टखनों में सूजन' },
    category: 'Cardiovascular',
    keywords: [
      'leg swelling', 'pairon mein sujan', 'swollen legs', 'swollen ankles',
      'edema', 'pair sujna', 'feet swelling'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Is the swelling in one leg or both legs?",
          hi: "सूजन एक पैर में है या दोनों पैरों में?"
        },
        type: 'single_choice',
        options: {
          en: ["Both legs", "Only left leg", "Only right leg"],
          hi: ["दोनों पैरों में", "सिर्फ बाएं पैर में", "सिर्फ दाएं पैर में"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this leg swelling?",
          hi: "पैरों में सूजन कितने समय से है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started suddenly today/yesterday", "A few days to 1 week", "Weeks or months"],
          hi: ["अचानक आज या कल शुरू हुई", "कुछ दिन या 1 हफ्ते से", "काफी हफ़्तों या महीनों से"]
        }
      },
      {
        field: 'pain_redness',
        isKnown: (h) => Boolean(h?.hpi?.pain_redness),
        text: {
          en: "Is there pain, warmth, or redness in the swollen area?",
          hi: "क्या सूजन वाली जगह पर दर्द, लाली या गर्माहट है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, painful and red/warm", "No pain or redness"],
          hi: ["हाँ, दर्द और लाली है", "नहीं, सिर्फ सूजन है"]
        }
      },
      {
        field: 'breathlessness',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('breathing difficulty');
        },
        text: {
          en: "Are you also having any breathing difficulty, especially when lying flat?",
          hi: "क्या सांस फूलने की समस्या भी है, खासकर सीधे लेटने पर?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, breathing difficulty present", "No breathing difficulty"],
          hi: ["हाँ, सांस लेने में तकलीफ है", "नहीं, सांस ठीक है"]
        }
      }
    ]
  }
};

export default cardiovascularProtocols;
