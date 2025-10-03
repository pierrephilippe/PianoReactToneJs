import Piano from './components/Piano';
import EmotionDetector from './components/EmotionDetector';
import { Controls } from './components/Controls';
import { EmotionSmiley } from './components/EmotionSmiley';
import { useMusic } from './context/MusicProvider'; // Assurez-vous que le chemin est correct
import './App.css'

function App() {
  const { isAudioStarted, startAudio, setEmotion, emotion, isEmotionDetectionPaused } = useMusic();

  return (
    <>
      <h1>Piano Interactif</h1>
      {isAudioStarted ? (
        <>
          <div className="top-container">
            <EmotionDetector onEmotionChange={setEmotion} isPaused={isEmotionDetectionPaused} />
            <EmotionSmiley emotion={emotion} />
          </div>
          <Controls />
          <Piano />
        </>
      ) : (
        <div className="card">
          <button onClick={startAudio}>
            Cliquez pour activer le son
          </button>
        </div>
      )}
    </>
  )
}

export default App
