import React from 'react';

interface EmotionSmileyProps {
  emotion: string;
}

const EMOTION_TO_SMILEY: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😮',
  neutral: '😐',
  fearful: '😨',
  disgusted: '🤢',
  '...': '🤔', // État par défaut ou de chargement
};

export const EmotionSmiley: React.FC<EmotionSmileyProps> = ({ emotion }) => {
  const smiley = EMOTION_TO_SMILEY[emotion] || EMOTION_TO_SMILEY['...'];

  return (
    <div className="emotion-smiley">{smiley}</div>
  );
};