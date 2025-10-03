import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import styles from './EmotionDetector.module.css';

interface EmotionDetectorProps {
  isPaused: boolean;
  onEmotionChange: (emotion: string) => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ isPaused, onEmotionChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isWebcamStarted, setIsWebcamStarted] = useState(false);

  // Charger les modèles de face-api.js
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // Les modèles seront dans le dossier public/models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      console.log('Modèles de détection faciale chargés.');
    };
    loadModels();
  }, []);

  // Démarrer la webcam
  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsWebcamStarted(true);
        }
      })
      .catch((err) => {
        console.error("Erreur d'accès à la webcam:", err);
      });
  };

  // Boucle de détection
  useEffect(() => {
    if (!isWebcamStarted || !modelsLoaded) return;

    const onInterval = async () => {
      if (isPaused) return;

      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Adapter la taille du canvas à la vidéo
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          const dominantEmotion = (Object.keys(expressions) as Array<keyof faceapi.FaceExpressions>).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );
          onEmotionChange(dominantEmotion);
        } else {
          onEmotionChange('...');
        }

        // Dessiner les détections (optionnel, pour le debug)
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }
    };

    const detectionInterval = setInterval(onInterval, 500); // Détection toutes les 500ms

    return () => clearInterval(detectionInterval);
  }, [isWebcamStarted, modelsLoaded, onEmotionChange, isPaused]);

  return (
    <div className={styles.emotionDetectorContainer}>
      {!isWebcamStarted && modelsLoaded && (
        <button onClick={startWebcam}>Activer la webcam</button>
      )}
      <video ref={videoRef} autoPlay muted playsInline width="360" height="280" style={{ display: isWebcamStarted ? 'block' : 'none' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: isWebcamStarted ? 'block' : 'none' }} />
    </div>
  );
};

export default EmotionDetector;