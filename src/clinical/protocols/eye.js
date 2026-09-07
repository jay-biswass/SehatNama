/**
 * Eye / Vision Clinical History Protocols
 * 1. Eye Pain (आँख में दर्द)
 * 2. Red Eye (आँख लाल होना)
 * 3. Blurred Vision (धुंधला दिखाई देना)
 * 4. Sudden Vision Loss (अचानक नज़र जाना - Urgent Triage Signal)
 */

export const eyeProtocols = {
  eye_pain: {
    id: 'eye_pain',
    title: { en: 'Eye Pain', hi: 'आँख में दर्द' },
    category: 'Eye',
    keywords: [
      'eye pain', 'aankh mein dard', 'aankh dard', 'pain in eye',
      'aankh me dard', 'ocular pain'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Which eye is hurting?",
          hi: "किस आँख में दर्द है?"
        },
        type: 'single_choice',
        options: {
          en: ["Right eye", "Left eye", "Both eyes"],
          hi: ["दाईं आँख (Right)", "बाईं आँख (Left)", "दोनों आँखें (Both)"]
        }
      },
      {
        field: 'character',
        isKnown: (h) => Boolean(h?.hpi?.character),
        text: {
          en: "How would you describe the pain?",
          hi: "दर्द किस तरह का महसूस होता है?"
        },
        type: 'single_choice',
        options: {
          en: ["Foreign body sensation / Scratchy gritty feeling", "Deep throbbing / severe ache", "Burning or stinging"],
          hi: ["कुछ चुभने या रेत जैसा अहसास", "अंदर गहरा, तेज़ टीस वाला दर्द", "जलन या चुभन"]
        }
      },
      {
        field: 'photophobia',
        isKnown: (h) => Boolean(h?.hpi?.photophobia),
        text: {
          en: "Does looking at light make the pain worse (Light sensitivity)?",
          hi: "क्या रोशनी में देखने पर दर्द बढ़ जाता है (Light sensitivity)?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, very sensitive to light", "No light sensitivity"],
          hi: ["हाँ, रोशनी सहन नहीं होती", "नहीं, रोशनी से कोई परेशानी नहीं"]
        }
      },
      {
        field: 'vision_change',
        isKnown: (h) => Boolean(h?.hpi?.vision_change),
        text: {
          en: "Has your vision decreased or become blurry with this pain?",
          hi: "क्या इस दर्द के साथ नज़र कम या धुंधली हुई है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, vision is affected / blurry", "No, vision is completely clear"],
          hi: ["हाँ, नज़र धुंधली या कम हुई है", "नहीं, नज़र बिल्कुल साफ है"]
        }
      }
    ]
  },

  red_eye: {
    id: 'red_eye',
    title: { en: 'Red Eye (Conjunctivitis / Inflammation)', hi: 'आँख लाल होना' },
    category: 'Eye',
    keywords: [
      'red eye', 'aankh laal', 'aankh aana', 'conjunctivitis', 'pink eye',
      'aankh lal hona', 'aankh mein jalan'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Is one eye red or both eyes?",
          hi: "एक आँख लाल है या दोनों?"
        },
        type: 'single_choice',
        options: {
          en: ["Both eyes", "Only right eye", "Only left eye"],
          hi: ["दोनों आँखें", "सिर्फ दाईं आँख", "सिर्फ बाईं आँख"]
        }
      },
      {
        field: 'discharge',
        isKnown: (h) => Boolean(h?.hpi?.discharge),
        text: {
          en: "Is there any discharge, watering, or crusting sticking your eyelids shut?",
          hi: "क्या आँख से चिपचिपा पानी या कीचड़ (discharge) आ रहा है, या सुबह पलकें चिपक जाती हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["Sticky yellow/green discharge (Eyelids glued)", "Clear watery tearing", "No discharge"],
          hi: ["पीला/गाढ़ा कीचड़ (पलकें चिपकना)", "सिर्फ साफ पानी बहना", "कोई कीचड़ या पानी नहीं"]
        }
      },
      {
        field: 'itching',
        isKnown: (h) => Boolean(h?.hpi?.itching),
        text: {
          en: "Is there intense itching in the eyes?",
          hi: "क्या आँखों में बहुत तेज़ खुजली हो रही है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, strong itching (Allergic feeling)", "No itching, mostly irritation/grittiness"],
          hi: ["हाँ, तेज़ खुजली है", "नहीं, खुजली नहीं है, सिर्फ जलन या चुभन है"]
        }
      }
    ]
  },

  blurred_vision: {
    id: 'blurred_vision',
    title: { en: 'Blurred Vision', hi: 'धुंधला दिखाई देना' },
    category: 'Eye',
    keywords: [
      'blurred vision', 'dhundhla dikhna', 'dhundla dikhna', 'blurring of vision',
      'nazar kamzor', 'vision blur', 'dhundhlaapan'
    ],
    questions: [
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did the blurring come on suddenly or develop gradually?",
          hi: "क्या धुंधलापन अचानक आया या धीरे-धीरे कई महीनों में बढ़ा?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly (over hours or days)", "Gradually (months to years)"],
          hi: ["अचानक (कुछ घंटों या दिनों में)", "धीरे-धीरे (महीनों या सालों में)"]
        }
      },
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Is the blurring in one eye or both eyes?",
          hi: "धुंधलापन एक आँख में है या दोनों आँखों में?"
        },
        type: 'single_choice',
        options: {
          en: ["Both eyes", "Only one eye"],
          hi: ["दोनों आँखों में", "सिर्फ एक आँख में"]
        }
      },
      {
        field: 'associated_neurological',
        isKnown: (h) => Boolean(h?.hpi?.associated_neurological),
        text: {
          en: "Are you also experiencing severe headache, weakness on one side, or difficulty speaking?",
          hi: "क्या इसके साथ तेज़ सिरदर्द, शरीर के एक तरफ कमज़ोरी या बोलने में परेशानी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, headache or weakness/speech difficulty present", "No other symptoms, only blurry vision"],
          hi: ["हाँ, सिरदर्द या कमज़ोरी/बोलने में परेशानी है", "नहीं, सिर्फ नज़र में धुंधलापन है"]
        }
      }
    ]
  },

  sudden_vision_loss: {
    id: 'sudden_vision_loss',
    title: { en: 'Sudden Vision Loss', hi: 'अचानक नज़र जाना (आपातकालीन)' },
    category: 'Eye',
    keywords: [
      'sudden vision loss', 'aankh ki roshni chali gayi', 'blindness sudden',
      'vision loss', 'aankhon ke aage andhera', 'sudden blind'
    ],
    questions: [
      {
        field: 'extent',
        isKnown: (h) => Boolean(h?.hpi?.extent),
        text: {
          en: "Is the vision completely gone (darkness) or partially lost (curtain/shadow)?",
          hi: "क्या रोशनी पूरी तरह चली गई है (अंधेरा) या आधा/पर्दा जैसा काला दिख रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Total loss of vision (Complete blackness)", "Partial loss / Dark curtain falling over view"],
          hi: ["पूरी तरह अंधेरा (Total darkness)", "आधा पर्दा या काला साया गिरना"]
        }
      },
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Which eye has lost vision?",
          hi: "किस आँख की रोशनी गई है?"
        },
        type: 'single_choice',
        options: {
          en: ["One eye", "Both eyes"],
          hi: ["एक आँख", "दोनों आँखें"]
        }
      },
      {
        field: 'pain_status',
        isKnown: (h) => Boolean(h?.hpi?.pain_status),
        text: {
          en: "Is this sudden loss accompanied by severe eye pain or is it painless?",
          hi: "क्या यह अचानक नज़र जाना तेज़ दर्द के साथ है या बिल्कुल दर्द-रहित (painless) है?"
        },
        type: 'single_choice',
        options: {
          en: ["Completely painless", "Severe, intense eye pain"],
          hi: ["बिल्कुल दर्द-रहित (Painless)", "आँख में बहुत तेज़ दर्द"]
        }
      }
    ]
  }
};

export default eyeProtocols;
