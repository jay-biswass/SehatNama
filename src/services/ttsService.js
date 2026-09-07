/**
 * Text-to-Speech (TTS) Service
 * 
 * Provides voice-first audio delivery for all assistant messages:
 * - Welcome greeting
 * - Clinical questions
 * - Clarifications
 * - Question repetition
 * - Red-flag safety warnings
 * - Completion messages
 * 
 * Leverages browser Web Speech Synthesis API with Hindi (hi-IN) and English (en-IN)
 * voice matching, fallback handlers, and mute/repeat state management.
 */

class TTSService {
  constructor() {
    this.isMutedState = false;
    this.isSpeakingState = false;
    this.lastSpokenText = '';
    this.lastSpokenOptions = {};
    this.voicesLoaded = false;
    this.voices = [];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  isMuted() {
    return this.isMutedState;
  }

  setMuted(muted) {
    this.isMutedState = Boolean(muted);
    if (this.isMutedState) {
      this.stop();
    }
  }

  toggleMute() {
    this.setMuted(!this.isMutedState);
    return this.isMutedState;
  }

  isSpeaking() {
    return this.isSpeakingState;
  }

  /**
   * Speaks the provided text aloud.
   * 
   * @param {string} text - Message to speak
   * @param {Object} options - { language: 'hi' | 'en', rate, pitch, onStart, onEnd, onError }
   */
  speak(text, options = {}) {
    const cleanText = (text || '').trim();
    if (!cleanText) return;

    this.lastSpokenText = cleanText;
    this.lastSpokenOptions = { ...options };

    if (!this.isSupported() || this.isMutedState) {
      if (options.onStart) options.onStart();
      if (options.onEnd) options.onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const lang = (options.language === 'hi' || options.language === 'Hindi') ? 'hi-IN' : 'en-IN';
      utterance.lang = lang;
      utterance.rate = options.rate || 0.95; // Slightly measured rate for clear clinical audio
      utterance.pitch = options.pitch || 1.0;

      // Match voice if available
      const voice = this.getBestVoice(lang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeakingState = false;
        // Interrupted is normal when user navigates or stops early
        if (e.error !== 'interrupted' && options.onError) {
          options.onError(e);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[TTSService] Speech synthesis exception:', err);
      this.isSpeakingState = false;
      if (options.onError) options.onError(err);
    }
  }

  /**
   * Repeats the most recently spoken question or message
   */
  repeat() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, this.lastSpokenOptions);
    }
  }

  stop() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('[TTSService] Stop error:', err);
      }
    }
    this.isSpeakingState = false;
  }

  pause() {
    if (this.isSupported()) {
      window.speechSynthesis.pause();
    }
  }

  resume() {
    if (this.isSupported()) {
      window.speechSynthesis.resume();
    }
  }

  getBestVoice(langCode) {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    const matching = this.voices.filter(v => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
    if (matching.length > 0) {
      // Prioritize natural or local service voices
      const googleOrNatural = matching.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.localService);
      return googleOrNatural || matching[0];
    }
    return null;
  }
}

export const ttsService = new TTSService();
export default ttsService;
