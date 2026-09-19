/**
 * MEDI Voice & Speech Recognition Architecture
 * Designed for immediate browser execution with Web Speech API
 * and future integration of hardware/edge wake-word detection (Porcupine, ONNX, Whisper, Gemini Multimodal Live API).
 */

export type SpeechState =
  | "idle"
  | "wake_word_monitoring"
  | "listening"
  | "processing"
  | "speaking"
  | "error";

export interface WakeWordDetectionEvent {
  keyword: string; // e.g., "Hey MEDI", "MEDI"
  confidence: number; // 0.0 - 1.0
  timestamp: number;
  engine: "web-speech" | "simulated" | "porcupine-ready" | "gemini-live";
}

export interface SpeechTranscriptEvent {
  text: string;
  isFinal: boolean;
  confidence?: number;
}

export interface WakeWordDetectorCallbacks {
  onWakeWordDetected: (event: WakeWordDetectionEvent) => void;
  onMonitoringStart?: () => void;
  onMonitoringStop?: () => void;
  onError?: (error: string) => void;
}

/**
 * Interface for pluggable Wake Word Detectors.
 * Can be backed by:
 * - WebSpeech continuous recognition (current browser standard)
 * - Picovoice Porcupine WebAssembly (edge wake word)
 * - Custom ONNX keyword spotter
 * - Simulated test bench
 */
export interface IWakeWordDetector {
  readonly isSupported: boolean;
  readonly isMonitoring: boolean;
  start(callbacks: WakeWordDetectorCallbacks): boolean;
  stop(): void;
  simulateWakeWord(keyword?: string, confidence?: number): void;
}

/**
 * Interface for Speech Recognition Engines.
 * Can be backed by:
 * - Web Speech API (webkitSpeechRecognition)
 * - Local Whisper (Transformers.js / Whisper.cpp WebAssembly)
 * - Real-time Audio WebSocket stream (e.g. Gemini Live API / Deepgram)
 */
export interface ISpeechRecognitionEngine {
  readonly isSupported: boolean;
  readonly isListening: boolean;
  start(
    onTranscript: (event: SpeechTranscriptEvent) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): boolean;
  stop(): void;
  abort(): void;
  setLanguage(langCode: string): void;
}
