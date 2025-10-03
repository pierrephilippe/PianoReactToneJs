import React from 'react';
import * as Tone from 'tone';
import { useMusic } from './MusicProvider';
import styles from './Controls.module.css';

export const Controls: React.FC = () => {
  const {
    detectedChord,
    oscillator,
    setOscillator,
    translatedEmotion,
    suggestedChordType,
  } = useMusic();

  return (
    <div className={styles.controlsContainer}>
      <div className={`${styles.controlCard} ${styles.chordDisplay}`}>
        <h3>Accord Détecté</h3>
        <p>{detectedChord || '---'}</p>
      </div>

      <div className={`${styles.controlCard} ${styles.soundSelector}`}>
        <h3>Sonorité</h3>
        <select
          id="sound-select"
          value={oscillator}
          onChange={(e) => setOscillator(e.target.value as Tone.ToneOscillatorType)}
        >
          <option value="sine">Pure (Sine)</option>
          <option value="square">Carrée (Square)</option>
          <option value="triangle">Triangulaire (Triangle)</option>
          <option value="sawtooth">En dents de scie (Sawtooth)</option>
        </select>
      </div>

      <div className={`${styles.controlCard} ${styles.emotionDisplay}`}>
        <h3>Émotion</h3>
        <p>{translatedEmotion}</p>
        <small>Suggestion : {suggestedChordType}</small>
      </div>
    </div>
  );
};