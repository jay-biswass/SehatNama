/**
 * Neurological Clinical History Protocols
 * 8. Headache
 * 9. Dizziness
 * 10. Fainting (Syncope)
 * 11. Weakness
 * 12. Numbness / Tingling
 */

export const neurologicalProtocols = {
  headache: {
    id: 'headache',
    title: { en: 'Headache', hi: 'सिरदर्द' },
    category: 'Neurological',
    keywords: [
      'headache', 'sir dard', 'sar dard', 'sar mein dard', 'sir me dard',
      'head pain', 'migraine', 'aadha sar dard'
    ],
    questions: [
      {
        field: 'onset_speed',
        isKnown: (h) => Boolean(h?.hpi?.onset_speed || h?.hpi?.onset),
        text: {
          en: "Did the headache reach maximum intensity suddenly like a thunderclap (seconds), or build gradually?",
          hi: "क्या सिरदर्द एकदम अचानक बिजली की तरह (कुछ ही सेकंड में) बहुत तेज हो गया था, या धीरे-धीरे बढ़ा?"
        },
        type: 'single_choice',
        options: {
          en: ["Sudden maximum intensity (thunderclap)", "Built up gradually over hours"],
          hi: ["अचानक बिजली जैसा तीव्र (Thunderclap)", "धीरे-धीरे कुछ घंटों में बढ़ा"]
        }
      },
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where is the headache located?",
          hi: "सिर में दर्द किस तरफ है?"
        },
        type: 'single_choice',
        options: {
          en: ["One side of head", "Forehead / temples", "Back of head / neck", "All over head"],
          hi: ["सिर के एक तरफ (One side)", "माथे पर / कनपटी में", "सिर के पीछे / गर्दन में", "पूरे सिर में"]
        }
      },
      {
        field: 'severity',
        isKnown: (h) => h?.hpi?.severity !== null && h?.hpi?.severity !== undefined,
        text: {
          en: "On a scale of 0 to 10, how severe is the headache?",
          hi: "0 से 10 के पैमाने पर सिरदर्द कितना तेज़ है?"
        },
        type: 'scale',
        options: {
          en: ["3 (Mild)", "6 (Moderate)", "8 (Severe)", "10 (Worst headache of life)"],
          hi: ["3 (हल्का दर्द)", "6 (मध्यम दर्द)", "8 (तेज़ सिरदर्द)", "10 (जीवन का सबसे असहनीय दर्द)"]
        }
      },
      {
        field: 'neuro_warning_signs',
        isKnown: (h) => Boolean(h?.hpi?.neuro_warning_signs),
        text: {
          en: "Are you having any facial droop, arm/leg weakness, vision changes, or difficulty speaking?",
          hi: "क्या चेहरे का टेढ़ापन, हाथ-पैर में कमजोरी, धुंधला दिखना या बोलने में लड़खड़ाहट है?"
        },
        type: 'single_choice',
        options: {
          en: ["Yes, weakness or speech trouble present", "Vision changes or vomiting only", "None of these"],
          hi: ["हाँ, कमजोरी या बोलने में लड़खड़ाहट है", "सिर्फ उल्टी या धुंधलापन है", "इनमें से कोई नहीं"]
        }
      },
      {
        field: 'fever_neck_stiffness',
        isKnown: (h) => Boolean(h?.hpi?.fever_neck_stiffness),
        text: {
          en: "Do you have fever or a stiff neck where bending your chin to chest hurts?",
          hi: "क्या तेज बुखार या गर्दन में जकड़न (ठुड्डी सीने से न लग पाना) है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, fever or stiff neck", "No fever or neck stiffness"],
          hi: ["हाँ, बुखार या गर्दन जकड़न है", "नहीं, गर्दन सामान्य है"]
        }
      }
    ]
  },

  dizziness: {
    id: 'dizziness',
    title: { en: 'Dizziness / Vertigo', hi: 'चक्कर आना (Dizziness)' },
    category: 'Neurological',
    keywords: [
      'dizziness', 'chakkar aana', 'chakkar', 'vertigo', 'spinning sensation',
      'lightheadedness', 'sir ghoomna'
    ],
    questions: [
      {
        field: 'character',
        isKnown: (h) => Boolean(h?.hpi?.character),
        text: {
          en: "Does it feel like the room is spinning around you (vertigo) or do you feel lightheaded / faint?",
          hi: "क्या ऐसा लगता है कि कमरा या दुनिया घूम रही है (चक्कर), या सिर हल्का लग रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Spinning sensation (Room spinning)", "Lightheadedness / feeling faint", "Unsteadiness while walking"],
          hi: ["घूमने जैसा अहसास (कमरा घूमना)", "सिर हल्का लगना / बेहोशी जैसा", "चलने में लड़खड़ाहट"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long do the dizzy episodes last and when did it start?",
          hi: "चक्कर कब से आ रहे हैं और एक बार में कितने समय रहते हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["Seconds to minutes", "Hours", "Constant since started"],
          hi: ["कुछ सेकंड या मिनट", "कुछ घंटे", "लगातार बने हुए हैं"]
        }
      },
      {
        field: 'speech_weakness',
        isKnown: (h) => Boolean(h?.hpi?.speech_weakness),
        text: {
          en: "Is there any difficulty speaking, facial weakness, or arm/leg weakness?",
          hi: "क्या बोलने में परेशानी, चेहरे का टेढ़ापन या हाथ-पैर में कमजोरी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, weakness or speech problem present", "No weakness or speech problem"],
          hi: ["हाँ, कमजोरी या बोली में दिक्कत है", "नहीं, सिर्फ चक्कर है"]
        }
      }
    ]
  },

  fainting: {
    id: 'fainting',
    title: { en: 'Fainting (Syncope)', hi: 'बेहोशी आना (Fainting)' },
    category: 'Neurological',
    keywords: [
      'fainting', 'behosh hona', 'syncope', 'passed out', 'behoshi',
      'blacked out', 'hosh kho dena'
    ],
    questions: [
      {
        field: 'preceding_symptoms',
        isKnown: (h) => Boolean(h?.hpi?.preceding_symptoms),
        text: {
          en: "Did you have chest pain, palpitations, or shortness of breath before passing out?",
          hi: "बेहोश होने से ठीक पहले क्या सीने में दर्द, धड़कन तेज होना या सांस फूलना हुआ था?"
        },
        type: 'single_choice',
        options: {
          en: ["Chest pain or palpitations before fainting", "Stood up too quickly / prolonged standing", "No warning signs at all"],
          hi: ["सीने में दर्द या धड़कन तेज़ हुई थी", "अचानक खड़े होने पर हुआ", "बिना किसी चेतावनी के अचानक"]
        }
      },
      {
        field: 'recovery',
        isKnown: (h) => Boolean(h?.hpi?.recovery),
        text: {
          en: "How quickly did you regain full awareness, and was there any injury?",
          hi: "होश कितनी देर में वापस आया और क्या गिरने से कोई चोट लगी?"
        },
        type: 'single_choice',
        options: {
          en: ["Recovered quickly within 1-2 minutes", "Prolonged confusion after waking", "Suffered head or body injury"],
          hi: ["1-2 मिनट में सामान्य होश आ गया", "होश आने के बाद काफी देर तक भ्रम था", "गिरने से सिर या शरीर पर चोट लगी"]
        }
      }
    ]
  },

  weakness: {
    id: 'weakness',
    title: { en: 'Weakness', hi: 'शरीर या अंग में कमजोरी' },
    category: 'Neurological',
    keywords: [
      'weakness', 'kamzori', 'ang mein kamzori', 'haath pair mein kamzori',
      'body weakness', 'motor weakness', 'ek taraf kamzori'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Is the weakness on one side of your body (one arm or leg) or generalized all over?",
          hi: "कमजोरी शरीर के एक तरफ (एक हाथ या पैर) है या पूरे शरीर में?"
        },
        type: 'single_choice',
        options: {
          en: ["One side of body (one arm/leg)", "Both legs only", "Generalized whole body fatigue"],
          hi: ["शरीर के एक तरफ (एक हाथ या पैर)", "सिर्फ दोनों पैरों में", "पूरे शरीर में सामान्य थकान/कमजोरी"]
        }
      },
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did this weakness begin suddenly (minutes/hours) or gradually over weeks?",
          hi: "यह कमजोरी अचानक कुछ ही मिनटों/घंटों में आई या कई दिनों में?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly (Today / within hours)", "Gradually over weeks or months"],
          hi: ["अचानक (आज या कुछ घंटों में)", "धीरे-धीरे हफ़्तों या महीनों में"]
        }
      },
      {
        field: 'face_speech',
        isKnown: (h) => Boolean(h?.hpi?.face_speech),
        text: {
          en: "Is there any drooping of the face or slurred speech?",
          hi: "क्या चेहरे में टेढ़ापन या बोलने में लड़खड़ाहट है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, facial droop or speech slurring", "No facial droop or speech changes"],
          hi: ["हाँ, चेहरे में टेढ़ापन या बोली में लड़खड़ाहट है", "नहीं, चेहरा और बोली सामान्य है"]
        }
      }
    ]
  },

  numbness_tingling: {
    id: 'numbness_tingling',
    title: { en: 'Numbness or Tingling', hi: 'सुन्नपन या झनझनाहट (Numbness)' },
    category: 'Neurological',
    keywords: [
      'numbness', 'tingling', 'sunn hona', 'jhanjhanahat', 'haath sunn',
      'pair sunn', 'loss of sensation', 'pins and needles'
    ],
    questions: [
      {
        field: 'site',
        isKnown: (h) => Boolean(h?.hpi?.site),
        text: {
          en: "Where exactly do you feel the numbness or pins-and-needles?",
          hi: "सुन्नपन या झनझनाहट शरीर के किस हिस्से में महसूस हो रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["One side of body / face", "Both feet and hands (gloves/socks)", "Specific fingers / toes"],
          hi: ["शरीर या चेहरे के एक तरफ", "दोनों पैरों और हाथों में", "उंगलियों में"]
        }
      },
      {
        field: 'associated_weakness',
        isKnown: (h) => Boolean(h?.hpi?.associated_weakness),
        text: {
          en: "Is there also weakness or loss of grip in that arm or leg?",
          hi: "क्या उस हाथ या पैर में पकड़ कमजोर होना या कमजोरी भी है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, accompanied by weakness", "Only numbness, no weakness"],
          hi: ["हाँ, साथ में कमजोरी भी है", "सिर्फ सुन्नपन है, कमजोरी नहीं"]
        }
      }
    ]
  }
};

export default neurologicalProtocols;
