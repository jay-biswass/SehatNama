/**
 * Clinical Protocol Registry
 * 
 * Central registry of 46+ major OPD clinical history-taking protocols across 12 specialties,
 * plus a generic fallback protocol.
 * 
 * NOTE: These are strictly HISTORY-TAKING protocols, NOT disease diagnosis modules.
 * The system identifies the presenting complaint to choose the structured question sequence.
 */

import { cardiovascularProtocols } from './protocols/cardiovascular.js';
import { respiratoryProtocols } from './protocols/respiratory.js';
import { neurologicalProtocols } from './protocols/neurological.js';
import { gastrointestinalProtocols } from './protocols/gastrointestinal.js';
import { generalProtocols } from './protocols/general.js';
import { musculoskeletalProtocols } from './protocols/musculoskeletal.js';
import { genitourinaryProtocols } from './protocols/genitourinary.js';
import { entProtocols } from './protocols/ent.js';
import { eyeProtocols } from './protocols/eye.js';
import { skinProtocols } from './protocols/skin.js';
import { womensHealthProtocols } from './protocols/womensHealth.js';
import { mentalWellbeingProtocols } from './protocols/mentalWellbeing.js';
import { genericComplaintProtocol } from './protocols/genericComplaint.js';

export const ALL_PROTOCOLS = {
  ...cardiovascularProtocols,
  ...respiratoryProtocols,
  ...neurologicalProtocols,
  ...gastrointestinalProtocols,
  ...generalProtocols,
  ...musculoskeletalProtocols,
  ...genitourinaryProtocols,
  ...entProtocols,
  ...eyeProtocols,
  ...skinProtocols,
  ...womensHealthProtocols,
  ...mentalWellbeingProtocols,
  ...genericComplaintProtocol
};

/**
 * Universal initial Chief Complaint question when presenting complaint is unknown.
 */
export const CHIEF_COMPLAINT_QUESTION = {
  field: 'chief_complaint',
  isKnown: (history) => Boolean(history?.chief_complaint),
  text: {
    en: "What health concern brings you here today?",
    hi: "आज आप किस स्वास्थ्य समस्या के लिए आए हैं?"
  },
  type: 'text',
  options: {
    en: ["Chest pain", "Fever", "Headache", "Cough / Breathing", "Stomach pain", "Back / Joint pain", "Other issue"],
    hi: ["सीने में दर्द (Chest pain)", "बुखार (Fever)", "सिरदर्द (Headache)", "खांसी या सांस फूलना", "पेट में दर्द", "कमर या जोड़ों में दर्द", "अन्य समस्या"]
  }
};

/**
 * Normalizes input text for keyword searching
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Matches a user text or complaint ID to the most relevant protocol.
 * Falls back safely to 'generic_complaint' if no specific match is found.
 * 
 * @param {string} textOrId - Complaint text, user statement, or protocol ID
 * @param {string} language - 'en' or 'hi'
 * @returns {Object} Protocol object
 */
