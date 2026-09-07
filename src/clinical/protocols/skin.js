/**
 * Dermatological (Skin) Clinical History Protocols
 * 1. Skin Rash (त्वचा पर चकत्ते / दाने)
 * 2. Itching (Pruritus / खुजली)
 * 3. Skin Swelling (Angioedema / Hives / पित्ती या सूजन)
 * 4. Skin Lesion (घाव / अल्सर / Non-healing sore)
 */

export const skinProtocols = {
  rash: {
    id: 'rash',
    title: { en: 'Skin Rash', hi: 'त्वचा पर चकत्ते या दाने' },
    category: 'Dermatology',
    keywords: [
      'rash', 'skin rash', 'chakatte', 'daane', 'twacha par daane',
      'red spots', 'skin allergy', 'erythema', 'body rash'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where is the rash located on your body?",
          hi: "चकत्ते या दाने शरीर के किस हिस्से में हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["All over the body (Generalized)", "Face and neck", "Arms / Hands", "Chest / Back / Trunk", "Legs / Feet"],
          hi: ["पूरे शरीर पर", "चेहरे और गर्दन पर", "हाथों पर", "सीने या पीठ पर", "पैरों पर"]
        }
      },
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did the rash appear suddenly after taking a new medication or food, or gradually?",
          hi: "क्या यह नई दवा या खाना खाने के बाद अचानक उभरा, या धीरे-धीरे आया?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly (within hours of new medicine/food)", "Gradually over several days", "Recurrent / chronic"],
          hi: ["अचानक (नई दवा/खाने के कुछ ही घंटों में)", "धीरे-धीरे कई दिनों में", "बार-बार होता रहता है"]
        }
      },
      {
        field: 'breathing_swelling',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('breathing difficulty') || s.includes('facial swelling');
        },
        text: {
          en: "Do you have any lip/tongue swelling or difficulty breathing along with the rash?",
          hi: "क्या चकत्तों के साथ होंठ, जीभ या चेहरे पर सूजन है, या सांस लेने में परेशानी हो रही है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, swelling of lips/throat or difficulty breathing", "No swelling or breathing difficulty"],
          hi: ["हाँ, होंठ/गले में सूजन या सांस लेने में तकलीफ है", "नहीं, सिर्फ त्वचा पर दाने हैं"]
        }
      },
      {
        field: 'blistering_peeling',
        isKnown: (h) => Boolean(h?.hpi?.blistering_peeling),
        text: {
          en: "Are there painful blisters, skin peeling, or sores inside the mouth/eyes?",
          hi: "क्या त्वचा पर छाले (blisters) बन रहे हैं, खाल उतर रही है, या मुँह के अंदर छाले हैं?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, painful blisters or skin peeling / mouth sores", "No blisters or peeling"],
          hi: ["हाँ, छाले या खाल उतरने की समस्या है", "नहीं, सिर्फ लाल दाने हैं, छाले नहीं"]
        }
      }
    ]
  },

  itching: {
    id: 'itching',
    title: { en: 'Itching (Pruritus)', hi: 'खुजली (Pruritus)' },
    category: 'Dermatology',
    keywords: [
      'itching', 'khujli', 'itch', 'pruritus', 'badan mein khujli',
      'all over itching', 'skin itch', 'khujlana'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Is the itching all over your body or localized to specific areas?",
          hi: "क्या खुजली पूरे शरीर में है या किसी खास जगह पर?"
        },
        type: 'single_choice',
        options: {
          en: ["All over body without visible rash", "Localized to groin / skin folds", "Hands and feet (worse at night)", "Specific rash areas only"],
          hi: ["पूरे शरीर पर (बिना दानों के)", "जांघों/कांखों के मोड़ पर", "हाथों-पैरों पर (रात में तेज़)", "सिर्फ दाने वाली जगह पर"]
        }
      },
      {
        field: 'timing',
        isKnown: (h) => Boolean(h?.hpi?.timing),
        text: {
          en: "Is the itching worse at night when in bed?",
          hi: "क्या खुजली रात में बिस्तर पर जाने के बाद बहुत तेज़ हो जाती है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, much worse at night", "Constant day and night", "Worse after bathing"],
          hi: ["हाँ, रात में बहुत ज़्यादा बढ़ जाती है", "दिन और रात एक जैसी रहती है", "नहाने के बाद बढ़ती है"]
        }
      },
      {
        field: 'jaundice',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('jaundice') || s.includes('yellow eyes');
        },
        text: {
          en: "Have you noticed yellowing of your eyes or high dark yellow urine?",
          hi: "क्या आँखों में पीलापन या गहरे पीले रंग का पेशाब आ रहा है (पीलिया)?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, yellow eyes/urine present", "No yellowing, normal"],
          hi: ["हाँ, आँखें या पेशाब पीला है", "नहीं, पीलिया जैसा कुछ नहीं है"]
        }
      }
    ]
  },

  skin_swelling: {
    id: 'skin_swelling',
    title: { en: 'Skin Swelling & Hives (Urticaria / Angioedema)', hi: 'पित्ती या त्वचा की सूजन' },
    category: 'Dermatology',
    keywords: [
      'skin swelling', 'hives', 'urticaria', 'angioedema', 'pitti',
      'chitta', 'welts', 'lip swelling', 'face swelling'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where is the swelling or welts located?",
          hi: "सूजन या पित्ती (welts) शरीर के किस हिस्से में है?"
        },
        type: 'single_choice',
        options: {
          en: ["Face, lips, or eyelids", "Raised itchy patches (welts) on body", "Hands or feet", "Throat / Tongue"],
          hi: ["चेहरे, होंठ या पलकों पर", "शरीर पर उभरे हुए लाल चकत्ते (पित्ती)", "हाथों या पैरों पर", "गले या जीभ पर"]
        }
      },
      {
        field: 'breathing_difficulty',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('breathing difficulty') || s.includes('throat tightness');
        },
        text: {
          en: "Do you feel any throat tightness, hoarseness, or breathing difficulty?",
          hi: "क्या गले में भारीपन, आवाज़ बैठना या सांस लेने में परेशानी हो रही है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, throat tightness or difficulty breathing", "No, breathing and throat are clear"],
          hi: ["हाँ, गले में जकड़न या सांस में तकलीफ है", "नहीं, सांस बिल्कुल ठीक है"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "Do individual swollen patches disappear within 24 hours and reappear elsewhere?",
          hi: "क्या एक जगह के चकत्ते 24 घंटे में मिटकर दूसरी जगह निकलते हैं?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, they shift from place to place within 24 hours (Urticaria)", "No, swelling stays fixed"],
          hi: ["हाँ, 24 घंटे में मिटते हैं और दूसरी जगह आते हैं", "नहीं, सूजन एक ही जगह बनी हुई है"]
        }
      }
    ]
  },

  skin_lesion: {
    id: 'skin_lesion',
    title: { en: 'Skin Lesion / Ulcer', hi: 'त्वचा पर घाव या छाला' },
    category: 'Dermatology',
    keywords: [
      'skin lesion', 'skin ulcer', 'ghaav', 'wound', 'non healing ulcer',
      'fohda', 'phoda', 'boil', 'abscess'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where is the wound or lesion located?",
          hi: "घाव या छाला किस जगह पर है?"
        },
        type: 'single_choice',
        options: {
          en: ["Foot / Sole / Toe (especially in diabetes)", "Lower leg / Shin", "Face or neck", "Other body part"],
          hi: ["पैर / तलवे / अंगूठे पर (खासकर शुगर में)", "पैर की पिंडली पर", "चेहरे या गर्दन पर", "शरीर के अन्य हिस्से में"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long has this wound been present without healing?",
          hi: "यह घाव कितने समय से ठीक नहीं हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["A few days to 1 week", "2 to 4 weeks", "More than a month (Non-healing)"],
          hi: ["कुछ दिनों से 1 हफ्ते से", "2 से 4 हफ्तों से", "एक महीने से ज़्यादा समय से"]
        }
      },
      {
        field: 'pus_discharge',
        isKnown: (h) => Boolean(h?.hpi?.pus_discharge),
        text: {
          en: "Is there foul smell, pus drainage, or spreading redness around the wound?",
          hi: "क्या घाव से बदबू, पीप बहना या आसपास तेज़ी से लालपन फैल रहा है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, foul smell or pus / spreading redness", "No pus or redness"],
          hi: ["हाँ, बदबू, पीप या लालपन फैल रहा है", "नहीं, घाव साफ है"]
        }
      }
    ]
  }
};

export default skinProtocols;
