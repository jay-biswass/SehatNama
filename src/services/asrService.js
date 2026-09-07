/**
 * ASR (Automated Speech Recognition) Provider Abstraction
 * 
 * Decouples speech recognition behind a provider interface.
 * Implements WebSpeechASRProvider (browser Web Speech API) as MVP fallback,
 * with clean extensibility for Bhashini, Whisper, or Google Cloud Speech.
 */

export class ASRProvider {
  isSupported() {
    return false;
  }
  start(_options) {
    throw new Error('start() must be implemented by provider');
  }
  stop() {
    throw new Error('stop() must be implemented by provider');
  }
}

/**
 * WebSpeechASRProvider
 * Utilizes standard browser SpeechRecognition / webkitSpeechRecognition.
 */
export class WebSpeechASRProvider extends ASRProvider {
  constructor() {
    super();
    this.recognition = null;
    this.isActive = false;
    const SpeechRecognitionClass = typeof window !== 'undefined' && 
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    this.SpeechRecognitionClass = SpeechRecognitionClass || null;
  }

  isSupported() {
    return Boolean(this.SpeechRecognitionClass);
  }

  start({ language = 'hi', onStart, onResult, onError, onEnd }) {
    if (!this.isSupported()) {
      if (onError) onError(new Error('Web Speech API is not supported in this browser.'));
      return;
    }

    if (this.isActive) {
      this.stop();
    }

    try {
      this.recognition = new this.SpeechRecognitionClass();
      
      // Map language code to BCP-47
      const langCode = (language === 'hi' || language === 'Hindi') ? 'hi-IN' : 'en-IN';
      this.recognition.lang = langCode;
      this.recognition.interimResults = true;
      this.recognition.continuous = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isActive = true;
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        if (onResult) {
          onResult({
            text: transcript.trim(),
            language: langCode,
            isFinal
          });
        }
      };

      this.recognition.onerror = (event) => {
        this.isActive = false;
        if (onError) onError(new Error(event.error || 'Speech recognition error'));
      };

      this.recognition.onend = () => {
        this.isActive = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      this.isActive = false;
      if (onError) onError(err);
    }
  }

  stop() {
    if (this.recognition && this.isActive) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('[WebSpeechASRProvider] Stop error:', err);
      }
    }
    this.isActive = false;
  }
}

/**
 * MockASRProvider for development testing or non-browser environments
 */
export class MockASRProvider extends ASRProvider {
  constructor() {
    super();
    this.timer = null;
  }

  isSupported() {
    return true;
  }

  start({ language = 'hi', onStart, onResult, onEnd }) {
    if (onStart) onStart();

    const sample = (language === 'hi' || language === 'Hindi')
      ? 'Mere seene mein kal se bahut dard ho raha hai'
      : 'I have severe chest pain since yesterday';

    this.timer = setTimeout(() => {
      if (onResult) {
        onResult({
          text: sample,
          language: language === 'hi' ? 'hi-IN' : 'en-IN',
          isFinal: true
        });
      }
      if (onEnd) onEnd();
    }, 2500);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

class ASRServiceManager {
  constructor() {
    this.webSpeechProvider = new WebSpeechASRProvider();
    this.mockProvider = new MockASRProvider();
    this.customProvider = null;
  }

  setCustomProvider(provider) {
    this.customProvider = provider;
  }

  getActiveProvider() {
    if (this.customProvider && this.customProvider.isSupported()) {
      return this.customProvider;
    }
    if (this.webSpeechProvider.isSupported()) {
      return this.webSpeechProvider;
    }
    return this.mockProvider;
  }

  isSupported() {
    return this.getActiveProvider().isSupported();
  }

  start(options) {
    const provider = this.getActiveProvider();
    return provider.start(options);
  }

  stop() {
    const provider = this.getActiveProvider();
    return provider.stop();
  }

  getProviderName() {
    const provider = this.getActiveProvider();
    if (provider instanceof WebSpeechASRProvider) return 'WebSpeechAPI';
    if (provider instanceof MockASRProvider) return 'MockASR';
    return 'CustomASR';
  }
}

export const asrService = new ASRServiceManager();
export default asrService;
