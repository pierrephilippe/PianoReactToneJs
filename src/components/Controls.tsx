import React from 'react';
import * as Tone from 'tone';
import { useMusic } from '../context/MusicProvider';

export const Controls: React.FC = () => {
  const {
    detectedChord,
    oscillator,
    setOscillator,
    translatedEmotion,
    suggestedChordType,
  } = useMusic();

  return (
    <div className="controls-container">
      <div className="control-card chord-display">
        <h3>Accord Détecté</h3>
        <p>{detectedChord || '---'}</p>
      </div>

      <div className="control-card sound-selector">
        <h3>Sonorité</h3>
        <select
          id="sound-select"
          value={oscillator}
          onChange={(e) => setOscillator(e.target.value as Tone.OscillatorType)}
        >
          <option value="sine">Pure (Sine)</option>
          <option value="square">Carrée (Square)</option>
          <option value="triangle">Triangulaire (Triangle)</option>
          <option value="sawtooth">En dents de scie (Sawtooth)</option>
        </select>
      </div>

      <div className="control-card emotion-display">
        <h3>Émotion</h3>
        <p>{translatedEmotion}</p>
        <small>Suggestion : {suggestedChordType}</small>
      </div>
    </div>
  );
};