/**
 * Mental Wellbeing / Psychiatric Clinical History Protocols
 * 1. Sleep Problems (नींद न आना / बार-बार खुलना - Insomnia)
 * 2. Anxiety Symptoms (घबराहट / बेचैनी / Restlessness)
 * 3. Low Mood (उदास मन / रोने का मन / Anhedonia)
 *
 * NOTE: These are strictly non-diagnostic history protocols.
 * Any expression of self-harm or suicidal ideation immediately triggers
 * emergency red flag escalation to human clinical care / helplines.
 */

export const mentalWellbeingProtocols = {
  sleep_problems: {
    id: 'sleep_problems',
    title: { en: 'Sleep Problems (Insomnia)', hi: 'नींद की समस्या' },
    category: 'Mental Wellbeing',
    keywords: [
      'sleep problems', 'neend nahi aana', 'insomnia', 'neend ki samasya',
      'sleeplessness', 'raat ko neend na aana', 'poor sleep', 'disturbed sleep'
    ],
    questions: [
      {
        field: 'pattern',
        isKnown: (h) => Boolean(h?.hpi?.pattern),
        text: {
          en: "What kind of sleep trouble are you experiencing?",
          hi: "नींद में किस तरह की परेशानी आ रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["Difficulty falling asleep (Tossing for hours)", "Waking up frequently during the night", "Waking up very early in the morning and cannot sleep again", "Excessive daytime sleepiness"],
          hi: ["सोने में बहुत समय लगना (करवटें बदलना)", "रात में बार-बार आँख खुलना", "सुबह बहुत जल्दी नींद खुल जाना और दोबारा न आना", "दिन में हर वक्त बहुत सुस्ती/नींद आना"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this sleep difficulty?",
          hi: "नींद न आने की यह समस्या कितने समय से चल रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["A few days (Recent stress or event)", "A few weeks", "Several months / Chronic"],
          hi: ["कुछ दिनों से (हालिया तनाव या घटना)", "कुछ हफ्तों से", "काफी महीनों से"]
        }
      },
      {
        field: 'snoring_breathing',
        isKnown: (h) => Boolean(h?.hpi?.snoring_breathing),
        text: {
          en: "Does anyone tell you that you snore loudly or gasp/choke in your sleep?",
          hi: "क्या कोई बताता है कि आप तेज़ खर्राटे लेते हैं या नींद में सांस अटकती है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, loud snoring or gasping in sleep", "No snoring"],
          hi: ["हाँ, खर्राटे या सांस अटकने की बात बताते हैं", "नहीं, खर्राटे नहीं आते"]
        }
      }
    ]
  },

  anxiety_symptoms: {
    id: 'anxiety_symptoms',
    title: { en: 'Anxiety & Restlessness', hi: 'घबराहट और बेचैनी' },
    category: 'Mental Wellbeing',
    keywords: [
      'anxiety', 'ghabrahat', 'bechaini', 'restlessness', 'panic feeling',
      'chinta', 'nervousness', 'dil ki dhadkan tezz'
    ],
    questions: [
      {
        field: 'symptoms_nature',
        isKnown: (h) => Boolean(h?.hpi?.symptoms_nature),
        text: {
          en: "What physical feelings accompany this feeling of anxiety or worry?",
          hi: "घबराहट या चिंता के समय शरीर में क्या महसूस होता है?"
        },
        type: 'single_choice',
        options: {
          en: ["Rapid heartbeat & sweaty palms (Panic attacks)", "Constant worrying thoughts & body tension", "Trembling hands & shortness of breath"],
          hi: ["तेज़ धड़कन और हथेलियों में पसीना (Panic feeling)", "लगातार चिंता वाले विचार और मांसपेशियों में तनाव", "हाथों में कंपन और सांस फूलना"]
        }
      },
      {
        field: 'timing',
        isKnown: (h) => Boolean(h?.hpi?.timing),
        text: {
          en: "Do these episodes happen suddenly out of nowhere or during specific situations?",
          hi: "क्या यह घबराहट अचानक बिना किसी कारण आती है या किसी खास स्थिति में?"
        },
        type: 'single_choice',
        options: {
          en: ["Sudden severe attacks out of nowhere (Sudden panic)", "Constant daily background worry", "Only in social settings or public speaking"],
          hi: ["अचानक बिना किसी कारण तेज़ अटैक", "दिनभर लगातार चिंता बनी रहती है", "भीड़ में या लोगों के सामने जाने पर"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you been troubled by this anxiety?",
          hi: "यह घबराहट कितने समय से आपको परेशान कर रही है?"
        },
        type: 'single_choice',
        options: {
          en: ["A few days", "A few weeks", "More than 6 months"],
          hi: ["कुछ दिनों से", "कुछ हफ्तों से", "6 महीने से ज़्यादा समय से"]
        }
      }
    ]
  },

  low_mood: {
    id: 'low_mood',
    title: { en: 'Low Mood & Fatigue', hi: 'उदास मन और सुस्ती' },
    category: 'Mental Wellbeing',
    keywords: [
      'low mood', 'udaasi', 'depressed', 'rone ka man', 'sadness',
      'man nahi lagna', 'loss of interest', 'depression', 'mood off'
    ],
    questions: [
      {
        field: 'anhedonia',
        isKnown: (h) => Boolean(h?.hpi?.anhedonia),
        text: {
          en: "Over the past 2 weeks, have you lost interest or pleasure in things you usually enjoy?",
          hi: "पिछले 2 हफ्तों में, क्या उन कामों में भी मन नहीं लग रहा जिन्हें आप पहले पसंद करते थे?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, lost interest in almost everything", "No, still enjoy daily activities"],
          hi: ["हाँ, किसी भी चीज़ में मन नहीं लगता (Interest loss)", "नहीं, रोज़मर्रा के कामों में मन लगता है"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you been feeling this down or low?",
          hi: "मन उदास या गिरा हुआ कितने समय से महसूस हो रहा है?"
        },
        type: 'single_choice',
        options: {
          en: ["Past few days", "More than 2 consecutive weeks", "Months or longer"],
          hi: ["पिछले कुछ दिनों से", "लगातार 2 हफ्तों से ज़्यादा से", "कई महीनों से"]
        }
      },
      {
        field: 'daily_functioning',
        isKnown: (h) => Boolean(h?.hpi?.daily_functioning),
        text: {
          en: "Has this feeling made it very hard to take care of your work, home, or yourself?",
          hi: "क्या इस वजह से कामकाज, घर की ज़िम्मेदारियों या अपना ध्यान रखना बहुत मुश्किल हो रहा है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, severely affecting daily work and life", "No, managing daily tasks with effort"],
          hi: ["हाँ, रोज़मर्रा के काम करने में बहुत कठिनाई आ रही है", "नहीं, कामकाज जैसे-तैसे संभाल पा रहे हैं"]
        }
      }
    ]
  }
};

export default mentalWellbeingProtocols;
