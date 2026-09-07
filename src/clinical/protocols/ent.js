/**
 * ENT (Ear, Nose, Throat) Clinical History Protocols
 * 1. Ear Pain (कान में दर्द / Earache)
 * 2. Hearing Difficulty (कान से कम सुनाई देना / Tinnitus)
 * 3. Nasal Congestion (नाक बंद / बहना / Sinus pressure)
 */

export const entProtocols = {
  ear_pain: {
    id: 'ear_pain',
    title: { en: 'Ear Pain (Otalgia)', hi: 'कान में दर्द' },
    category: 'ENT',
    keywords: [
      'ear pain', 'kaan mein dard', 'earache', 'kaan dard', 'otalgia',
      'kaan me dard', 'pain in ear', 'ear pressure'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Which ear is painful?",
          hi: "किस कान में दर्द है?"
        },
        type: 'single_choice',
        options: {
          en: ["Right ear", "Left ear", "Both ears"],
          hi: ["दाएं कान में (Right)", "बाएं कान में (Left)", "दोनों कानों में (Both)"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this ear pain?",
          hi: "कान में यह दर्द कितने समय से है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started today", "2-3 days", "About 1 week", "More than 2 weeks"],
          hi: ["आज से", "2-3 दिनों से", "लगभग 1 हफ्ते से", "2 हफ्तों से ज़्यादा से"]
        }
      },
      {
        field: 'discharge',
        isKnown: (h) => Boolean(h?.hpi?.discharge),
        text: {
          en: "Is there any pus, fluid, or blood draining from the ear?",
          hi: "क्या कान से कोई पानी, पीप (pus) या खून बह रहा है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fluid or pus draining (Kaan behna)", "No discharge"],
          hi: ["हाँ, कान बह रहा है / पानी या पीप आ रहा है", "नहीं, कोई डिस्चार्ज नहीं है"]
        }
      },
      {
        field: 'fever_swelling',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('fever') || s.includes('swelling behind ear');
        },
        text: {
          en: "Do you have fever or painful swelling directly behind the ear?",
          hi: "क्या बुखार है, या कान के ठीक पीछे हड्डी पर कोई सूजन या दर्द है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fever or swelling behind ear", "No fever or swelling behind ear"],
          hi: ["हाँ, बुखार या कान के पीछे सूजन है", "नहीं, कान के पीछे कोई सूजन नहीं है"]
        }
      }
    ]
  },

  hearing_difficulty: {
    id: 'hearing_difficulty',
    title: { en: 'Hearing Difficulty & Ringing', hi: 'कान से कम सुनना या सीटी बजना' },
    category: 'ENT',
    keywords: [
      'hearing difficulty', 'kaan se kam sunna', 'hearing loss', 'tinnitus',
      'ringing in ear', 'kaan mein aawaz', 'bahrapan', 'kaan bajna'
    ],
    questions: [
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did the hearing loss happen suddenly (over hours/days) or gradually?",
          hi: "क्या सुनना अचानक बंद हुआ या धीरे-धीरे कम हुआ?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly (Sudden hearing loss)", "Gradually over months or years"],
          hi: ["अचानक (कुछ घंटों या दिनों में)", "धीरे-धीरे (कई महीनों या सालों में)"]
        }
      },
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Is one ear affected or both?",
          hi: "एक कान में समस्या है या दोनों में?"
        },
        type: 'single_choice',
        options: {
          en: ["Only one ear", "Both ears"],
          hi: ["सिर्फ एक कान में", "दोनों कानों में"]
        }
      },
      {
        field: 'tinnitus',
        isKnown: (h) => Boolean(h?.hpi?.tinnitus),
        text: {
          en: "Do you hear buzzing, ringing, or whistling sounds inside your ear?",
          hi: "क्या कान के अंदर सीटी बजने, सांय-सांय या घंटी बजने जैसी आवाज़ आती है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, ringing or buzzing (Tinnitus)", "No abnormal sounds"],
          hi: ["हाँ, सीटी या घंटी बजने जैसी आवाज़ आती है", "नहीं, ऐसी कोई आवाज़ नहीं आती"]
        }
      },
      {
        field: 'dizziness',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('dizziness') || s.includes('vertigo');
        },
        text: {
          en: "Are you also experiencing dizziness or room-spinning sensations (Vertigo)?",
          hi: "क्या इसके साथ चक्कर आने या सिर घूमने (Vertigo) की समस्या भी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, dizziness / room spinning", "No dizziness"],
          hi: ["हाँ, चक्कर आते हैं", "नहीं, चक्कर नहीं आते"]
        }
      }
    ]
  },

  nasal_congestion: {
    id: 'nasal_congestion',
    title: { en: 'Nasal Congestion & Sinus Issues', hi: 'नाक बंद / जुकाम / साइनस' },
    category: 'ENT',
    keywords: [
      'nasal congestion', 'naak band', 'runny nose', 'naak behna', 'sinusitis',
      'sneezing', 'cheenk', 'cold', 'zukam', 'band naak', 'facial pain'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this nasal congestion or discharge?",
          hi: "नाक बंद या बहने की समस्या कितने समय से है?"
        },
        type: 'single_choice',
        options: {
          en: ["1-3 days", "4-10 days", "More than 10-14 days", "Chronic / recurrent allergy"],
          hi: ["1 से 3 दिन", "4 से 10 दिन", "10 से 14 दिनों से ज़्यादा", "महीनों से / पुरानी एलर्जी"]
        }
      },
      {
        field: 'discharge_type',
        isKnown: (h) => Boolean(h?.hpi?.discharge_type),
        text: {
          en: "What is the nasal discharge like?",
          hi: "नाक से बहने वाला पानी या बलगम कैसा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Clear, watery fluid", "Thick yellow or green mucus", "Bloody / mixed with blood"],
          hi: ["साफ, पानी जैसा", "गाढ़ा पीला या हरा बलगम", "खून मिला हुआ"]
        }
      },
      {
        field: 'facial_pain',
        isKnown: (h) => Boolean(h?.hpi?.facial_pain),
        text: {
          en: "Do you have pain or heavy pressure around your forehead, cheeks, or eyes (Sinus)?",
          hi: "क्या माथे, गालों या आँखों के आसपास भारीपन या दर्द रहता है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, facial pain/pressure (Sinus pressure)", "No facial pain"],
          hi: ["हाँ, चेहरे और माथे में भारीपन/दर्द है", "नहीं, चेहरे में कोई दर्द नहीं है"]
        }
      }
    ]
  }
};

export default entProtocols;
