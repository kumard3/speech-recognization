import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";

function App() {
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);

  const loadModel = async () => {
    const recognizer = await speech.create("BROWSER_FFT");
    console.log("MODEL");
    await recognizer.ensureModelLoaded();
    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };
  // console.log(recognizer.wordLabels())
  // console.log(labels.map((n)=>{return <h>{n}</h>}))
  useEffect(() => {
    loadModel();
  }, []);

  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  // 3. Listen for Actions
  const recognizeCommands = async () => {
    console.log("Listening for commands");
    model.listen(
      (result) => {
        // console.log(labels[argMax(Object.values(result.scores))])
        console.log(result.spectrogram);
        setAction(labels[argMax(Object.values(result.scores))]);
      },
      { includeSpectrogram: true, probabilityThreshold: 0.9 }
    );
    setTimeout(() => model.stopListening(), 10e3);
  };
  if (labels === null) {
    return <h1>loading</h1>;
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={recognizeCommands}>commands</button>
        {action ? <div>{action}</div> : <div>No Action Detected</div>}
      </header>
    </div>
  );
}

export default App;
