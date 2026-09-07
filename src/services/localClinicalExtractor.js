/**
 * Client-Safe Deterministic Clinical NLP Extractor
 * 
 * High-precision, zero-dependency clinical entity extractor for Hindi, Hinglish, and English.
 * Pure JavaScript with zero reliance on Node.js globals (such as `process`).
 * Strictly safe to bundle in the browser client.
 * 
 * Supports all 46+ presenting complaints across 12 OPD clinical specialties.
 */

/**
 * Universal affirmative / negative classifier supporting Hindi (Devanagari & Romanized)
 * and English for clinical yes/no questions.
 * 
 * @param {string} text - User answer
 * @returns {boolean|null} true for YES, false for NO, null if unclassified
 */
export function parseYesNoAnswer(text) {
  if (!text || typeof text !== 'string') return null;
  const clean = text.trim().toLowerCase();

  // Negative checks (explicitly test Hindi and English negative words/phrases)
  const noPattern = /^(no|nahi|nahin|na|nope|not|nah|bina|without|नहीं|ना|न)\b|^(नहीं|ना|न)|(नहीं|nahi|nahin|no difficulty|no pain|no fever|no sweating|none|kahi nahi|koi nahi|saans theek|saans bilkul theek|normal)/i;
  if (noPattern.test(clean)) {
    return false;
  }

  // Positive checks (explicitly test Hindi and English positive words/phrases)
  const yesPattern = /^(yes|haan|han|hann|ha|haa|yup|yeah|sure|हाँ|हां)\b|^(हाँ|हां)|(हाँ|हां|having difficulty|yes,|haan hai|ha hai|saans mein pareshani|pareshani hai|dard hai|takleef hai)/i;
  if (yesPattern.test(clean)) {
    return true;
  }

  return null;
}

