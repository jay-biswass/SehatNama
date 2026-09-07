/**
 * General Clinical History Protocols
 * 18. Fever
 * 19. Fatigue
 * 20. Weight Loss
 */

export const generalProtocols = {
  fever: {
    id: 'fever',
    title: { en: 'Fever', hi: 'बुखार (Fever)' },
    category: 'General',
    keywords: [
      'fever', 'bukhar', 'tapman', 'temperature', 'chills', 'thand lagna',
      'bukhar aana', 'garam sharir'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How many days have you had this fever?",
          hi: "बुखार कितने दिनों से आ रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started today / yesterday", "3 to 5 days", "1 to 2 weeks", "More than 2 weeks"],
          hi: ["आज या कल से शुरू हुआ", "3 से 5 दिनों से", "1 से 2 हफ़्तों से", "2 हफ़्तों से अधिक"]
        }
      },
      {
        field: 'chills_rigors',
        isKnown: (h) => Boolean(h?.hpi?.chills_rigors),
        text: {
          en: "Do you experience shivering (chills) or sweating when the fever comes?",
          hi: "क्या बुखार के साथ कंपकंपी (ठंड) लगती है या बहुत पसीना आता है?"
        },
        type: 'single_choice',
        options: {
          en: ["Shivering / chills present", "Sweating episodes present", "Neither"],
          hi: ["कंपकंपी (ठंड) लगती है", "पसीना आता है", "दोनों में से कोई नहीं"]
        }
      },
      {
        field: 'rash_bleed',
        isKnown: (h) => Boolean(h?.hpi?.rash_bleed),
        text: {
          en: "Have you noticed any red skin spots/rash, bleeding gums, or extreme confusion?",
          hi: "क्या शरीर पर लाल दाने, मसूड़ों से खून आना या अत्यधिक सुस्ती/बेहोशी जैसा है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, rash, bleeding, or confusion present", "No rash, bleeding, or confusion"],
          hi: ["हाँ, दाने, खून या बेहोशी जैसे लक्षण हैं", "नहीं, ऐसा कोई लक्षण नहीं है"]
        }
      },
      {
        field: 'associated_symptoms',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.length > 0;
        },
        text: {
          en: "Do you also have cough, burning urination, or severe body aches?",
          hi: "क्या बुखार के साथ खांसी, पेशाब में जलन या तेज बदन दर्द है?"
        },
        type: 'single_choice',
        options: {
          en: ["Cough / throat problem", "Burning urination", "Severe body ache / joint pain", "None of these"],
          hi: ["खांसी / गले में दिक्कत", "पेशाब में जलन", "तेज बदन दर्द / जोड़ों में दर्द", "इनमें से कोई नहीं"]
        }
      }
    ]
  },

  fatigue: {
    id: 'fatigue',
    title: { en: 'Fatigue / Exhaustion', hi: 'अत्यधिक थकान या कमजोरी' },
    category: 'General',
    keywords: [
      'fatigue', 'thakan', 'thakawat', 'exhaustion', 'tiredness', 'sust', 'low energy'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you been feeling unusually exhausted or drained?",
          hi: "यह अत्यधिक थकान या कमजोरी कितने समय से महसूस हो रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["A few days to 1 week", "2 to 4 weeks", "Months"],
          hi: ["कुछ दिन से 1 हफ्ते", "2 से 4 हफ्ते", "कई महीनों से"]
        }
      },
      {
        field: 'breathlessness_pale',
        isKnown: (h) => Boolean(h?.hpi?.breathlessness_pale),
        text: {
          en: "Do you get breathless easily when walking, or have pale skin/palms?",
          hi: "क्या थोड़ा चलने पर भी सांस फूल जाती है या चेहरा/हथेलियां पीली लगती हैं?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, breathless on minor exertion", "No breathing trouble"],
          hi: ["हाँ, थोड़ा चलने पर भी सांस फूलती है", "नहीं, सांस ठीक रहती है"]
        }
      }
    ]
  },

  weight_loss: {
    id: 'weight_loss',
    title: { en: 'Unexplained Weight Loss', hi: 'अकारण वजन कम होना' },
    category: 'General',
    keywords: [
      'weight loss', 'vajan kam hona', 'unintentional weight loss',
      'patla hona', 'kapde dheele hona'
    ],
    questions: [
      {
        field: 'duration_amount',
        isKnown: (h) => Boolean(h?.hpi?.duration_amount),
        text: {
          en: "Over what period of time did you lose weight, and was it intentional (dieting) or unintentional?",
          hi: "वजन कितने समय में घटा है और क्या यह बिना किसी डाइटिंग के अपने आप घटा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Unintentional (dropped rapidly without dieting)", "Intentional (dieting/exercise)"],
          hi: ["बिना कोशिश किए अपने आप तेज़ी से घटा", "डाइटिंग या कसरत से घटाया"]
        }
      },
      {
        field: 'fever_night_sweats',
        isKnown: (h) => Boolean(h?.hpi?.fever_night_sweats),
        text: {
          en: "Have you had persistent evening fevers, chronic cough, or waking up drenched in sweat at night?",
          hi: "क्या शाम को बुखार, हफ़्तों पुरानी खांसी या रात में पसीने से भीग जाना होता है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fever, night sweats, or chronic cough present", "No fever or night sweats"],
          hi: ["हाँ, बुखार, रात में पसीना या पुरानी खांसी है", "नहीं, ऐसा नहीं है"]
        }
      }
    ]
  }
};

export default generalProtocols;
