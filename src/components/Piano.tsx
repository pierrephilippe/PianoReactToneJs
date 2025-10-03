import React, { useEffect } from 'react';
import { useMusic } from '../context/MusicProvider';
import { NOTES_FR, KEY_TO_NOTE } from './notes';
import styles from './Piano.module.css';

const Piano: React.FC = () => {
  const { activeNotes, playNote, stopNote } = useMusic();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return; // Ignore la répétition des touches
      const note = KEY_TO_NOTE[event.key];
      if (note) {
        playNote(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = KEY_TO_NOTE[event.key];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]);

  return (
    <div className={styles.pianoContainer}>
      {NOTES_FR.map(({ note, nom, type, key }) => (
        <button
          key={note}
          className={`${styles.key} ${styles[type]} ${activeNotes.includes(note) ? styles.active : ''}`}
          // Événements pour la souris
          onMouseDown={() => playNote(note)}
          onMouseUp={() => stopNote(note)}
          onMouseLeave={() => stopNote(note)} // Arrête la note si la souris quitte le bouton
          // Événements pour le tactile
          onTouchStart={(e) => {
            e.preventDefault();
            playNote(note);
          }}
          onTouchEnd={() => stopNote(note)}
        >
          <div className={styles.keyText}>
            <span className={styles.keyKeyboard}>{key?.toUpperCase()}</span>
            <span className={styles.noteName}>{nom}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Piano;