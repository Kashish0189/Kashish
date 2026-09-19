/**
 * Pluggable Wake Word Detector for MEDI ("Hey MEDI").
 *
 * Architecture:
 * 1. Web Speech Continuous Keyword Spotter: Listens for "Hey MEDI" / "Medi"
 * 2. Simulated Trigger Engine: Allows programmatic and UI-driven wake-word simulation
 * 3. Extension points for on-device Picovoice Porcupine, local ONNX, and Whisper
 */

import {
  IWakeWordDetector,
  WakeWordDetectionEvent,
  WakeWordDetectorCallbacks,
} from "./types";
import { playWakeChime } from "./wakeChime";

export class WakeWordDetector implements IWakeWordDetector {
  private recognition: any = null;
  private _isMonitoring = false;
  private callbacks: WakeWordDetectorCallbacks = {
    onWakeWordDetected: () => {},
  };
  private wakePatterns = [
    /\bhey\s+medi\b/i,
    /\bhey\s+media\b/i,
    /\bhi\s+medi\b/i,
    /\bhello\s+medi\b/i,
    /\bok\s+medi\b/i,
    /\ba\s+medi\b/i,
    /\bmedi\b/i,
  ];

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-US";

        this.recognition.onstart = () => {
          this._isMonitoring = true;
          this.callbacks.onMonitoringStart?.();
        };

        this.recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.trim().toLowerCase();
            const confidence = event.results[i][0].confidence || 0.9;

            // Check if any wake word pattern is satisfied
            for (const pattern of this.wakePatterns) {
              if (pattern.test(transcript)) {
                // Detected wake word!
                playWakeChime();
                this.callbacks.onWakeWordDetected({
                  keyword: "Hey MEDI",
                  confidence,
                  timestamp: Date.now(),
                  engine: "web-speech",
                });
                break;
              }
            }
          }
        };

        this.recognition.onerror = (event: any) => {
          // If aborted or network error, silently handle
          if (event.error !== "no-speech" && event.error !== "aborted") {
            this.callbacks.onError?.(event.error);
          }
        };

        this.recognition.onend = () => {
          // If still monitoring, auto-restart continuous listening
          if (this._isMonitoring) {
            try {
              this.recognition.start();
            } catch (e) {
              this._isMonitoring = false;
              this.callbacks.onMonitoringStop?.();
            }
          } else {
            this.callbacks.onMonitoringStop?.();
          }
        };
      }
    }
  }

  public get isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public get isMonitoring(): boolean {
    return this._isMonitoring;
  }

  public start(callbacks: WakeWordDetectorCallbacks): boolean {
    this.callbacks = callbacks;

    if (!this.recognition) {
      console.info(
        "[WakeWordDetector] Continuous speech recognition not supported in this browser; simulation mode active."
      );
      return false;
    }

    try {
      this._isMonitoring = true;
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn("[WakeWordDetector] Start failed or already running:", err);
      return false;
    }
  }

  public stop(): void {
    this._isMonitoring = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Programmatic simulation of the "Hey MEDI" wake-word activation.
   * Ideal for prototype demonstrations, elderly testing, and fallback environments.
   */
  public simulateWakeWord(keyword = "Hey MEDI", confidence = 0.98): void {
    playWakeChime();
    this.callbacks.onWakeWordDetected({
      keyword,
      confidence,
      timestamp: Date.now(),
      engine: "simulated",
    });
  }
}

export const wakeWordDetector = new WakeWordDetector();
