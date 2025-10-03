import type * as Tone from 'tone';

export interface MusicContextType {
  isAudioStarted: boolean;
  startAudio: () => Promise<void>;
  isEmotionDetectionPaused: boolean;

  // État du piano
  activeNotes: string[];
  playNote: (note: string) => void;
  stopNote: (note: string) => void;

  // État des accords
  detectedChord: string;

  // État de l'émotion
  emotion: string;
  translatedEmotion: string;
  setEmotion: (emotion: string) => void;
  suggestedChordType: string;

  // Contrôles du son
  oscillator: Tone.ToneOscillatorType;
  setOscillator: (type: Tone.ToneOscillatorType) => void;
}