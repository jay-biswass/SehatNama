export const healthQuestionFlows = {
  chest_pain: {
    title: "Chest Pain",
    intro: "I understand you're experiencing chest discomfort. I'll ask a few questions to better understand your symptoms.",
    questions: [
      {
        id: "onset",
        question: "When did the pain start?",
        type: "single_choice",
        options: ["Just now", "Within the last few hours", "Today", "Yesterday", "A few days ago", "More than a week ago"]
      },
      {
        id: "location",
        question: "Where exactly do you feel the pain?",
        type: "single_choice",
        options: ["Center of my chest", "Left side of my chest", "Right side of my chest", "Upper chest", "I am not sure", "Somewhere else"]
      },
      {
        id: "severity",
        question: "How severe is the pain?",
        type: "scale"
      },
      {
        id: "pain_character",
        question: "What does the pain feel like?",
        type: "single_choice",
        options: ["Sharp", "Pressure or tightness", "Burning", "Dull ache", "Heavy feeling", "Other"]
      },
      {
        id: "radiation",
        question: "Does the pain spread anywhere?",
        type: "multiple_choice",
        options: ["Left arm", "Right arm", "Shoulder", "Neck", "Jaw", "Back", "It does not spread"]
      },
      {
        id: "breathing",
        question: "Are you having difficulty breathing?",
        type: "yes_no"
      },
      {
        id: "sweating",
        question: "Are you experiencing unusual sweating?",
        type: "yes_no"
      },
      {
        id: "nausea_dizziness",
        question: "Are you feeling nausea or dizziness?",
        type: "multiple_choice",
        options: ["Nausea", "Dizziness", "Both", "Neither"]
      }
    ]
  },
  headache: {
    title: "Headache",
    intro: "I'll ask a few questions about your headache to understand it better.",
    questions: [
      { id: "onset", question: "When did the headache start?", type: "single_choice", options: ["Just now", "Today", "Yesterday", "A few days ago", "More than a week ago"] },
      { id: "location", question: "Where is the headache located?", type: "single_choice", options: ["Front", "Back", "One side", "All over", "Behind eyes"] },
      { id: "severity", question: "How severe is the headache?", type: "scale" },
      { id: "onset_speed", question: "Did it start suddenly or gradually?", type: "single_choice", options: ["Suddenly", "Gradually"] },
      { id: "nausea", question: "Are you experiencing nausea or vomiting?", type: "yes_no" },
      { id: "vision", question: "Do you have any vision changes?", type: "yes_no" },
      { id: "fever", question: "Do you have fever?", type: "yes_no" },
      { id: "similar", question: "Have you experienced a similar headache before?", type: "yes_no" }
    ]
  },
  abdominal_pain: {
    title: "Abdominal Pain",
    intro: "Let's gather some details about your abdominal pain.",
    questions: [
      { id: "onset", question: "When did the pain start?", type: "single_choice", options: ["Just now", "Today", "Yesterday", "A few days ago", "More than a week ago"] },
      { id: "location", question: "Where exactly is the pain located?", type: "single_choice", options: ["Upper abdomen", "Lower abdomen", "Right side", "Left side", "All over"] },
      { id: "severity", question: "How severe is the pain?", type: "scale" },
      { id: "character", question: "Is the pain constant or does it come and go?", type: "single_choice", options: ["Constant", "Comes and goes"] },
      { id: "nausea", question: "Are you experiencing nausea or vomiting?", type: "yes_no" },
      { id: "fever", question: "Do you have fever?", type: "yes_no" },
      { id: "bowel", question: "Have you noticed changes in bowel movements?", type: "yes_no" },
      { id: "eating", question: "Does eating or drinking affect the pain?", type: "single_choice", options: ["Makes it worse", "Makes it better", "No effect"] }
    ]
  },
  fever: {
    title: "Fever",
    intro: "I'll ask a few questions to understand your fever and associated symptoms.",
    questions: [
      { id: "onset", question: "When did the fever start?", type: "single_choice", options: ["Today", "Yesterday", "A few days ago", "More than a week ago"] },
      { id: "measured", question: "Have you measured your temperature?", type: "yes_no" },
      { id: "chills", question: "Are you experiencing chills?", type: "yes_no" },
      { id: "respiratory", question: "Do you have a cough or sore throat?", type: "yes_no" },
      { id: "body_aches", question: "Are you experiencing body aches?", type: "yes_no" },
      { id: "nausea", question: "Do you have nausea or vomiting?", type: "yes_no" },
      { id: "rash", question: "Have you noticed a rash?", type: "yes_no" },
      { id: "travel", question: "Have you recently travelled?", type: "yes_no" }
    ]
  },
  cough: {
    title: "Cough",
    intro: "Let's find out more about your cough.",
    questions: [
      { id: "duration", question: "How long have you had the cough?", type: "single_choice", options: ["A few days", "1-2 weeks", "3-4 weeks", "More than a month"] },
      { id: "type", question: "Is the cough dry or productive?", type: "single_choice", options: ["Dry", "Productive (with mucus)"] },
      { id: "mucus", question: "If productive, what is the color of the mucus?", type: "single_choice", options: ["Clear", "Yellow/Green", "Brown", "Not applicable"] },
      { id: "fever", question: "Are you experiencing fever?", type: "yes_no" },
      { id: "breathing", question: "Are you experiencing difficulty breathing?", type: "yes_no" },
      { id: "chest_pain", question: "Are you experiencing chest discomfort?", type: "yes_no" },
      { id: "blood", question: "Have you noticed blood while coughing?", type: "yes_no" },
      { id: "worse", question: "Is the cough getting worse?", type: "yes_no" }
    ]
  },
  difficulty_breathing: {
    title: "Difficulty Breathing",
    intro: "I'll ask a few questions to understand your breathing difficulty.",
    questions: [
      { id: "onset", question: "When did the breathing difficulty begin?", type: "single_choice", options: ["Just now", "Today", "Yesterday", "A few days ago"] },
      { id: "speed", question: "Did it start suddenly or gradually?", type: "single_choice", options: ["Suddenly", "Gradually"] },
      { id: "trigger", question: "Is it happening while resting or during activity?", type: "single_choice", options: ["Resting", "Activity", "Both"] },
      { id: "chest_pain", question: "Are you experiencing chest discomfort?", type: "yes_no" },
      { id: "dizziness", question: "Are you experiencing dizziness?", type: "yes_no" },
      { id: "cough", question: "Do you have a cough?", type: "yes_no" },
      { id: "fever", question: "Do you have fever?", type: "yes_no" },
      { id: "worse", question: "Is the breathing difficulty getting worse?", type: "yes_no" }
    ]
  },
  nausea_vomiting: {
    title: "Nausea or Vomiting",
    intro: "Let's gather some details about your nausea or vomiting.",
    questions: [
      { id: "onset", question: "When did the nausea or vomiting begin?", type: "single_choice", options: ["Today", "Yesterday", "A few days ago"] },
      { id: "frequency", question: "How frequently are you vomiting?", type: "single_choice", options: ["Once or twice", "Multiple times a day", "I am only nauseous"] },
      { id: "pain", question: "Are you experiencing abdominal pain?", type: "yes_no" },
      { id: "fever", question: "Do you have fever?", type: "yes_no" },
      { id: "fluids", question: "Are you able to keep fluids down?", type: "yes_no" },
      { id: "blood", question: "Have you noticed blood in vomit?", type: "yes_no" },
      { id: "dizziness", question: "Are you experiencing dizziness?", type: "yes_no" },
      { id: "food", question: "Have you recently eaten anything unusual?", type: "yes_no" }
    ]
  },
  body_joint_pain: {
    title: "Body or Joint Pain",
    intro: "Let's find out more about your pain.",
    questions: [
      { id: "location", question: "Where is the pain located?", type: "single_choice", options: ["One joint", "Multiple joints", "Muscles", "All over"] },
      { id: "onset", question: "When did it begin?", type: "single_choice", options: ["Today", "Yesterday", "A few days ago", "More than a week ago"] },
      { id: "severity", question: "How severe is the pain?", type: "scale" },
      { id: "injury", question: "Did the pain begin after an injury?", type: "yes_no" },
      { id: "swelling", question: "Is there swelling?", type: "yes_no" },
      { id: "warmth", question: "Is the area red or warm?", type: "yes_no" },
      { id: "movement", question: "Does movement make it worse?", type: "yes_no" },
      { id: "history", question: "Have you experienced this before?", type: "yes_no" }
    ]
  },
  weakness_fatigue: {
    title: "General Weakness or Fatigue",
    intro: "Let's understand your fatigue better.",
    questions: [
      { id: "onset", question: "When did you start feeling unusually tired?", type: "single_choice", options: ["A few days ago", "A few weeks ago", "Months ago"] },
      { id: "pattern", question: "Is the tiredness constant or occasional?", type: "single_choice", options: ["Constant", "Occasional"] },
      { id: "dizziness", question: "Are you experiencing dizziness?", type: "yes_no" },
      { id: "breathing", question: "Are you experiencing shortness of breath?", type: "yes_no" },
      { id: "appetite", question: "Have you experienced changes in appetite?", type: "yes_no" },
      { id: "sleep", question: "Are you sleeping normally?", type: "yes_no" },
      { id: "weight", question: "Have you recently lost weight unexpectedly?", type: "yes_no" },
      { id: "impact", question: "Does the fatigue affect your daily activities?", type: "yes_no" }
    ]
  },
  other: {
    title: "Other Health Concern",
    intro: "Please describe what you are experiencing.",
    questions: [
      {
        id: "description",
        question: "Please describe what you are experiencing.",
        type: "text"
      },
      {
        id: "category",
        question: "Which of these best matches your symptom?",
        type: "single_choice",
        options: [
          "Pain",
          "Fever / Infection",
          "Stomach / Digestion",
          "Breathing / Chest",
          "Skin / Rash",
          "General feeling of illness",
          "Something else"
        ]
      }
    ]
  }
};
