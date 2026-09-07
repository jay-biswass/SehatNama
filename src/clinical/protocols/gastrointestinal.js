/**
 * Gastrointestinal Clinical History Protocols
 * 13. Abdominal Pain
 * 14. Nausea / Vomiting
 * 15. Diarrhea
 * 16. Constipation
 * 17. Loss of Appetite
 */

export const gastrointestinalProtocols = {
  abdominal_pain: {
    id: 'abdominal_pain',
    title: { en: 'Abdominal Pain', hi: 'पेट में दर्द' },
    category: 'Gastrointestinal',
    keywords: [
      'abdominal pain', 'pet mein dard', 'stomach pain', 'pet dard',
      'belly pain', 'stomach ache', 'cramps in stomach', 'pet me dard'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where in your abdomen is the pain located?",
          hi: "पेट में दर्द किस जगह हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Upper abdomen", "Lower right side", "Lower left side", "Around belly button", "All over abdomen"],
          hi: ["पेट के ऊपरी हिस्से में", "निचले दाएं हिस्से में (Lower Right)", "निचले बाएं हिस्से में (Lower Left)", "नाभि के आसपास", "पूरे पेट में"]
        }
      },
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did the abdominal pain start suddenly or build up gradually?",
          hi: "यह दर्द अचानक शुरू हुआ था या धीरे-धीरे?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly", "Gradually"],
          hi: ["अचानक (Suddenly)", "धीरे-धीरे (Gradually)"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this stomach pain?",
          hi: "पेट में दर्द कितने समय से है?"
        },
        type: 'single_choice',
        options: {
          en: ["Just today / few hours", "1-2 days", "More than a week"],
          hi: ["आज कुछ घंटों से", "1-2 दिन से", "एक हफ्ते से ज्यादा"]
        }
      },
      {
        field: 'severity',
        isKnown: (h) => h?.hpi?.severity !== null && h?.hpi?.severity !== undefined,
        text: {
          en: "On a scale of 0 to 10, how severe is the stomach pain?",
          hi: "0 से 10 के पैमाने पर दर्द कितना तेज़ है?"
        },
        type: 'scale',
        options: {
          en: ["3 (Mild)", "6 (Moderate)", "8 (Severe)", "10 (Unbearable)"],
          hi: ["3 (हल्का दर्द)", "6 (मध्यम दर्द)", "8 (तेज़ दर्द)", "10 (असहनीय दर्द)"]
        }
      },
      {
        field: 'associated_bleeding_vomiting',
        isKnown: (h) => Boolean(h?.hpi?.associated_bleeding_vomiting),
        text: {
          en: "Are you vomiting blood, or noticing black tarry stool or blood in stool?",
          hi: "क्या उल्टी में खून आया है या मल (पॉटी) में खून या काला रंग दिखा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Vomited blood or black material", "Blood or black stool noticed", "Neither (regular vomiting/diarrhea only)", "No vomiting or stool changes"],
          hi: ["उल्टी में खून आया है", "मल में खून या कालापन है", "दोनों नहीं (सिर्फ सामान्य उल्टी/दस्त)", "कोई उल्टी या खून नहीं"]
        }
      },
      {
        field: 'fever_rigid',
        isKnown: (h) => Boolean(h?.hpi?.fever_rigid),
        text: {
          en: "Do you have high fever, or does your abdomen feel rock-hard and agonizing to touch?",
          hi: "क्या तेज बुखार है, या पेट छूने पर बहुत सख्त (पत्थर जैसा) और असहनीय दर्द होता है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, high fever or rigid abdomen", "No fever or rigidity"],
          hi: ["हाँ, तेज़ बुखार या पेट बहुत कड़ा है", "नहीं, पेट छूने पर सामान्य है"]
        }
      }
    ]
  },

  nausea_vomiting: {
    id: 'nausea_vomiting',
    title: { en: 'Nausea or Vomiting', hi: 'उल्टी या मतली (Nausea / Vomiting)' },
    category: 'Gastrointestinal',
    keywords: [
      'nausea', 'vomiting', 'ulti', 'matli', 'ghabrahat', 'ulti aana',
      'throwing up', 'puking'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you been feeling nauseous or vomiting?",
          hi: "उल्टी या मतली की समस्या कब से हो रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started today", "1 to 2 days", "Several days"],
          hi: ["आज से शुरू हुई", "1 से 2 दिन से", "कई दिनों से"]
        }
      },
      {
        field: 'fluid_intake',
        isKnown: (h) => Boolean(h?.hpi?.fluid_intake),
        text: {
          en: "Are you able to keep water or fluids down without immediately vomiting?",
          hi: "क्या आप पानी या तरल पदार्थ पी पा रहे हैं, या तुरंत उल्टी हो जाती है?"
        },
        type: 'single_choice',
        options: {
          en: ["Can keep fluids down", "Unable to keep any water down (dehydration)"],
          hi: ["पानी पी पा रहे हैं", "पानी की घूंट भी नहीं रुक रही"]
        }
      },
      {
        field: 'vomit_contents',
        isKnown: (h) => Boolean(h?.hpi?.vomit_contents),
        text: {
          en: "What does the vomit look like? Has there been any blood or dark coffee-ground material?",
          hi: "उल्टी कैसी है? क्या इसमें खून या गहरा भूरा/काला रंग दिखा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Normal food / bile", "Blood or dark coffee-ground color"],
          hi: ["सामान्य खाना या पीला पानी", "खून या गहरे काले/कॉफ़ी रंग जैसा"]
        }
      }
    ]
  },

  diarrhea: {
    id: 'diarrhea',
    title: { en: 'Diarrhea', hi: 'दस्त (Diarrhea / Loose Motion)' },
    category: 'Gastrointestinal',
    keywords: [
      'diarrhea', 'dast', 'loose motion', 'loose motions', 'watery stool', 'pet kharab'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How many days have you had loose motions?",
          hi: "दस्त या लूज मोशन कितने दिनों से हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["1-2 days", "3-5 days", "More than a week"],
          hi: ["1-2 दिन से", "3-5 दिन से", "एक हफ्ते से ज्यादा"]
        }
      },
      {
        field: 'frequency_character',
        isKnown: (h) => Boolean(h?.hpi?.frequency_character),
        text: {
          en: "How many times a day are you passing stool, and is there any blood or mucus?",
          hi: "दिन में कितनी बार दस्त हो रहे हैं और क्या खून या आंव (mucus) आ रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["3-5 times without blood", "Frequent watery stool (6+ times)", "Blood or black color in stool"],
          hi: ["3 से 5 बार (बिना खून)", "पानी जैसे पतले दस्त (6 से ज्यादा बार)", "दस्त में खून या काला रंग"]
        }
      },
      {
        field: 'dehydration',
        isKnown: (h) => Boolean(h?.hpi?.dehydration),
        text: {
          en: "Are you feeling extreme thirst, severe weakness, or passing very little dark urine?",
          hi: "क्या बहुत तेज प्यास, अत्यधिक कमजोरी या पेशाब बहुत कम आ रहा है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, signs of severe thirst / dehydration", "No severe dehydration"],
          hi: ["हाँ, बहुत प्यास / पेशाब कम आ रहा है", "नहीं, सामान्य है"]
        }
      }
    ]
  },

  constipation: {
    id: 'constipation',
    title: { en: 'Constipation', hi: 'कब्ज (Constipation)' },
    category: 'Gastrointestinal',
    keywords: [
      'constipation', 'kabz', 'pet saaf na hona', 'hard stool', 'straining stool'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How many days has it been since you last passed stool or gas?",
          hi: "पेट साफ हुए या गैस पास हुए कितने दिन हो गए हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["2-3 days", "4-7 days", "More than a week"],
          hi: ["2-3 दिन से", "4-7 दिन से", "एक हफ्ते से ज्यादा"]
        }
      },
      {
        field: 'vomiting_distension',
        isKnown: (h) => Boolean(h?.hpi?.vomiting_distension),
        text: {
          en: "Do you have severe abdominal swelling (bloating) or continuous vomiting?",
          hi: "क्या पेट बहुत फूला हुआ है और साथ में लगातार उल्टी हो रही है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, swollen belly and vomiting", "No vomiting or severe swelling"],
          hi: ["हाँ, पेट फूला है और उल्टी हो रही है", "नहीं, सिर्फ पेट साफ नहीं हुआ"]
        }
      }
    ]
  },

  loss_of_appetite: {
    id: 'loss_of_appetite',
    title: { en: 'Loss of Appetite', hi: 'भूख न लगना (Loss of Appetite)' },
    category: 'Gastrointestinal',
    keywords: [
      'loss of appetite', 'bhookh na lagna', 'poor appetite', 'not feeling hungry',
      'bhookh kam lagna', 'anorexia'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you noticed a reduced appetite?",
          hi: "भूख कम लगना कितने समय से महसूस हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Few days", "A few weeks", "Several months"],
          hi: ["कुछ दिनों से", "कुछ हफ़्तों से", "कई महीनों से"]
        }
      },
      {
        field: 'weight_loss',
        isKnown: (h) => Boolean(h?.hpi?.weight_loss),
        text: {
          en: "Have you experienced noticeable unexpected weight loss?",
          hi: "क्या आपका वजन भी बिना कोशिश किए तेजी से कम हुआ है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, noticeable weight loss", "No significant weight loss"],
          hi: ["हाँ, वजन कम हुआ है", "नहीं, वजन सामान्य है"]
        }
      }
    ]
  }
};

export default gastrointestinalProtocols;
