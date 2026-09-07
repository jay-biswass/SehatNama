/**
 * Genitourinary Clinical History Protocols
 * 1. Painful Urination (Dysuria / पेशाब में जलन या दर्द)
 * 2. Increased Urination (Frequency / बार-बार पेशाब आना)
 * 3. Blood in Urine (Hematuria / पेशाब में खून आना)
 * 4. Difficulty Urinating (Hesitancy / पेशाब रुकना या कठिनाई)
 */

export const genitourinaryProtocols = {
  painful_urination: {
    id: 'painful_urination',
    title: { en: 'Painful Urination (Dysuria)', hi: 'पेशाब में जलन या दर्द' },
    category: 'Genitourinary',
    keywords: [
      'painful urination', 'dysuria', 'peshab mein jalan', 'peshab me jalan',
      'burning urination', 'peshab mein dard', 'urine infection', 'uti', 'mutra mein jalan'
    ],
    questions: [
      {
        field: 'character',
        isKnown: (h) => Boolean(h?.hpi?.character),
        text: {
          en: "What kind of sensation do you feel when passing urine?",
          hi: "पेशाब करते समय कैसा अहसास होता है?"
        },
        type: 'single_choice',
        options: {
          en: ["Sharp burning sensation", "Aching / Spasmodic pain", "Pain at end of urination"],
          hi: ["तेज़ जलन (Burning)", "हल्का दर्द या मरोड़", "पेशाब खत्म होने पर दर्द"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this burning sensation?",
          hi: "पेशाब में जलन कितने समय से हो रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started today", "2-3 days", "About a week", "Recurrent / Frequent episodes"],
          hi: ["आज से शुरू हुआ", "2-3 दिन से", "लगभग 1 हफ्ते से", "बार-बार होता रहता है"]
        }
      },
      {
        field: 'fever_chills',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          const neg = h?.negated_symptoms || [];
          return s.includes('fever') || neg.includes('fever') || s.includes('chills');
        },
        text: {
          en: "Do you have fever, chills, or pain in your lower back / flank?",
          hi: "क्या आपको बुखार, कंपकंपी, या कमर के पिछले हिस्से/पसलियों के नीचे दर्द है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fever or flank pain present", "No fever or flank pain"],
          hi: ["हाँ, बुखार या कमर में दर्द है", "नहीं, सिर्फ पेशाब में जलन है"]
        }
      },
      {
        field: 'blood_in_urine',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          const neg = h?.negated_symptoms || [];
          return s.includes('blood in urine') || neg.includes('blood in urine');
        },
        text: {
          en: "Have you noticed any reddish tint or blood in your urine?",
          hi: "क्या पेशाब में लाल रंग या खून दिखाई दिया है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, urine looks red or has blood", "No, urine color is normal / clear yellow"],
          hi: ["हाँ, पेशाब लाल या खून जैसा है", "नहीं, पेशाब का रंग सामान्य है"]
        }
      },
      {
        field: 'discharge',
        isKnown: (h) => Boolean(h?.hpi?.discharge),
        text: {
          en: "Is there any unusual discharge from the urinary passage?",
          hi: "क्या पेशाब के रास्ते से कोई असामान्य स्राव या डिस्चार्ज आ रहा है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, discharge present", "No discharge"],
          hi: ["हाँ, डिस्चार्ज आ रहा है", "नहीं, कोई डिस्चार्ज नहीं है"]
        }
      }
    ]
  },

  increased_urination: {
    id: 'increased_urination',
    title: { en: 'Increased Urination (Frequency)', hi: 'बार-बार पेशाब आना' },
    category: 'Genitourinary',
    keywords: [
      'frequent urination', 'increased urination', 'bar bar peshab', 'nocturia',
      'peshab bar bar aana', 'polyuria', 'urine frequency', 'peshab jaldi aana'
    ],
    questions: [
      {
        field: 'timing',
        isKnown: (h) => Boolean(h?.hpi?.timing),
        text: {
          en: "Does this happen mostly during the day, or do you wake up multiple times at night?",
          hi: "क्या यह दिन में ज़्यादा होता है, या रात में कई बार उठना पड़ता है?"
        },
        type: 'single_choice',
        options: {
          en: ["Both day and night (waking > 2 times)", "Mainly during the daytime", "Only at night"],
          hi: ["दिन और रात दोनों में (रात में 2 से ज़्यादा बार)", "मुख्य रूप से दिन के समय", "सिर्फ रात में"]
        }
      },
      {
        field: 'volume',
        isKnown: (h) => Boolean(h?.hpi?.volume),
        text: {
          en: "Is the amount of urine large each time, or only a few drops?",
          hi: "क्या हर बार भरपूर मात्रा में पेशाब आता है या सिर्फ कुछ बूँदें?"
        },
        type: 'single_choice',
        options: {
          en: ["Large volume each time", "Small amount / Just a few drops with urgency"],
          hi: ["हर बार भरपूर मात्रा में आता है", "बहुत कम मात्रा / सिर्फ कुछ बूँदें"]
        }
      },
      {
        field: 'thirst',
        isKnown: (h) => Boolean(h?.hpi?.excessive_thirst),
        text: {
          en: "Are you also experiencing excessive thirst or dry mouth?",
          hi: "क्या आपको बहुत ज़्यादा प्यास लगने या मुँह सूखने की समस्या भी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, feeling very thirsty", "No excessive thirst"],
          hi: ["हाँ, बहुत ज़्यादा प्यास लग रही है", "नहीं, प्यास सामान्य है"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long has this increased frequency been happening?",
          hi: "यह समस्या कितने समय से चल रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["A few days", "1-2 weeks", "Months or gradually worsening over a long time"],
          hi: ["कुछ दिनों से", "1-2 हफ़्तों से", "काफी महीनों से या धीरे-धीरे बढ़ रहा है"]
        }
      }
    ]
  },

  blood_in_urine: {
    id: 'blood_in_urine',
    title: { en: 'Blood in Urine (Hematuria)', hi: 'पेशाब में खून आना' },
    category: 'Genitourinary',
    keywords: [
      'blood in urine', 'hematuria', 'peshab mein khoon', 'red urine', 'peshab me khun',
      'lal peshab', 'mutra me rakt'
    ],
    questions: [
      {
        field: 'pain_status',
        isKnown: (h) => Boolean(h?.hpi?.pain_status),
        text: {
          en: "Is passing the bloody urine painful or completely painless?",
          hi: "क्या खून आने के साथ तेज़ दर्द होता है या यह बिल्कुल दर्द-रहित (painless) है?"
        },
        type: 'single_choice',
        options: {
          en: ["Painless (No pain at all)", "Painful (With severe flank, groin, or pelvic pain)"],
          hi: ["बिल्कुल दर्द-रहित (Painless)", "दर्द के साथ (कमर, जांघ या पेट में तेज़ दर्द)"]
        }
      },
      {
        field: 'clots',
        isKnown: (h) => Boolean(h?.hpi?.clots),
        text: {
          en: "Have you seen any blood clots or dark pieces in the urine?",
          hi: "क्या पेशाब में खून के थक्के (clots) भी दिखाई दिए हैं?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, visible blood clots", "No clots, uniform pink or red color"],
          hi: ["हाँ, खून के थक्के दिखाई दिए", "नहीं, सिर्फ हल्का लाल/गुलाबी रंग है"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "When did you first notice blood in your urine?",
          hi: "आपने पहली बार पेशाब में खून कब देखा था?"
        },
        type: 'single_choice',
        options: {
          en: ["Just today / single episode", "Past 2-3 days", "Intermittent over weeks"],
          hi: ["आज पहली बार देखा", "पिछले 2-3 दिनों से", "कई हफ़्तों से कभी-कभी"]
        }
      },
      {
        field: 'trauma',
        isKnown: (h) => Boolean(h?.hpi?.trauma),
        text: {
          en: "Have you had any recent fall, injury, or blow to your lower back or abdomen?",
          hi: "क्या हाल ही में कमर या पेट के निचले हिस्से में कोई चोट लगी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, had a recent injury or fall", "No injury"],
          hi: ["हाँ, हाल ही में चोट लगी थी", "नहीं, कोई चोट नहीं लगी"]
        }
      }
    ]
  },

  difficulty_urinating: {
    id: 'difficulty_urinating',
    title: { en: 'Difficulty Urinating (Urinary Retention / Hesitancy)', hi: 'पेशाब रुकना या कठिनाई' },
    category: 'Genitourinary',
    keywords: [
      'difficulty urinating', 'urinary retention', 'peshab rukna', 'peshab atakna',
      'weak stream', 'straining to urinate', 'peshab nahi nikal raha', 'hesitancy'
    ],
    questions: [
      {
        field: 'complete_retention',
        isKnown: (h) => Boolean(h?.hpi?.complete_retention !== undefined),
        text: {
          en: "Are you completely unable to pass any urine despite a full bladder?",
          hi: "क्या आपका पेशाब बिल्कुल रुक गया है और ज़रा भी नहीं निकल पा रहा?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, completely stopped / severe bladder fullness", "No, it comes out but with difficulty / weak stream"],
          hi: ["हाँ, बिल्कुल बंद हो गया है (Complete retention)", "नहीं, आ रहा है पर कम धार या ज़ोर लगाने पर"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you been having this problem?",
          hi: "यह समस्या कितने समय से हो रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started today / sudden onset", "A few days", "Gradually worsening over several months"],
          hi: ["आज से अचानक शुरू हुआ", "कुछ दिनों से", "काफी महीनों से धीरे-धीरे बढ़ रहा है"]
        }
      },
      {
        field: 'pain_fullness',
        isKnown: (h) => Boolean(h?.hpi?.pain_fullness),
        text: {
          en: "Is there intense lower abdominal pain due to bladder fullness?",
          hi: "क्या पेट के निचले हिस्से में पेशाब भरने से तेज़ दर्द और तनाव है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, severe lower abdominal distension and pain", "Mild or no pain"],
          hi: ["हाँ, पेट के निचले हिस्से में तेज़ दर्द और भारीपन है", "हल्का या कोई दर्द नहीं"]
        }
      }
    ]
  }
};

export default genitourinaryProtocols;
