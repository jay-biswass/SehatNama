/**
 * Generic Presenting Complaint Clinical History Protocol
 * Standard clinical history-taking fallback for any unlisted or broad OPD presentation.
 * Follows the universal medical history framework:
 * - Nature & Site
 * - Onset
 * - Duration
 * - Severity
 * - Progression (Course)
 * - Associated Symptoms
 * - Aggravating / Relieving Factors
 * - Prior Occurrences
 */

export const genericComplaintProtocol = {
  generic_complaint: {
    id: 'generic_complaint',
    title: { en: 'General Medical Complaint', hi: 'सामान्य स्वास्थ्य समस्या' },
    category: 'General OPD Intake',
    keywords: ['general', 'other', 'unspecified', 'samanya', 'koi aur samasya'],
    questions: [
      {
        field: 'onset',
        isKnown: (h) => Boolean(h?.hpi?.onset),
        text: {
          en: "Did this problem start suddenly, or has it been coming on gradually?",
          hi: "क्या यह समस्या अचानक शुरू हुई या धीरे-धीरे बढ़ी है?"
        },
        type: 'single_choice',
        options: {
          en: ["Suddenly", "Gradually over days", "Gradually over weeks or months"],
          hi: ["अचानक (Suddenly)", "कुछ दिनों में धीरे-धीरे", "हफ्तों या महीनों में धीरे-धीरे"]
        }
      },
      {
        field: 'duration',
        isKnown: (h) => Boolean(h?.hpi?.duration),
        text: {
          en: "How long have you had this issue?",
          hi: "यह परेशानी कितने समय से है?"
        },
        type: 'single_choice',
        options: {
          en: ["Started today", "2 to 3 days", "About 1 week", "More than a month"],
          hi: ["आज से", "2 से 3 दिन से", "लगभग 1 हफ्ते से", "एक महीने से ज़्यादा समय से"]
        }
      },
      {
        field: 'severity',
        isKnown: (h) => h?.hpi?.severity !== null && h?.hpi?.severity !== undefined,
        text: {
          en: "On a scale of 0 to 10, how severe is your discomfort right now?",
          hi: "0 से 10 के पैमाने पर आपकी तकलीफ कितनी गंभीर है?"
        },
        type: 'scale',
        options: {
          en: ["2 (Mild)", "5 (Moderate)", "8 (Severe)", "10 (Very Severe)"],
          hi: ["2 (हल्की तकलीफ)", "5 (मध्यम)", "8 (गंभीर)", "10 (असहनीय)"]
        }
      },
      {
        field: 'progression',
        isKnown: (h) => Boolean(h?.hpi?.progression),
        text: {
          en: "Is the condition getting worse, getting better, or staying the same?",
          hi: "क्या यह समस्या बढ़ रही है, घट रही है या एक जैसी बनी हुई है?"
        },
        type: 'single_choice',
        options: {
          en: ["Getting progressively worse", "Staying about the same", "Getting better gradually"],
          hi: ["लगातार बढ़ रही है (Getting worse)", "लगभग एक जैसी है", "धीरे-धीरे सुधर रही है"]
        }
      },
      {
        field: 'associated_symptoms',
        isKnown: (h) => Boolean(h?.hpi?.associated_symptoms && h.hpi.associated_symptoms.length > 0),
        text: {
          en: "Are you having any other symptoms like fever, vomiting, dizziness, or breathing difficulty?",
          hi: "क्या इसके साथ बुखार, उल्टी, चक्कर या सांस फूलने जैसे कोई अन्य लक्षण भी हैं?"
        },
        type: 'single_choice',
        options: {
          en: ["Yes, fever or chills", "Yes, nausea or vomiting", "Yes, breathing difficulty", "No other symptoms"],
          hi: ["हाँ, बुखार या कंपकंपी", "हाँ, उल्टी या जी मिचलाना", "हाँ, सांस में परेशानी", "नहीं, कोई अन्य लक्षण नहीं"]
        }
      },
      {
        field: 'prior_episodes',
        isKnown: (h) => Boolean(h?.hpi?.prior_episodes !== undefined),
        text: {
          en: "Have you ever experienced this exact problem before?",
          hi: "क्या आपको पहले भी कभी ऐसी समस्या हुई है?"
        },
        type: 'yes_no',
        options: {
          en: ["Yes, have had this before in the past", "No, this is the very first time"],
          hi: ["हाँ, पहले भी ऐसा हुआ था", "नहीं, यह पहली बार हुआ है"]
        }
      }
    ]
  }
};

export default genericComplaintProtocol;
