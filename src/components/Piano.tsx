import React, { useEffect } from 'react';
import { useMusic } from '../context/MusicProvider';

// Les notes pour une octave de piano (touches blanches et noires)
// Ajout de la correspondance clavier
// Mapping pour clavier AZERTY
const NOTES_FR = [
  { note: "C4", nom: "Do4", key: "q", type: "white" },
  { note: "C#4", nom: "Do#4", key: "z", type: "black" },
  { note: "D4", nom: "Ré4", key: "s", type: "white" },
  { note: "D#4", nom: "Ré#4", key: "e", type: "black" },
  { note: "E4", nom: "Mi4", key: "d", type: "white" },
  { note: "F4", nom: "Fa4", key: "f", type: "white" },
  { note: "F#4", nom: "Fa#4", key: "t", type: "black" },
  { note: "G4", nom: "Sol4", key: "g", type: "white" },
  { note: "G#4", nom: "Sol#4", key: "y", type: "black" },
  { note: "A4", nom: "La4", key: "h", type: "white" },
  { note: "A#4", nom: "La#4", key: "u", type: "black" },
  { note: "B4", nom: "Si4", key: "j", type: "white" },
  { note: "C5", nom: "Do5", key: "k", type: "white" },
];

// Création d'une map pour un accès rapide de la touche à la note
const KEY_TO_NOTE = NOTES_FR.reduce((map, { key, note }) => {
  if (key) map[key] = note;
  return map;
}, {} as Record<string, string>);

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
    <div className="piano-container">
      {NOTES_FR.map(({ note, nom, type, key }) => (
        <button
          key={note}
          className={`key ${type} ${activeNotes.includes(note) ? 'active' : ''}`}
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
          <div className="key-text">
            <span className="key-keyboard">{key?.toUpperCase()}</span>
            <span className="note-name">{nom}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Piano;