/**
 * Respiratory Clinical History Protocols
 * 4. Breathlessness (Dyspnea)
 * 5. Cough
 * 6. Wheezing
 * 7. Sore Throat
 */

export const respiratoryProtocols = {
  breathlessness: {
    id: 'breathlessness',
    title: { en: 'Difficulty Breathing', hi: 'सांस लेने में कठिनाई / सांस फूलना' },
    category: 'Respiratory',
    keywords: [
      'breathlessness', 'saans lene mein dikkat', 'saans phoolna', 'shortness of breath',
      'dyspnea', 'trouble breathing', 'saans ki takleef', 'dam phoolna'
    ],
    questions: [
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did the breathing difficulty start suddenly or develop gradually?",
          hi: "सांस फूलने की समस्या अचानक शुरू हुई या धीरे-धीरे बढ़ी?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly (within minutes/hours)", "Gradually (over days/weeks)"],
          hi: ["अचानक (कुछ ही देर में)", "धीरे-धीरे (कुछ दिनों में)"]
        }
      },
      {
        field: 'rest_vs_exertion',
        isKnown: (h) => Boolean(h?.hpi?.rest_vs_exertion),
        text: {
          en: "Is the breathlessness happening while resting, or only when moving / exerting?",
          hi: "क्या सांस बैठे-बैठे (आराम में) फूल रही है या चलने-फिरने पर?"
        },
        type: 'single_choice',
        options: {
          en: ["Even at rest", "Only on exertion / walking", "Both"],
          hi: ["बैठे रहने पर भी (आराम में)", "सिर्फ चलने या मेहनत करने पर", "दोनों समय"]
        }
      },
      {
        field: 'speech_difficulty',
        isKnown: (h) => Boolean(h?.hpi?.speech_difficulty),
        text: {
          en: "Are you able to speak full sentences without pausing to breathe?",
          hi: "क्या आप बिना रुके पूरा वाक्य बोल पा रहे हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["Can speak normally", "Cannot speak full sentences (gasping)"],
          hi: ["सामान्य बोल पा रहे हैं", "सांस फूलने से पूरा वाक्य नहीं बोला जा रहा"]
        }
      },
      {
        field: 'chest_pain',
        isKnown: (h) => Boolean(h?.hpi?.associated_chest_pain || h?.chief_complaint === 'chest pain'),
        text: {
          en: "Are you having any chest pain or heaviness alongside the breathing trouble?",
          hi: "क्या सांस में तकलीफ के साथ सीने में दर्द या भारीपन भी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, chest pain present", "No chest pain"],
          hi: ["हाँ, सीने में दर्द है", "नहीं, सीने में दर्द नहीं है"]
        }
      },
      {
        field: 'cough_wheezing',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('cough') || s.includes('wheezing');
        },
        text: {
          en: "Do you have a cough or whistling/wheezing sound when breathing?",
          hi: "क्या खांसी या सांस लेते समय सीटी जैसी आवाज (wheezing) आ रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Cough present", "Wheezing / whistling sound", "Both", "Neither"],
          hi: ["खांसी है", "सीटी जैसी आवाज आ रही है", "दोनों हैं", "कोई नहीं"]
        }
      }
    ]
  },

  cough: {
    id: 'cough',
    title: { en: 'Cough', hi: 'खांसी' },
    category: 'Respiratory',
    keywords: [
      'cough', 'khansi', 'coughing', 'balgham', 'phlegm', 'dry cough', 'wet cough', 'khasi'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this cough?",
          hi: "खांसी कितने समय से आ रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Less than 1 week", "1 to 2 weeks", "3 to 4 weeks", "More than a month"],
          hi: ["1 हफ्ते से कम", "1 से 2 हफ्ते", "3 से 4 हफ्ते", "1 महीने से ज्यादा"]
        }
      },
      {
        field: 'character',
        isKnown: (h) => Boolean(h?.hpi?.character),
        text: {
          en: "Is it a dry cough or is there phlegm (mucus)?",
          hi: "खांसी सूखी है या बलगम (कफ) आ रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Dry cough", "Cough with phlegm / mucus"],
          hi: ["सूखी खांसी (Dry cough)", "बलगम वाली खांसी (With phlegm)"]
        }
      },
      {
        field: 'blood_in_sputum',
        isKnown: (h) => Boolean(h?.hpi?.blood_in_sputum),
        text: {
          en: "Have you noticed any blood or reddish specks in the cough?",
          hi: "क्या खांसी या बलगम में खून (लाल रंग) दिखाई दिया है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, blood seen in cough", "No blood in cough"],
          hi: ["हाँ, खून दिखाई दिया है", "नहीं, बिल्कुल खून नहीं है"]
        }
      },
      {
        field: 'fever_breathlessness',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('fever') || s.includes('breathing difficulty');
        },
        text: {
          en: "Are you also experiencing fever or shortness of breath?",
          hi: "क्या खांसी के साथ बुखार या सांस फूलने की समस्या है?"
        },
        type: 'single_choice',
        options: {
          en: ["Fever present", "Shortness of breath present", "Both", "Neither"],
          hi: ["बुखार है", "सांस फूल रही है", "दोनों हैं", "दोनों नहीं हैं"]
        }
      }
    ]
  },

  wheezing: {
    id: 'wheezing',
    title: { en: 'Wheezing', hi: 'सांस में सीटी जैसी आवाज (Wheezing)' },
    category: 'Respiratory',
    keywords: [
      'wheezing', 'seeti jaisi aawaz', 'whistling breath', 'asthma attack', 'dama'
    ],
    questions: [
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "When did the wheezing sound or chest tightness begin?",
          hi: "सांस में सीटी जैसी आवाज या जकड़न कब से हो रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Today / Just now", "A few days ago", "Recurring long-term problem"],
          hi: ["आज / अभी से", "कुछ दिन पहले से", "लंबे समय से बार-बार होता है"]
        }
      },
      {
        field: 'inhaler_use',
        isKnown: (h) => Boolean(h?.hpi?.inhaler_use),
        text: {
          en: "Do you have diagnosed asthma and have you tried using an inhaler/nebulizer?",
          hi: "क्या आपको पहले से दमा (अस्थमा) है और क्या आपने इनहेलर लिया है?"
        },
        type: 'single_choice',
        options: {
          en: ["Used inhaler with relief", "Used inhaler but NO relief", "Do not use inhaler"],
          hi: ["इनहेलर लिया और आराम मिला", "इनहेलर लिया पर कोई आराम नहीं", "इनहेलर नहीं लेते"]
        }
      },
      {
        field: 'speech_difficulty',
        isKnown: (h) => Boolean(h?.hpi?.speech_difficulty),
        text: {
          en: "Are you able to speak comfortably, or struggling for breath?",
          hi: "क्या आप आसानी से बोल पा रहे हैं या सांस फूलने से रुकना पड़ रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Speaking normally", "Struggling to speak full words"],
          hi: ["सामान्य बोल रहे हैं", "सांस फूलने से बोलने में परेशानी"]
        }
      }
    ]
  },

  sore_throat: {
    id: 'sore_throat',
    title: { en: 'Sore Throat', hi: 'गले में खराश या दर्द' },
    category: 'Respiratory',
    keywords: [
      'sore throat', 'gale mein kharash', 'gale mein dard', 'throat pain',
      'gala kharab', 'swallowing pain'
    ],
    questions: [
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How many days have you had a sore throat?",
          hi: "गले में खराश या दर्द कितने दिनों से है?"
        },
        type: 'single_choice',
        options: {
          en: ["1-2 days", "3-5 days", "More than a week"],
          hi: ["1-2 दिन से", "3-5 दिन से", "एक हफ्ते से ज्यादा"]
        }
      },
      {
        field: 'swallowing_breathing',
        isKnown: (h) => Boolean(h?.hpi?.swallowing_breathing),
        text: {
          en: "Are you able to swallow liquids and saliva, and breathe normally?",
          hi: "क्या पानी या थूक निगलने में बहुत तेज दर्द है या सांस लेने में रुकावट है?"
        },
        type: 'single_choice',
        options: {
          en: ["Can swallow liquids normally", "Severe pain / cannot swallow saliva", "Difficulty breathing / stridor"],
          hi: ["पानी पी पा रहे हैं", "थूक भी नहीं निगला जा रहा (तेज़ दर्द)", "सांस लेने में रुकावट महसूस हो रही है"]
        }
      },
      {
        field: 'fever',
        isKnown: (h) => {
          const s = h?.hpi?.associated_symptoms || [];
          return s.includes('fever');
        },
        text: {
          en: "Do you have an accompanying fever?",
          hi: "क्या इसके साथ बुखार भी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fever present", "No fever"],
          hi: ["हाँ, बुखार है", "नहीं, बुखार नहीं है"]
        }
      }
    ]
  }
};

export default respiratoryProtocols;
