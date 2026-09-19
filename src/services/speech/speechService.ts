/**
 * Unified Voice & Speech Architecture for MEDI
 * Integrates:
 * 1. "Hey MEDI" Wake Word Detection (Continuous / Simulated / Edge extensible)
 * 2. Speech-to-Text (STT) with active "Listening…" transcript streaming
 * 3. Text-to-Speech (TTS) with expressive companion cadence
 * 4. Acoustic companion audio feedback (two-tone wake chime)
 */

import {
  IWakeWordDetector,
  ISpeechRecognitionEngine,
  SpeechTranscriptEvent,
  WakeWordDetectionEvent,
} from "./types";
import { WakeWordDetector, wakeWordDetector } from "./wakeWordDetector";
import { playWakeChime, playListeningDoneChime } from "./wakeChime";

export interface VoiceServiceCallbacks {
  onListeningStart?: () => void;
  onListeningEnd?: () => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onWakeWord?: (event: WakeWordDetectionEvent) => void;
  onError?: (error: string) => void;
}

class SpeechRecognitionEngine implements ISpeechRecognitionEngine {
  private recognition: any = null;
  private _isListening = false;
  private currentLanguage = "en-US";

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;
      }
    }
  }

  public get isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public get isListening(): boolean {
    return this._isListening;
  }

  public setLanguage(langCode: string) {
    this.currentLanguage = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  public start(
    onTranscript: (event: SpeechTranscriptEvent) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): boolean {
    if (!this.recognition) return false;

    try {
      this.recognition.onstart = () => {
        this._isListening = true;
        onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onTranscript({ text: finalTranscript, isFinal: true });
        } else if (interimTranscript) {
          onTranscript({ text: interimTranscript, isFinal: false });
        }
      };

      this.recognition.onerror = (event: any) => {
        this._isListening = false;
        onError?.(event.error);
      };

      this.recognition.onend = () => {
        this._isListening = false;
        onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn("Speech recognition failed to start:", err);
      return false;
    }
  }

  public stop() {
    if (this.recognition && this._isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  public abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
    }
  }
}

export class VoiceService {
  private wakeDetector: IWakeWordDetector;
  private sttEngine: ISpeechRecognitionEngine;
  private synth: SpeechSynthesis | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private callbacks: VoiceServiceCallbacks = {};
  private _isListening = false;
  private _isSpeaking = false;

  constructor(
    wakeDetector: IWakeWordDetector = wakeWordDetector,
    sttEngine: ISpeechRecognitionEngine = new SpeechRecognitionEngine()
  ) {
    this.wakeDetector = wakeDetector;
    this.sttEngine = sttEngine;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Zira"))
      ) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0] ||
      null;
  }

  public setCallbacks(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
  }

  public setLanguage(langCode: string) {
    this.sttEngine.setLanguage(langCode);
    if (this.synth) {
      const voices = this.synth.getVoices();
      const match = voices.find((v) => v.lang.startsWith(langCode.slice(0, 2)));
      if (match) this.preferredVoice = match;
    }
  }

  /**
   * Start listening for "Hey MEDI" wake-word in background
   */
  public startWakeWordMonitoring(): boolean {
    return this.wakeDetector.start({
      onWakeWordDetected: (event) => {
        this.callbacks.onWakeWord?.(event);
      },
      onError: (err) => {
        this.callbacks.onError?.(err);
      },
    });
  }

  public stopWakeWordMonitoring(): void {
    this.wakeDetector.stop();
  }

  public get isWakeWordMonitoring(): boolean {
    return this.wakeDetector.isMonitoring;
  }

  /**
   * Simulate "Hey MEDI" trigger (useful for test buttons, keyboard shortcuts, or demos)
   */
  public simulateWakeWord(keyword = "Hey MEDI"): void {
    this.wakeDetector.simulateWakeWord(keyword);
  }

  /**
   * Active speech listening for user command
   */
  public startListening(): boolean {
    if (this._isSpeaking && this.synth) {
      this.synth.cancel();
      this._isSpeaking = false;
    }

    const started = this.sttEngine.start(
      (transcriptEvent) => {
        this.callbacks.onTranscript?.(
          transcriptEvent.text,
          transcriptEvent.isFinal
        );
      },
      () => {
        this._isListening = true;
        this.callbacks.onListeningStart?.();
      },
      () => {
        this._isListening = false;
        playListeningDoneChime();
        this.callbacks.onListeningEnd?.();
      },
      (err) => {
        this._isListening = false;
        this.callbacks.onError?.(err);
      }
    );

    if (started) {
      this._isListening = true;
      this.callbacks.onListeningStart?.();
    }

    return started;
  }

  public stopListening() {
    this.sttEngine.stop();
    this._isListening = false;
  }

  public speak(text: string, onDone?: () => void) {
    if (!this.synth) {
      onDone?.();
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.rate = 0.95; // Senior-friendly, gentle pace
    utterance.pitch = 1.05; // Warm, friendly companion tone

    utterance.onstart = () => {
      this._isSpeaking = true;
      this.callbacks.onSpeakingStart?.();
    };

    utterance.onend = () => {
      this._isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
      onDone?.();
    };

    utterance.onerror = () => {
      this._isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
      onDone?.();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this._isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
    }
  }

  public isVoiceSupported(): boolean {
    return this.sttEngine.isSupported;
  }

  public playChime() {
    playWakeChime();
  }
}

export const voiceService = new VoiceService();