export function matchProtocol(textOrId, language = 'hi') {
  if (!textOrId) {
    return ALL_PROTOCOLS.generic_complaint;
  }

  // 1. Exact ID match
  if (ALL_PROTOCOLS[textOrId]) {
    return ALL_PROTOCOLS[textOrId];
  }

  const clean = normalizeText(textOrId);

  // 2. Exact keyword or phrase match
  for (const [id, protocol] of Object.entries(ALL_PROTOCOLS)) {
    if (id === 'generic_complaint') continue;
    
    // Check keywords
    if (Array.isArray(protocol.keywords)) {
      for (const kw of protocol.keywords) {
        const cleanKw = normalizeText(kw);
        if (clean === cleanKw || clean.includes(cleanKw) || cleanKw.includes(clean)) {
          return protocol;
        }
      }
    }

    // Check title in en and hi
    if (protocol.title) {
      if (protocol.title.en && clean.includes(normalizeText(protocol.title.en))) {
        return protocol;
      }
      if (protocol.title.hi && clean.includes(normalizeText(protocol.title.hi))) {
        return protocol;
      }
    }
  }

  // 3. Regex / Fuzzy heuristic matching for common Hindi/English clinical expressions
  const patterns = [
    // Cardiovascular
    { re: /(seene|chest|chhati|heart|seena).*?(dard|pain|pressure|heavy|jalan)/i, id: 'chest_pain' },
    { re: /(dhadkan|palpitation|flutter|heart racing|dil tez)/i, id: 'palpitations' },
    { re: /(pair|leg|feet|ankle|edema).*?(sujan|swelling|soojan)/i, id: 'leg_swelling' },

    // Respiratory
    { re: /(saans|sans|breath|dyspnea|dum phoolna|saans lene mein)/i, id: 'breathlessness' },
    { re: /(khansi|khansi|cough|balgam|sputum|phlegm)/i, id: 'cough' },
    { re: /(wheez|seeti|say-say|saaye saaye)/i, id: 'wheezing' },
    { re: /(gala|throat).*?(kharash|dard|sore|chhil)/i, id: 'sore_throat' },

    // Neurological
    { re: /(sir|sar|head).*?(dard|pain|ache|bhaari)/i, id: 'headache' },
    { re: /(chakkar|dizziness|giddiness|vertigo|chakar)/i, id: 'dizziness' },
    { re: /(behosh|faint|syncope|chitt)/i, id: 'fainting' },
    { re: /(kamzori|weakness|lakwa|paralysis|kamzor)/i, id: 'weakness' },
    { re: /(sunn|numb|tingling|jhunjhuni|chin-chin)/i, id: 'numbness_tingling' },

    // Gastrointestinal
    { re: /(pet|stomach|abdom|belly).*?(dard|pain|marod|cramp)/i, id: 'abdominal_pain' },
    { re: /(ulti|vomit|nausea|mitli|jeemichlana|kai)/i, id: 'nausea_vomiting' },
    { re: /(dast|diarrhea|loose motion|loose stool|pet kharab)/i, id: 'diarrhea' },
    { re: /(kabz|constipation|pet saaf nahi)/i, id: 'constipation' },
    { re: /(bhookh|appetite).*?(kam|loss|nahi lagti)/i, id: 'loss_of_appetite' },

    // General
    { re: /(bukhar|fever|tap|hararat|garam badan)/i, id: 'fever' },
    { re: /(thakan|fatigue|tired|sust|exhausted)/i, id: 'fatigue' },
    { re: /(vajan|weight).*?(kam|ghat|loss)/i, id: 'weight_loss' },

    // Musculoskeletal
    { re: /(kamar|peeth|back|spine|sciatica).*?(dard|pain)/i, id: 'back_pain' },
    { re: /(ghutn|joint|jod|knee|arthritis).*?(dard|pain|sujan)/i, id: 'joint_pain' },
    { re: /(haath|pair|leg|arm|limb).*?(dard|pain)/i, id: 'limb_pain' },

    // Genitourinary
    { re: /(peshab|urine).*?(jalan|dard|burn|pain|infection|uti)/i, id: 'painful_urination' },
    { re: /(peshab|urine).*?(bar bar|frequent|frequency|nocturia)/i, id: 'increased_urination' },
    { re: /(peshab|urine).*?(khoon|blood|lal|red)/i, id: 'blood_in_urine' },
    { re: /(peshab|urine).*?(ruk|atak|retention|band)/i, id: 'difficulty_urinating' },

    // ENT
    { re: /(kaan|ear).*?(dard|pain|discharge|behna)/i, id: 'ear_pain' },
    { re: /(kaan|hearing).*?(sunna|loss|tinnitus|seeti)/i, id: 'hearing_difficulty' },
    { re: /(naak|nose|nasal|sinus).*?(band|beh|runny|cold|zukam)/i, id: 'nasal_congestion' },

    // Eye
    { re: /(aankh|eye).*?(roshni|blind|vision loss|andhera)/i, id: 'sudden_vision_loss' },
    { re: /(aankh|eye).*?(dard|pain)/i, id: 'eye_pain' },
    { re: /(aankh|eye).*?(lal|red|pink eye|conjunctivitis)/i, id: 'red_eye' },
    { re: /(aankh|vision|eye).*?(dhundhla|blur|kamzor)/i, id: 'blurred_vision' },

    // Skin
    { re: /(chakatt|rash|allergy|erythema|spots)/i, id: 'rash' },
    { re: /(khujli|itch|itching|pruritus)/i, id: 'itching' },
    { re: /(pitti|hives|urticaria|angioedema|skin.*sujan)/i, id: 'skin_swelling' },
    { re: /(ghaav|wound|ulcer|lesion|phoda)/i, id: 'skin_lesion' },

    // Women's Health
    { re: /(period|mahavari|menstru|cycle|bleeding).*?(dard|pain|heavy|aniyamit)/i, id: 'menstrual_problems' },
    { re: /(pedu|pelvic).*?(dard|pain)/i, id: 'pelvic_pain' },
    { re: /(bleeding|spotting).*?(menopause|between)/i, id: 'abnormal_vaginal_bleeding' },
    { re: /(garbh|pregnant|pregnancy|morning sickness)/i, id: 'pregnancy_symptoms' },

    // Mental Wellbeing
    { re: /(neend|sleep|insomnia).*?(nahi|problem|poor)/i, id: 'sleep_problems' },
    { re: /(ghabrahat|anxiety|bechaini|panic|nervous)/i, id: 'anxiety_symptoms' },
    { re: /(udaas|depress|sad|rone ka man|man nahi lagta)/i, id: 'low_mood' }
  ];

  for (const item of patterns) {
    if (item.re.test(clean)) {
      return ALL_PROTOCOLS[item.id] || ALL_PROTOCOLS.generic_complaint;
    }
  }

  // Fallback to generic protocol
  return ALL_PROTOCOLS.generic_complaint;
}

/**
 * Returns protocol definition by ID
 */
export function getProtocol(protocolId) {
  return ALL_PROTOCOLS[protocolId] || ALL_PROTOCOLS.generic_complaint;
}

/**
 * Returns list of all supported protocols with metadata
 */
export function getAllProtocols() {
  return Object.values(ALL_PROTOCOLS);
}

export default {
  ALL_PROTOCOLS,
  CHIEF_COMPLAINT_QUESTION,
  matchProtocol,
  getProtocol,
  getAllProtocols
};
