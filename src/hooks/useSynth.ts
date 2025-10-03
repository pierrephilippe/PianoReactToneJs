import { useRef, useEffect } from 'react';
import * as Tone from 'tone';

export function useSynth() {
  const synthRef = useRef<Tone.PolySynth | null>(null);

  // Initialisation du synthétiseur
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 },
    }).toDestination();

    // Nettoyage lors du démontage du composant
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const playNote = (note: string) => {
    synthRef.current?.triggerAttack(note);
  };

  const stopNote = (note: string) => {
    synthRef.current?.triggerRelease(note);
  };

  const playChord = (notes: string[], duration: string | number) => {
    synthRef.current?.triggerAttackRelease(notes, duration);
  };

  const setOscillator = (type: Tone.OscillatorType) => {
    synthRef.current?.set({ oscillator: { type } });
  };

  return { playNote, stopNote, playChord, setOscillator };
}