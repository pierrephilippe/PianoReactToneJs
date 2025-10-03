import Piano from './context/Piano';
import EmotionDetector from './context/EmotionDetector';
import { Controls } from './context/Controls';
import { EmotionSmiley } from './context/EmotionSmiley';
import { useMusic } from './context/MusicProvider';
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
            <div className="smiley-frame">
              <EmotionSmiley emotion={emotion} />
            </div>
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
