import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Tone from 'tone';
import { Chord } from '@tonaljs/tonal';
import { useSynth } from '../hooks/useSynth';

// --- Définitions des types ---
interface MusicContextType {
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
  oscillator: Tone.OscillatorType;
  setOscillator: (type: Tone.OscillatorType) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// --- Mappings métier ---
const EMOTION_TO_CHORD_TYPE: Record<string, string> = {
  happy: 'Majeur (M, maj7)',
  sad: 'Mineur (m, m7)',
  angry: 'Diminué (dim, dim7)',
  surprised: 'Augmenté (aug, 7#5)',
  neutral: 'Majeur ou Mineur',
  fearful: 'Suspendu (sus2, sus4)',
  disgusted: 'Altéré (7b9, 7#9)',
};

const CHORD_TYPE_TO_EMOTION: Record<string, string> = {
  'M': 'happy',
  'maj7': 'happy',
  'm': 'sad',
  'm7': 'sad',
  'dim': 'angry',
  'dim7': 'angry',
  'aug': 'surprised',
  'sus4': 'fearful',
};

const EMOTION_TRANSLATION: Record<string, string> = {
  happy: 'Joyeux',
  sad: 'Triste',
  angry: 'En colère',
  surprised: 'Surpris',
  neutral: 'Neutre',
  fearful: 'Craintif',
  disgusted: 'Dégoûté',
}

const EMOTION_TO_CHORD_NOTES: Record<string, string[]> = {
  happy: ['C4', 'E4', 'G4'],
  sad: ['C4', 'D#4', 'G4'],
  angry: ['C4', 'D#4', 'F#4'],
  surprised: ['C4', 'E4', 'G#4'],
  fearful: ['C4', 'F4', 'G4'],
  disgusted: ['C4', 'F#4'],
};

// --- Le Provider ---
export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [detectedChord, setDetectedChord] = useState('');
  const [emotion, setEmotionState] = useState('...');
  const [oscillator, setOscillatorState] = useState<Tone.OscillatorType>('sine');
  const [isUserPlaying, setIsUserPlaying] = useState(false);
  const [sourceOfEmotion, setSourceOfEmotion] = useState<'user' | 'webcam'>('webcam');
  const [lastPlayedEmotion, setLastPlayedEmotion] = useState('');

  const synth = useSynth();

  const startAudio = async () => {
    await Tone.start();
    setIsAudioStarted(true);
  };

  const playNote = (note: string) => {
    if (activeNotes.includes(note)) return;
    setIsUserPlaying(true);
    setSourceOfEmotion('user'); // L'utilisateur joue
    synth.playNote(note);
    setActiveNotes(prev => [...prev, note]);
  };

  const stopNote = (note: string) => {
    if (!activeNotes.includes(note)) return;
    setSourceOfEmotion('user'); // L'utilisateur joue
    synth.stopNote(note);
    setActiveNotes(prev => prev.filter(n => n !== note));
  };

  const setOscillator = (type: Tone.OscillatorType) => {
    setOscillatorState(type);
    synth.setOscillator(type);
  };

  const setEmotion = (newEmotion: string) => {
    setSourceOfEmotion('webcam'); // La webcam détecte
    setEmotionState(newEmotion);
  }

  useEffect(() => {
    const chordName = activeNotes.length > 1 ? Chord.detect(activeNotes)[0] || '' : '';
    setDetectedChord(chordName);
  }, [activeNotes]);

  // Effet pour gérer la fin du jeu de l'utilisateur
  useEffect(() => {
    if (activeNotes.length > 0) {
      setIsUserPlaying(true);
    } else {
      const timeoutId = setTimeout(() => {
        setIsUserPlaying(false);
      }, 2000); // Délai de 2 secondes avant de réactiver la webcam
      return () => clearTimeout(timeoutId);
    }
  }, [activeNotes.length]);

  // Nouvel effet : Détecte l'émotion à partir de l'accord joué
  useEffect(() => {
    if (sourceOfEmotion === 'user' && detectedChord) {
      const chordTokens = Chord.tokenize(detectedChord.split(' / ')[0]);
      if (chordTokens.length > 1) {
        const quality = chordTokens[1];
        const foundEmotion = CHORD_TYPE_TO_EMOTION[quality];
        if (foundEmotion) setEmotionState(foundEmotion);
      }
    }
  }, [detectedChord, sourceOfEmotion]);

  // Effet existant : Joue un accord quand l'émotion (de la webcam) change
  useEffect(() => {
    if (sourceOfEmotion === 'webcam' && isAudioStarted && emotion && emotion !== '...' && emotion !== lastPlayedEmotion) {
      const notes = EMOTION_TO_CHORD_NOTES[emotion];
      if (notes) {
        synth.playChord(notes, '1n');
        // Mettre à jour les notes actives pour l'effet visuel
        setActiveNotes(notes);
        setDetectedChord(Chord.detect(notes).join(' / '));
        // Nettoyer les notes actives et l'accord détecté après un délai
        setTimeout(() => {
          setActiveNotes([]);
          setDetectedChord('');
        }, 2000);
      }
      setLastPlayedEmotion(emotion);
    }
  }, [emotion, isAudioStarted, lastPlayedEmotion, synth, sourceOfEmotion]);

  const value = {
    isAudioStarted, startAudio,
    isEmotionDetectionPaused: isUserPlaying,
    activeNotes, playNote, stopNote,
    detectedChord,
    emotion, setEmotion: setEmotion,
    translatedEmotion: EMOTION_TRANSLATION[emotion] || '...',
    suggestedChordType: EMOTION_TO_CHORD_TYPE[emotion] || 'Inconnu',
    oscillator, setOscillator,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

// --- Hook pour consommer le contexte ---
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};