export function localExtractClinicalInfo(input, context = {}) {
  const text = (input || '').trim();
  const lower = text.toLowerCase();

  const extracted = {
    chief_complaint: null,
    hpi: {
      onset: null,
      duration: null,
      site: null,
      character: null,
      radiation: null,
      severity: null,
      timing: null,
      aggravating_factors: [],
      relieving_factors: [],
      associated_symptoms: []
    },
    past_medical_history: [],
    medications: [],
    allergies: [],
    uncertainty_flag: false,
    negated_symptoms: [],
    symptom_status: {},
    answered_questions: [],
    answered_field: null
  };

  // 1. Uncertainty Flag
  if (/\b(shayad|pata nahi|lagta hai|maybe|perhaps|not sure|uncertain|dont know|don't know)\b/i.test(lower)) {
    extracted.uncertainty_flag = true;
  }

  // Helper for negation check within free text
  const isNegated = (keyword) => {
    const regex = new RegExp(`(no|nahi|nahin|not|koi nahi|bina|without|nahi hai|na|नहीं|ना|न)\\s+([\\w\\s]{0,15})?${keyword}|${keyword}\\s+([\\w\\s]{0,15})?(nahi|nahin|no|not|nahi hai|na|नहीं|ना|न)`, 'i');
    return regex.test(lower) || (lower.includes('नहीं') && lower.includes(keyword));
  };

  // -------------------------------------------------------------
  // 2. CONTEXTUAL DIRECT FIELD PROCESSING (If currentField is known)
  // -------------------------------------------------------------
  const activeField = context.currentField;

  if (activeField) {
    extracted.answered_questions.push(activeField);
    extracted.answered_field = activeField;

    // A. Breathing / Dyspnea question
    if (activeField === 'breathing' || activeField === 'dyspnea') {
      const breathingYesNo = parseYesNoAnswer(text);
      if (breathingYesNo === true) {
        extracted.symptom_status.dyspnea = 'YES';
        extracted.symptom_status.breathing = 'YES';
        if (!extracted.hpi.associated_symptoms.includes('breathing difficulty')) {
          extracted.hpi.associated_symptoms.push('breathing difficulty');
        }
        extracted.answered_questions.push('dyspnea', 'breathing');
      } else if (breathingYesNo === false) {
        extracted.symptom_status.dyspnea = 'NO';
        extracted.symptom_status.breathing = 'NO';
        if (!extracted.negated_symptoms.includes('breathing difficulty')) {
          extracted.negated_symptoms.push('breathing difficulty');
        }
        extracted.answered_questions.push('dyspnea', 'breathing');
      }
    }

    // B. Sweating question
    if (activeField === 'sweating') {
      const sweatYesNo = parseYesNoAnswer(text);
      if (sweatYesNo === true) {
        extracted.symptom_status.sweating = 'YES';
        if (!extracted.hpi.associated_symptoms.includes('sweating')) {
          extracted.hpi.associated_symptoms.push('sweating');
        }
        extracted.answered_questions.push('sweating');
      } else if (sweatYesNo === false) {
        extracted.symptom_status.sweating = 'NO';
        if (!extracted.negated_symptoms.includes('sweating')) {
          extracted.negated_symptoms.push('sweating');
        }
        extracted.answered_questions.push('sweating');
      }
    }

    // C. Onset question
    if (activeField === 'onset') {
      if (/achanak|sudden|अचानक/i.test(lower)) {
        extracted.hpi.onset = 'sudden';
      } else if (/dheere|gradual|slowly|धीरे/i.test(lower)) {
        extracted.hpi.onset = 'gradual';
      } else if (text.trim()) {
        extracted.hpi.onset = text.trim();
      }
      extracted.answered_questions.push('onset');
    }

    // D. Severity question
    if (activeField === 'severity') {
      const numMatch = lower.match(/\b(10|[0-9])\b/);
      if (numMatch) {
        extracted.hpi.severity = parseInt(numMatch[1], 10);
      } else if (/mild|halka|2/i.test(lower)) {
        extracted.hpi.severity = 2;
      } else if (/moderate|madhyam|5/i.test(lower)) {
        extracted.hpi.severity = 5;
      } else if (/severe|tez|unbearable|bahut tez|8/i.test(lower)) {
        extracted.hpi.severity = 8;
      }
      extracted.answered_questions.push('severity');
    }

    // E. Duration question
    if (activeField === 'duration') {
      if (/abhi|just now/i.test(lower)) extracted.hpi.duration = 'just now';
      else if (/kal raat|last night/i.test(lower)) extracted.hpi.duration = 'since last night';
      else if (/kal se|yesterday|1 day/i.test(lower)) extracted.hpi.duration = '1 day';
      else if (/2-3|din|days/i.test(lower)) {
        const m = lower.match(/(\d+)\s*(din|days|day)/i);
        extracted.hpi.duration = m ? `${m[1]} days` : '2-3 days';
      } else if (/hafte|week/i.test(lower)) extracted.hpi.duration = '1 week';
      else if (/ghante|hour/i.test(lower)) extracted.hpi.duration = 'few hours';
      else if (text.trim()) extracted.hpi.duration = text.trim();
      extracted.answered_questions.push('duration');
    }

    // F. Site question
    if (activeField === 'site') {
      if (/beech|center|middle|central/i.test(lower)) extracted.hpi.site = 'center of chest';
      else if (/left|baayein|bayen/i.test(lower)) extracted.hpi.site = 'left chest';
      else if (/right|daayein|dayen/i.test(lower)) extracted.hpi.site = 'right chest';
      else if (/poore|whole|entire/i.test(lower)) extracted.hpi.site = 'whole chest';
      else if (text.trim()) extracted.hpi.site = text.trim();
      extracted.answered_questions.push('site');
    }

    // G. Radiation question
    if (activeField === 'radiation') {
      const isNone = parseYesNoAnswer(text) === false || /none|kahi nahi|does not spread|kahi nahi failta|spread nahi/i.test(lower);
      if (isNone) {
        extracted.hpi.radiation = 'none';
      } else if (/left arm|baayein haath|bayen hath|left hath/i.test(lower)) {
        extracted.hpi.radiation = 'left arm';
      } else if (/jaw|neck|gardan|jabda/i.test(lower)) {
        extracted.hpi.radiation = 'jaw/neck';
      } else if (/back|peeth/i.test(lower)) {
        extracted.hpi.radiation = 'back';
      } else if (text.trim()) {
        extracted.hpi.radiation = text.trim();
      }
      extracted.answered_questions.push('radiation');
    }

    // H. Character question
    if (activeField === 'character') {
      if (/pressure|tightness|jakdan|dabav|dabaav/i.test(lower)) extracted.hpi.character = 'pressure or tightness';
      else if (/sharp|tez chubh|chubhan/i.test(lower)) extracted.hpi.character = 'sharp';
      else if (/burning|jalan/i.test(lower)) extracted.hpi.character = 'burning';
      else if (/heavy|bhari|dull/i.test(lower)) extracted.hpi.character = 'heavy dull ache';
      else if (text.trim()) extracted.hpi.character = text.trim();
      extracted.answered_questions.push('character');
    }

    // I. Other yes/no symptoms
    if (!['breathing', 'dyspnea', 'sweating', 'onset', 'severity', 'duration', 'site', 'radiation', 'character', 'chief_complaint'].includes(activeField)) {
      const yn = parseYesNoAnswer(text);
      if (yn === true) {
        extracted.symptom_status[activeField] = 'YES';
        const cleanName = activeField.replace(/_/g, ' ');
        if (!extracted.hpi.associated_symptoms.includes(cleanName)) {
          extracted.hpi.associated_symptoms.push(cleanName);
        }
      } else if (yn === false) {
        extracted.symptom_status[activeField] = 'NO';
        const cleanName = activeField.replace(/_/g, ' ');
        if (!extracted.negated_symptoms.includes(cleanName)) {
          extracted.negated_symptoms.push(cleanName);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // 3. CHIEF COMPLAINT DETECTION (Deterministic, Multilingual)
  // -------------------------------------------------------------
  const complaintRules = [
    // Women's Health & Pregnancy
    { id: 'pregnancy_symptoms', canonical: 'pregnancy symptoms', regex: /(garbh|pregnant|pregnancy|morning sickness)/i, negTerms: ['pregnancy', 'pregnant', 'garbh'] },
    { id: 'abnormal_vaginal_bleeding', canonical: 'abnormal vaginal bleeding', regex: /(bleeding|spotting).*?(menopause|between)/i, negTerms: ['bleeding', 'spotting'] },
    { id: 'pelvic_pain', canonical: 'pelvic pain', regex: /(pedu|pelvic).*?(dard|pain)/i, negTerms: ['pedu dard', 'pelvic pain'] },
    { id: 'menstrual_problems', canonical: 'menstrual problems', regex: /(period|mahavari|menstru|cycle|bleeding).*?(dard|pain|heavy|anlyamit)/i, negTerms: ['period pain', 'mahavari'] },

    // Eye Emergency & Eye
    { id: 'sudden_vision_loss', canonical: 'sudden vision loss', regex: /(aankh|eye|vision).*?(roshni chali gayi|blind|vision loss|andhera)/i, negTerms: ['vision loss', 'blindness'] },
    { id: 'eye_pain', canonical: 'eye pain', regex: /(aankh|eye).*?(dard|pain)/i, negTerms: ['eye pain', 'aankh dard'] },
    { id: 'red_eye', canonical: 'red eye', regex: /(aankh|eye).*?(lal|red|pink eye|conjunctivitis)/i, negTerms: ['red eye', 'aankh lal'] },
    { id: 'blurred_vision', canonical: 'blurred vision', regex: /(aankh|vision|eye).*?(dhundhla|blur|kamzor)/i, negTerms: ['blurred vision'] },

    // Cardiovascular
    { id: 'chest_pain', canonical: 'chest pain', regex: /(seene|chhati|chest|seena).*?(dard|pain|pressure|heavy|jalan|jakdan)|(heart|angina).*?(pain|attack|dard)/i, negTerms: ['chest pain', 'seene mein dard', 'dard', 'pain'] },
    { id: 'palpitations', canonical: 'palpitations', regex: /(dhadkan|palpitation|flutter|heart racing|dil tez|tez dhadak)/i, negTerms: ['palpitations', 'dhadkan'] },
    { id: 'leg_swelling', canonical: 'leg swelling', regex: /(pair|leg|feet|ankle|edema).*?(sujan|swelling|soojan)/i, negTerms: ['leg swelling', 'pairon mein sujan'] },

    // Respiratory
    { id: 'breathlessness', canonical: 'breathing difficulty', regex: /(saans|sans|breath|dyspnea|dum phoolna|saans lene mein takleef)/i, negTerms: ['saans', 'breathing', 'breath'] },
    { id: 'cough', canonical: 'cough', regex: /(khansi|khaansi|cough|balgam|sputum|phlegm)/i, negTerms: ['khansi', 'cough'] },
    { id: 'wheezing', canonical: 'wheezing', regex: /(wheez|seeti|say-say|saaye saaye|wheezing)/i, negTerms: ['wheezing', 'seeti'] },
    { id: 'sore_throat', canonical: 'sore throat', regex: /(gala|throat).*?(kharash|dard|sore|chhil)/i, negTerms: ['gala dard', 'sore throat'] },

    // Neurological
    { id: 'headache', canonical: 'headache', regex: /(sir|sar|head).*?(dard|pain|ache|bhaari)/i, negTerms: ['sir dard', 'sar dard', 'headache'] },
    { id: 'dizziness', canonical: 'dizziness', regex: /(chakkar|dizziness|giddiness|vertigo|chakar)/i, negTerms: ['chakkar', 'dizziness'] },
    { id: 'fainting', canonical: 'fainting', regex: /(behosh|faint|syncope|chitt|blackout)/i, negTerms: ['fainting', 'behoshi'] },
    { id: 'numbness_tingling', canonical: 'numbness', regex: /(sunn|numb|tingling|jhunjhuni|chin-chin)/i, negTerms: ['numbness', 'sunn'] },
    { id: 'weakness', canonical: 'weakness', regex: /(lakwa|paralysis|ek taraf kamzori|one side weakness)/i, negTerms: ['weakness', 'kamzori', 'lakwa'] },

    // Gastrointestinal
    { id: 'abdominal_pain', canonical: 'abdominal pain', regex: /(pet|stomach|abdom|belly).*?(dard|pain|marod|cramp)/i, negTerms: ['pet dard', 'stomach pain', 'abdominal pain'] },
    { id: 'nausea_vomiting', canonical: 'nausea and vomiting', regex: /(ulti|vomit|nausea|mitli|jeemichlana|kai)/i, negTerms: ['ulti', 'vomiting', 'nausea'] },
    { id: 'diarrhea', canonical: 'diarrhea', regex: /(dast|diarrhea|loose motion|loose stool|pet kharab)/i, negTerms: ['dast', 'diarrhea', 'loose motion'] },
    { id: 'constipation', canonical: 'constipation', regex: /(kabz|constipation|pet saaf nahi)/i, negTerms: ['kabz', 'constipation'] },
    { id: 'loss_of_appetite', canonical: 'loss of appetite', regex: /(bhookh|appetite).*?(kam|loss|nahi lagti)/i, negTerms: ['bhookh', 'appetite'] },

    // General
    { id: 'fever', canonical: 'fever', regex: /(bukhar|fever|tap|hararat|garam badan)/i, negTerms: ['bukhar', 'fever'] },
    { id: 'fatigue', canonical: 'fatigue', regex: /(thakan|fatigue|tired|sust|exhausted)/i, negTerms: ['thakan', 'fatigue'] },
    { id: 'weight_loss', canonical: 'weight loss', regex: /(vajan|weight).*?(kam|ghat|loss)/i, negTerms: ['weight loss', 'vajan kam'] },

    // Musculoskeletal
    { id: 'back_pain', canonical: 'back pain', regex: /(kamar|peeth|back|spine|sciatica).*?(dard|pain)/i, negTerms: ['kamar dard', 'back pain'] },
    { id: 'joint_pain', canonical: 'joint pain', regex: /(ghutn|joint|jod|knee|arthritis).*?(dard|pain|sujan)/i, negTerms: ['joint pain', 'ghutne dard'] },
    { id: 'limb_pain', canonical: 'limb pain', regex: /(haath|pair|leg|arm|limb).*?(dard|pain)/i, negTerms: ['limb pain'] },

    // Genitourinary
    { id: 'painful_urination', canonical: 'painful urination', regex: /(peshab|urine).*?(jalan|dard|burn|pain|infection|uti)/i, negTerms: ['peshab mein jalan', 'dysuria'] },
    { id: 'increased_urination', canonical: 'increased urination', regex: /(peshab|urine).*?(bar bar|frequent|frequency|nocturia)/i, negTerms: ['increased urination'] },
    { id: 'blood_in_urine', canonical: 'blood in urine', regex: /(peshab|urine).*?(khoon|blood|lal|red)/i, negTerms: ['blood in urine'] },
    { id: 'difficulty_urinating', canonical: 'urinary retention', regex: /(peshab|urine).*?(ruk|atak|retention|band)/i, negTerms: ['retention'] },

    // ENT
    { id: 'ear_pain', canonical: 'ear pain', regex: /(kaan|ear).*?(dard|pain|discharge|behna)/i, negTerms: ['kaan dard', 'ear pain'] },
    { id: 'hearing_difficulty', canonical: 'hearing difficulty', regex: /(kaan|hearing).*?(sunna|loss|tinnitus|seeti)/i, negTerms: ['hearing loss'] },
    { id: 'nasal_congestion', canonical: 'nasal congestion', regex: /(naak|nose|nasal|sinus).*?(band|beh|runny|cold|zukam)/i, negTerms: ['cold', 'zukam'] },

    // Skin
    { id: 'rash', canonical: 'rash', regex: /(chakatt|rash|erythema|spots)/i, negTerms: ['rash'] },
    { id: 'itching', canonical: 'itching', regex: /(khujli|itch|itching|pruritus)/i, negTerms: ['khujli', 'itching'] },
    { id: 'skin_swelling', canonical: 'skin swelling', regex: /(pitti|hives|urticaria|angioedema)/i, negTerms: ['hives'] },
    { id: 'skin_lesion', canonical: 'skin lesion', regex: /(ghaav|wound|ulcer|lesion|phoda)/i, negTerms: ['wound'] },

    // Mental Wellbeing
    { id: 'sleep_problems', canonical: 'sleep problems', regex: /(neend|sleep|insomnia).*?(nahi|problem|poor)/i, negTerms: ['sleep problem'] },
    { id: 'anxiety_symptoms', canonical: 'anxiety', regex: /(ghabrahat|anxiety|bechaini|panic|nervous)/i, negTerms: ['anxiety'] },
    { id: 'low_mood', canonical: 'low mood', regex: /(udaas|depress|sad|rone ka man|man nahi lagta)/i, negTerms: ['depression'] }
  ];

  for (const rule of complaintRules) {
    if (rule.regex.test(lower)) {
      let negated = false;
      for (const term of rule.negTerms) {
        if (isNegated(term)) {
          negated = true;
          const canonical = rule.canonical || rule.id.replace(/_/g, ' ');
          if (!extracted.negated_symptoms.includes(canonical)) {
            extracted.negated_symptoms.push(canonical);
          }
          if (!extracted.negated_symptoms.includes(term)) {
            extracted.negated_symptoms.push(term);
          }
          break;
        }
      }
      if (!negated) {
        extracted.chief_complaint = rule.id;
        extracted.answered_questions.push('chief_complaint');
        break;
      }
    }
  }

  // Explicit check for chest pain / fever negation
  if (isNegated('chest') || isNegated('seene') || isNegated('seena') || isNegated('seene mein dard') || isNegated('chest pain')) {
    if (!extracted.negated_symptoms.includes('chest pain')) {
      extracted.negated_symptoms.push('chest pain');
    }
  }
  if (isNegated('bukhar') || isNegated('fever') || isNegated('tap')) {
    if (!extracted.negated_symptoms.includes('fever')) {
      extracted.negated_symptoms.push('fever');
    }
  }

  // Fallback check if current field being asked is chief_complaint and user gave direct words
  if (!extracted.chief_complaint && activeField === 'chief_complaint') {
    extracted.chief_complaint = text;
    extracted.answered_questions.push('chief_complaint');
  }

  // -------------------------------------------------------------
  // 4. FREE TEXT ENTITY RECOGNITION (Site, Duration, Onset, etc.)
  // -------------------------------------------------------------
  // Site
  if (!extracted.hpi.site) {
    if (/center|middle|beech|centre/i.test(lower)) {
      extracted.hpi.site = 'center';
    } else if (/left side|left chest|baayein|bayen|left/i.test(lower) && !lower.includes('arm') && !lower.includes('haath')) {
      extracted.hpi.site = 'left side';
    } else if (/right side|right chest|daayein|dayen/i.test(lower) && !lower.includes('arm') && !lower.includes('haath')) {
      extracted.hpi.site = 'right side';
    } else if (/kamar|lower back/i.test(lower)) {
      extracted.hpi.site = 'lower back';
    } else if (/ghutn|knee/i.test(lower)) {
      extracted.hpi.site = 'knee';
    } else if (/sir|head/i.test(lower)) {
      extracted.hpi.site = 'head';
    } else if (/pet|stomach|abdomen/i.test(lower)) {
      extracted.hpi.site = 'abdomen';
    }
  }

  // Duration
  if (!extracted.hpi.duration) {
    if (/kal raat|last night/i.test(lower)) {
      extracted.hpi.duration = 'since last night';
    } else if (/kal se|yesterday|since yesterday/i.test(lower)) {
      extracted.hpi.duration = '1 day';
    } else if (/aaj se|aaj subah|this morning|today|since morning/i.test(lower)) {
      extracted.hpi.duration = 'today';
    } else if (/(\d+)\s*(din|days|day)\s*(se|ago)?/i.test(lower)) {
      const match = lower.match(/(\d+)\s*(din|days|day)/i);
      if (match) extracted.hpi.duration = `${match[1]} days`;
    } else if (/(\d+)\s*(ghante|ghanta|hours|hour)\s*(se|ago)?/i.test(lower)) {
      const match = lower.match(/(\d+)\s*(ghante|ghanta|hours|hour)/i);
      if (match) extracted.hpi.duration = `${match[1]} hours`;
    } else if (/(\d+)\s*(hafte|hafta|weeks|week)\s*(se|ago)?/i.test(lower)) {
      const match = lower.match(/(\d+)\s*(hafte|hafta|weeks|week)/i);
      if (match) extracted.hpi.duration = `${match[1]} weeks`;
    } else if (/just now|abhi abhi|abhi shuru hua/i.test(lower)) {
      extracted.hpi.duration = 'just now';
    }
  }

  // Onset
  if (!extracted.hpi.onset) {
    if (/achanak|sudden|ekdam|suddenly|अचानक/i.test(lower)) {
      extracted.hpi.onset = 'sudden';
    } else if (/dheere|gradual|gradually|slowly|धीरे/i.test(lower)) {
      extracted.hpi.onset = 'gradual';
    }
  }

  // Severity (0 - 10)
  if (extracted.hpi.severity === null || extracted.hpi.severity === undefined) {
    const numberMatch = lower.match(/\b(10|[0-9])\b/);
    if (numberMatch && (activeField === 'severity' || /scale|severity|rate|score|dard/i.test(lower))) {
      extracted.hpi.severity = parseInt(numberMatch[1], 10);
    } else if (/\b(unbearable|bahut zyada|extreme|severe|bahut tez|bahut dard)\b/i.test(lower)) {
      if (activeField === 'severity' || /pain|dard/i.test(lower)) {
        extracted.hpi.severity = 8;
      }
    } else if (/\b(mild|halka|thoda)\b/i.test(lower)) {
      if (activeField === 'severity') {
        extracted.hpi.severity = 3;
      }
    } else if (/\b(moderate|madhyam|theek thak)\b/i.test(lower)) {
      if (activeField === 'severity') {
        extracted.hpi.severity = 5;
      }
    }
  }

  // Radiation
  if (!extracted.hpi.radiation) {
    const armNegated = isNegated('arm') || isNegated('haath') || isNegated('spread') || /spread nahi|kahi nahi|does not spread|nowhere/i.test(lower);
    if (armNegated) {
      extracted.hpi.radiation = 'none';
    } else if (/left arm|left haath|baayein haath|bayen hath|left hath/i.test(lower)) {
      extracted.hpi.radiation = 'left arm';
    } else if (/right arm|right haath|daayein haath|dayen hath/i.test(lower)) {
      extracted.hpi.radiation = 'right arm';
    } else if (/jaw|jabda|jabde/i.test(lower)) {
      extracted.hpi.radiation = 'jaw';
    } else if (/back|peeth|peedh/i.test(lower) && !lower.includes('kamar dard')) {
      extracted.hpi.radiation = 'back';
    } else if (/shoulder|kandha|kandhe/i.test(lower)) {
      extracted.hpi.radiation = 'shoulder';
    } else if (/neck|gardan/i.test(lower)) {
      extracted.hpi.radiation = 'neck';
    }
  }

  // Character
  if (!extracted.hpi.character) {
    if (/pressure|dabaav|dabav|tightness|jakdan|jakdan jaisa/i.test(lower)) {
      extracted.hpi.character = 'pressure or tightness';
    } else if (/sharp|tez chubh|chubhan/i.test(lower)) {
      extracted.hpi.character = 'sharp';
    } else if (/burning|jalan/i.test(lower)) {
      extracted.hpi.character = 'burning';
    } else if (/dull|bhari|heaviness|heavy/i.test(lower)) {
      extracted.hpi.character = 'heavy feeling';
    }
  }

  // Free text Breathing recognition (when activeField was not breathing)
  if (activeField !== 'breathing' && activeField !== 'dyspnea') {
    const dyspneaNegated = isNegated('saans') || isNegated('breath') || isNegated('breathing') || isNegated('सांस') || /no breath|saans lene mein koi dikkat nahi|सांस लेने में कोई परेशानी नहीं/i.test(lower);
    if (dyspneaNegated) {
      extracted.symptom_status.dyspnea = 'NO';
      extracted.symptom_status.breathing = 'NO';
      if (!extracted.negated_symptoms.includes('breathing difficulty')) {
        extracted.negated_symptoms.push('breathing difficulty');
      }
      extracted.answered_questions.push('dyspnea', 'breathing');
    } else if (/saans|सांस|breathing difficulty|shortness of breath|dyspnea|saans phool|saans lene me/i.test(lower)) {
      extracted.symptom_status.dyspnea = 'YES';
      extracted.symptom_status.breathing = 'YES';
      if (!extracted.hpi.associated_symptoms.includes('breathing difficulty')) {
        extracted.hpi.associated_symptoms.push('breathing difficulty');
      }
      extracted.answered_questions.push('dyspnea', 'breathing');
    }
  }

  // Free text Sweating recognition (when activeField was not sweating)
  if (activeField !== 'sweating') {
    const sweatNegated = isNegated('sweat') || isNegated('paseena') || isNegated('पसीना');
    if (sweatNegated) {
      extracted.symptom_status.sweating = 'NO';
      if (!extracted.negated_symptoms.includes('sweating')) {
        extracted.negated_symptoms.push('sweating');
      }
      extracted.answered_questions.push('sweating');
    } else if (/paseena|पसीना|sweat|sweating|cold sweat|diaphoresis/i.test(lower)) {
      extracted.symptom_status.sweating = 'YES';
      if (!extracted.hpi.associated_symptoms.includes('sweating')) {
        extracted.hpi.associated_symptoms.push('sweating');
      }
      extracted.answered_questions.push('sweating');
    }
  }

  // Nausea / Vomiting
  const nauseaNegated = isNegated('ulti') || isNegated('nausea') || isNegated('vomit');
  if (nauseaNegated) {
    extracted.negated_symptoms.push('nausea');
    extracted.symptom_status.nausea = 'NO';
  } else if (/ulti|nausea|vomiting|vomit/i.test(lower) && extracted.chief_complaint !== 'nausea_vomiting') {
    extracted.hpi.associated_symptoms.push('nausea');
    extracted.symptom_status.nausea = 'YES';
  }

  // Dizziness / Syncope
  const dizzinessNegated = isNegated('chakkar') || isNegated('dizziness') || isNegated('dizzy');
  if (dizzinessNegated) {
    extracted.negated_symptoms.push('dizziness');
    extracted.symptom_status.dizziness = 'NO';
  } else if (/chakkar|dizziness|dizzy|faint|behoshi|syncope/i.test(lower) && extracted.chief_complaint !== 'dizziness') {
    extracted.hpi.associated_symptoms.push('dizziness');
    extracted.symptom_status.dizziness = 'YES';
  }

  // Fever
  const feverNegated = isNegated('bukhar') || isNegated('fever') || isNegated('tap');
  if (feverNegated) {
    if (!extracted.negated_symptoms.includes('fever')) {
      extracted.negated_symptoms.push('fever');
    }
    extracted.symptom_status.fever = 'NO';
  } else if (/bukhar|fever|tap|hararat|chills|thand lagna/i.test(lower) && extracted.chief_complaint !== 'fever') {
    extracted.hpi.associated_symptoms.push('fever');
    extracted.symptom_status.fever = 'YES';
  }

  // Blood in urine / stool / vomit
  if (/peshab mein khoon|blood in urine|red urine/i.test(lower)) {
    extracted.hpi.associated_symptoms.push('blood in urine');
    extracted.symptom_status.blood_in_urine = 'YES';
  }
  if (/ulti mein khoon|blood in vomit|hematemesis/i.test(lower)) {
    extracted.hpi.associated_symptoms.push('vomiting blood');
    extracted.symptom_status.hematemesis = 'YES';
  }

  // -------------------------------------------------------------
  // 5. PAST MEDICAL HISTORY
  // -------------------------------------------------------------
  if (/bp|high blood pressure|hypertension|blood pressure/i.test(lower)) {
    extracted.past_medical_history.push('hypertension');
  }
  if (/sugar|diabetes|diabetic/i.test(lower)) {
    extracted.past_medical_history.push('diabetes');
  }
  if (/heart attack|pehle attack|heart surgery|bypass/i.test(lower)) {
    extracted.past_medical_history.push('previous heart condition');
  }

  // Clean empty scalar values, preserving array types
  if (!extracted.chief_complaint) delete extracted.chief_complaint;
  const scalarKeys = ['onset', 'duration', 'site', 'character', 'radiation', 'severity', 'timing'];
  scalarKeys.forEach(key => {
    if (extracted.hpi[key] === null || extracted.hpi[key] === undefined || extracted.hpi[key] === '') {
      delete extracted.hpi[key];
    }
  });

  return extracted;
}

export default localExtractClinicalInfo;
