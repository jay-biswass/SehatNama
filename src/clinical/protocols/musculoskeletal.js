/**
 * Musculoskeletal Clinical History Protocols
 * 1. Back Pain (कमर दर्द / पीठ दर्द)
 * 2. Joint Pain (जोड़ों का दर्द / घुटने का दर्द)
 * 3. Limb Pain (हाथ/पैर में दर्द)
 */

export const musculoskeletalProtocols = {
  back_pain: {
    id: 'back_pain',
    title: { en: 'Back Pain', hi: 'कमर या पीठ में दर्द' },
    category: 'Musculoskeletal',
    keywords: [
      'back pain', 'kamar dard', 'kamar mein dard', 'peeth dard', 'peeth me dard',
      'lower back pain', 'spine pain', 'lumbago', 'sciatica', 'kamar me dard'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Which part of your back hurts the most?",
          hi: "आपकी पीठ या कमर के किस हिस्से में सबसे ज़्यादा दर्द है?"
        },
        type: 'single_choice',
        options: {
          en: ["Lower back (Kamar)", "Upper back / Between shoulder blades", "Neck & upper spine", "Entire back"],
          hi: ["निचली कमर में (Lower back)", "ऊपरी पीठ / कंधों के बीच", "गर्दन और ऊपरी रीढ़", "पूरी पीठ में"]
        }
      },
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did this back pain start suddenly or gradually over time?",
          hi: "क्या यह कमर दर्द अचानक शुरू हुआ या धीरे-धीरे?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly (e.g. after lifting or bending)", "Gradually over days or weeks"],
          hi: ["अचानक (जैसे वजन उठाने या झुकने के बाद)", "धीरे-धीरे (कई दिनों या हफ्तों से)"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this back pain?",
          hi: "यह दर्द कितने समय से हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started today / yesterday", "A few days (2-7 days)", "1 to 4 weeks", "More than a month / Chronic"],
          hi: ["आज या कल से", "कुछ दिनों से (2-7 दिन)", "1 से 4 हफ्तों से", "एक महीने से ज़्यादा समय से"]
        }
      },
      {
        field: 'radiation',
        isKnown: (h) => Boolean(h?.hpi?.radiation),
        text: {
          en: "Does the pain travel or radiate down into your legs or feet?",
          hi: "क्या यह दर्द कमर से नीचे आपके पैरों या पंजों की तरफ जाता है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, shoots down one or both legs (Sciatica)", "No, pain stays in the back"],
          hi: ["हाँ, एक या दोनों पैरों की तरफ जाता है", "नहीं, सिर्फ कमर/पीठ तक ही रहता है"]
        }
      },
      {
        field: 'severity',
        isKnown: (h) => h?.hpi?.severity !== null && h?.hpi?.severity !== undefined,
        text: {
          en: "On a scale of 0 to 10, how severe is your back pain?",
          hi: "0 से 10 के पैमाने पर दर्द कितना तेज़ है?"
        },
        type: 'scale',
        options: {
          en: ["2 (Mild)", "5 (Moderate)", "8 (Severe)", "10 (Unbearable)"],
          hi: ["2 (हल्का दर्द)", "5 (मध्यम दर्द)", "8 (बहुत तेज़ दर्द)", "10 (असहनीय दर्द)"]
        }
      },
      {
        field: 'red_flags',
        isKnown: (h) => Boolean(h?.hpi?.bowel_bladder_incontinence !== undefined || h?.hpi?.saddle_anesthesia !== undefined),
        text: {
          en: "Are you having any loss of control over urination/stool, or numbness around your groin?",
          hi: "क्या पेशाब या शौच पर नियंत्रण खोने, या जांघों/कमर के बीच सुन्नपन की समस्या है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, numbness or loss of bladder/bowel control", "No, bladder and bowel are normal"],
          hi: ["हाँ, पेशाब/शौच पर नियंत्रण नहीं या सुन्नपन है", "नहीं, पेशाब और शौच बिल्कुल सामान्य है"]
        }
      },
      {
        field: 'aggravating_factors',
        isKnown: (h) => Boolean(h?.hpi?.aggravating_factors),
        text: {
          en: "What makes the pain worse or better?",
          hi: "किस चीज़ से दर्द बढ़ता या कम होता है?"
        },
        type: 'single_choice',
        options: {
          en: ["Worse with walking/bending, better with rest", "Worse in morning / stiff, better with movement", "Constant pain regardless of position"],
          hi: ["चलने या झुकने पर बढ़ता है, आराम से घटता है", "सुबह अकड़न रहती है, चलने-फिरने से घटता है", "हर स्थिति में लगातार दर्द रहता है"]
        }
      }
    ]
  },

  joint_pain: {
    id: 'joint_pain',
    title: { en: 'Joint Pain', hi: 'जोड़ों में दर्द' },
    category: 'Musculoskeletal',
    keywords: [
      'joint pain', 'jodon mein dard', 'ghutne mein dard', 'knee pain', 'arthritis',
      'sandhi vat', 'sandhivat', 'jodo ka dard', 'ghutno me dard', 'swollen joints'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Which joint is hurting the most?",
          hi: "किस जोड़ (joint) में सबसे ज़्यादा दर्द है?"
        },
        type: 'single_choice',
        options: {
          en: ["Knee joint(s)", "Hip joint(s)", "Shoulder / Elbow / Wrist", "Fingers / Hands", "Multiple joints"],
          hi: ["घुटने (Knee)", "कूल्हे (Hip)", "कंधा / कोहनी / कलाई", "उंगलियाँ / हाथ", "एक से ज़्यादा कई जोड़ों में"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you been experiencing this joint pain?",
          hi: "जोड़ों में यह दर्द कितने समय से हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["A few days to 1 week", "A few weeks", "Several months / Long standing", "Years"],
          hi: ["कुछ दिनों से 1 हफ्ते से", "कुछ हफ्तों से", "कई महीनों से", "कई सालों से"]
        }
      },
      {
        field: 'swelling_redness',
        isKnown: (h) => Boolean(h?.hpi?.swelling_redness),
        text: {
          en: "Is there visible swelling, warmth, or redness around the painful joint?",
          hi: "क्या दर्द वाले जोड़ पर सूजन, लाली या गर्माहट महसूस होती है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, joint is swollen, red or warm", "No swelling or redness"],
          hi: ["हाँ, जोड़ में सूजन, लाली या गर्माहट है", "नहीं, सिर्फ दर्द है, सूजन नहीं"]
        }
      },
      {
        field: 'morning_stiffness',
        isKnown: (h) => Boolean(h?.hpi?.morning_stiffness),
        text: {
          en: "Do you have severe stiffness in the morning lasting over 30 minutes?",
          hi: "क्या सुबह उठने पर जोड़ों में 30 मिनट से ज़्यादा अकड़न रहती है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, morning stiffness lasting > 30 mins", "No morning stiffness or lasts very briefly"],
          hi: ["हाँ, सुबह 30 मिनट से ज़्यादा अकड़न रहती है", "नहीं, अकड़न नहीं होती या बहुत कम देर रहती है"]
        }
      },
      {
        field: 'fever',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          const neg = h?.negated_symptoms || [];
          return s.includes('fever') || neg.includes('fever');
        },
        text: {
          en: "Do you have any fever or chills along with this joint pain?",
          hi: "क्या जोड़ों के दर्द के साथ बुखार या कंपकंपी भी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fever present", "No fever"],
          hi: ["हाँ, बुखार भी है", "नहीं, कोई बुखार नहीं है"]
        }
      }
    ]
  },

  limb_pain: {
    id: 'limb_pain',
    title: { en: 'Limb Pain (Arm / Leg)', hi: 'हाथ या पैर में दर्द' },
    category: 'Musculoskeletal',
    keywords: [
      'limb pain', 'haath mein dard', 'pair mein dard', 'leg pain', 'arm pain',
      'calf pain', 'thigh pain', 'hath me dard', 'pair me dard'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where is the pain located?",
          hi: "दर्द किस जगह पर है?"
        },
        type: 'single_choice',
        options: {
          en: ["Calf / Lower leg", "Thigh / Upper leg", "Arm / Shoulder", "Forearm / Hand"],
          hi: ["पिंडली / पैर का निचला हिस्सा (Calf)", "जांघ (Thigh)", "बाजू / कंधा (Arm)", "हाथ / कलाई"]
        }
      },
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did the pain start suddenly, or following an injury/fall?",
          hi: "क्या दर्द अचानक शुरू हुआ, या चोट/गिरने के बाद हुआ?"
        },
        type: 'single_choice',
        options: {
          en: ["After an injury, fall, or twist", "Suddenly without known injury", "Gradually over days"],
          hi: ["चोट लगने, गिरने या मोच के बाद", "अचानक बिना किसी चोट के", "धीरे-धीरे कई दिनों में"]
        }
      },
      {
        field: 'swelling_redness',
        isKnown: (h) => Boolean(h?.hpi?.swelling_redness),
        text: {
          en: "Is there sudden swelling, heat, or redness in one calf or limb?",
          hi: "क्या किसी एक पैर या पिंडली में अचानक सूजन, गर्मी या लाली आई है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, one leg/calf is swollen and tender", "No swelling or redness"],
          hi: ["हाँ, एक पैर/पिंडली में सूजन और दर्द है", "नहीं, सूजन या लाली नहीं है"]
        }
      },
      {
        field: 'weight_bearing',
        isKnown: (h) => Boolean(h?.hpi?.weight_bearing),
        text: {
          en: "Are you able to bear weight and walk on that leg?",
          hi: "क्या आप उस पैर पर वजन देकर चल पा रहे हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["Yes, can walk normally", "Can walk with a limp", "Cannot bear weight at all"],
          hi: ["हाँ, सामान्य रूप से चल सकते हैं", "लंगड़ाकर चल पा रहे हैं", "बिल्कुल वजन नहीं दे पा रहे"]
        }
      }
    ]
  }
};

export default musculoskeletalProtocols;
