/**
 * Women's Health / Gynecological Clinical History Protocols
 * 1. Menstrual Problems (माहवारी की समस्या - भारी, अनियमित या दर्दनाक)
 * 2. Pelvic Pain (पेडू में दर्द / Lower abdominal pain)
 * 3. Abnormal Vaginal Bleeding (असामान्य रक्तस्राव / Spotting)
 * 4. Pregnancy-Related Symptoms (गर्भावस्था के लक्षण / उल्टी / स्पॉटिंग)
 */

export const womensHealthProtocols = {
  menstrual_problems: {
    id: 'menstrual_problems',
    title: { en: 'Menstrual Problems', hi: 'माहवारी की समस्या' },
    category: "Women's Health",
    keywords: [
      'menstrual problems', 'periods problem', 'mahavari', 'heavy bleeding',
      'period pain', 'irregular periods', 'dysmenorrhea', 'menorrhagia', 'periods mein dard'
    ],
    questions: [
      {
        field: 'main_issue',
        isKnown: (h) => Boolean(h?.hpi?.main_issue),
        text: {
          en: "What is your main concern regarding your menstrual cycle?",
          hi: "माहवारी को लेकर आपकी मुख्य समस्या क्या है?"
        },
        type: 'single_choice',
        options: {
          en: ["Heavy bleeding with large clots (Menorrhagia)", "Severe cramping/pain (Dysmenorrhea)", "Irregular or missed periods", "Bleeding lasting > 7 days"],
          hi: ["बहुत ज़्यादा ब्लीडिंग / बड़े थक्के आना", "पेट के निचले हिस्से में तेज़ मरोड़/दर्द", "अनियमित या बंद हो जाना", "7 दिनों से ज़्यादा ब्लीडिंग होना"]
        }
      },
      {
        field: 'cycle_regularity',
        isKnown: (h) => Boolean(h?.hpi?.cycle_regularity),
        text: {
          en: "How frequent are your periods usually?",
          hi: "आमतौर पर आपके पीरियड्स कितने दिनों के अंतर पर आते हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["Regular (every 21-35 days)", "Irregular / unpredictable (varies widely)", "Frequently delayed (every 2-3 months)"],
          hi: ["नियमित (हर 21-35 दिन में)", "अनियमित (कभी जल्दी, कभी बहुत देर)", "अक्सर 2-3 महीने की देरी से"]
        }
      },
      {
        field: 'weakness_dizziness',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('dizziness') || s.includes('severe weakness');
        },
        text: {
          en: "Do you feel lightheaded, dizzy, or extremely weak from the bleeding?",
          hi: "क्या ज़्यादा ब्लीडिंग की वजह से चक्कर आना, आंखों के आगे अंधेरा या अत्यधिक कमज़ोरी महसूस होती है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, severe weakness or fainting/dizziness", "No dizziness"],
          hi: ["हाँ, चक्कर या बहुत ज़्यादा कमज़ोरी है", "नहीं, चक्कर नहीं आ रहे"]
        }
      }
    ]
  },

  pelvic_pain: {
    id: 'pelvic_pain',
    title: { en: 'Pelvic & Lower Abdominal Pain', hi: 'पेडू / निचले पेट में दर्द' },
    category: "Women's Health",
    keywords: [
      'pelvic pain', 'pedu mein dard', 'lower abdominal pain female',
      'nalki mein dard', 'cramps female', 'pedu me dard'
    ],
    questions: [
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did this lower abdominal/pelvic pain start suddenly or gradually?",
          hi: "क्या पेडू में यह दर्द अचानक बहुत तेज़ शुरू हुआ या धीरे-धीरे?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly (very sharp, acute onset)", "Gradually over several days or weeks"],
          hi: ["अचानक (तेज़ तीखा दर्द)", "धीरे-धीरे कई दिनों में"]
        }
      },
      {
        field: 'relation_to_period',
        isKnown: (h) => Boolean(h?.hpi?.relation_to_period),
        text: {
          en: "Is the pain related to your menstrual period or mid-cycle ovulation?",
          hi: "क्या यह दर्द मासिक धर्म (पीरियड) के दिनों में होता है या बिना पीरियड के?"
        },
        type: 'single_choice',
        options: {
          en: ["During or right before periods", "Midway between periods", "Constant, unrelated to cycle"],
          hi: ["पीरियड्स के दौरान या ठीक पहले", "दो पीरियड्स के ठीक बीच में", "लगातार बना रहता है, पीरियड से संबंध नहीं"]
        }
      },
      {
        field: 'pregnancy_possibility',
        isKnown: (h) => Boolean(h?.hpi?.pregnancy_possibility),
        text: {
          en: "Is there any possibility of pregnancy (missed period)?",
          hi: "क्या गर्भावस्था (प्रेग्नेंसी) की कोई संभावना या पीरियड मिस हुआ है?"
        },
        type: 'single_choice',
        options: {
          en: ["Yes, missed period / possible pregnancy", "No, not pregnant / regular periods", "Not applicable"],
          hi: ["हाँ, पीरियड मिस हुआ है / प्रेग्नेंसी की संभावना है", "नहीं, पीरियड्स नियमित हैं / सम्भव नहीं", "लागू नहीं"]
        }
      },
      {
        field: 'fever_discharge',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('fever') || s.includes('abnormal discharge');
        },
        text: {
          en: "Do you have high fever, chills, or foul-smelling vaginal discharge?",
          hi: "क्या आपको तेज़ बुखार या बदबूदार सफेद पानी/डिस्चार्ज की शिकायत है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fever or foul vaginal discharge", "No fever or foul discharge"],
          hi: ["हाँ, बुखार या बदबूदार डिस्चार्ज है", "नहीं, कोई बुखार या बदबूदार डिस्चार्ज नहीं"]
        }
      }
    ]
  },

  abnormal_vaginal_bleeding: {
    id: 'abnormal_vaginal_bleeding',
    title: { en: 'Abnormal Vaginal Bleeding', hi: 'असामान्य योनि रक्तस्राव' },
    category: "Women's Health",
    keywords: [
      'abnormal vaginal bleeding', 'spotting', 'bleeding between periods',
      'postmenopausal bleeding', 'asamanya bleeding', 'bleeding after menopause'
    ],
    questions: [
      {
        field: 'timing_pattern',
        isKnown: (h) => Boolean(h?.hpi?.timing_pattern),
        text: {
          en: "When does this bleeding occur?",
          hi: "यह रक्तस्राव (ब्लीडिंग) कब होती है?"
        },
        type: 'single_choice',
        options: {
          en: ["After menopause (Menopause has passed years ago)", "Spotting in between normal monthly periods", "After sexual intercourse"],
          hi: ["मेनोपॉज (माहवारी बंद होने) के बाद", "दो पीरियड्स के बीच में (Spotting)", "संबंध बनाने के बाद"]
        }
      },
      {
        field: 'flow_amount',
        isKnown: (h) => Boolean(h?.hpi?.flow_amount),
        text: {
          en: "How heavy is the bleeding?",
          hi: "ब्लीडिंग कितनी मात्रा में हो रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Light spotting / staining", "Moderate flow", "Heavy with blood clots soaking pads hourly"],
          hi: ["हल्के धब्बे (Spotting)", "मध्यम मात्रा", "बहुत भारी (हर घंटे पैड बदलना पड़े)"]
        }
      },
      {
        field: 'fainting_weakness',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('syncope') || s.includes('dizziness');
        },
        text: {
          en: "Have you felt faint or lost consciousness due to this bleeding?",
          hi: "क्या इस ब्लीडिंग के कारण कभी बेहोशी या चक्कर आकर गिर पड़ने जैसी स्थिति हुई?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, feeling faint or dizzy", "No fainting"],
          hi: ["हाँ, बेहोशी या बहुत कमज़ोरी है", "नहीं, बेहोशी नहीं है"]
        }
      }
    ]
  },

  pregnancy_symptoms: {
    id: 'pregnancy_symptoms',
    title: { en: 'Pregnancy-Related Symptoms', hi: 'गर्भावस्था से जुड़े लक्षण' },
    category: "Women's Health",
    keywords: [
      'pregnancy symptoms', 'garbhawastha', 'pregnant', 'morning sickness',
      'pregnancy vomiting', 'pregnancy spotting', 'pregnancy pain', 'garbhavati'
    ],
    questions: [
      {
        field: 'gestational_age',
        isKnown: (h) => Boolean(h?.hpi?.gestational_age),
        text: {
          en: "How many weeks or months pregnant are you currently?",
          hi: "वर्तमान में आपकी गर्भावस्था को कितने हफ्ते या महीने हुए हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["First trimester (1 to 3 months)", "Second trimester (4 to 6 months)", "Third trimester (7 to 9 months)"],
          hi: ["पहला तिमाही (1 से 3 महीने)", "दूसरा तिमाही (4 से 6 महीने)", "तीसरा तिमाही (7 से 9 महीने)"]
        }
      },
      {
        field: 'symptoms_type',
        isKnown: (h) => Boolean(h?.hpi?.symptoms_type),
        text: {
          en: "What symptoms are you experiencing?",
          hi: "आपको किस प्रकार के लक्षण हो रहे हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["Nausea / Vomiting (Morning sickness)", "Vaginal spotting or bleeding", "Severe lower abdominal cramps", "Severe headache / Blurred vision / Swelling"],
          hi: ["उल्टी / जी मिचलाना (Morning sickness)", "योनि से हल्का खून या स्पॉटिंग", "पेट के निचले हिस्से में तेज़ दर्द", "तेज़ सिरदर्द / आँखों के आगे अंधेरा / चेहरे पर सूजन"]
        }
      },
      {
        field: 'warning_signs',
        isKnown: (h) => Boolean(h?.hpi?.warning_signs),
        text: {
          en: "Is there active bright red bleeding or severe sharp pelvic pain?",
          hi: "क्या ताज़ा लाल खून बह रहा है या पेडू में बहुत तेज़ असहनीय दर्द है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, active bleeding or severe pain (Requires urgent check)", "No bleeding or severe pain, just mild nausea"],
          hi: ["हाँ, खून बह रहा है या असहनीय दर्द है", "नहीं, सिर्फ जी मिचलाना या हल्की उल्टी है"]
        }
      }
    ]
  }
};

export default womensHealthProtocols;
