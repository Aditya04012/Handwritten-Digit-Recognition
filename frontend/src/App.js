import './App.css';
import React from 'react';
import { useState,useEffect,useRef } from 'react';




function App() {

 const canvasRef = useRef(null);
const [isDrawing,setDrawaing]=useState(false);
const [prediction,setPrediction]=useState('');

const startDrawing=()=>setDrawaing(true);
const stopDrawing=()=>setDrawaing(false);

 useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

const draw=(e)=>{
  if(!isDrawing)return;

  const canvas=canvasRef.current;
  const ctx=canvas.getContext('2d');
   const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

      ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
}



const caller = () => {
    const originalCanvas = canvasRef.current;

    
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = 28;
    scaledCanvas.height = 28;
    const scaledCtx = scaledCanvas.getContext('2d');


    scaledCtx.drawImage(originalCanvas, 0, 0, 28, 28);

 
    const image = scaledCanvas.toDataURL('image/png').split(',')[1];

    
    fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPrediction('Prediction: ' + data.prediction);
      })
      .catch((err) => {
        setPrediction('Error: ' + err.message);
      });
  };

const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
     setPrediction('');
  };

  return (
    <div className="App">
     <h1>Handwritten Digit Recognition</h1>
       <h4>Draw a Digit on board between (0-9)</h4>

       <canvas 
        ref={canvasRef}
       height={280}
        width={280}
         onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
           onMouseLeave={stopDrawing}  
            style={{ border: '1px solid black', backgroundColor: 'white' }}
            onMouseMove={draw}
            > </canvas>

            <br></br>


            <button onClick={caller}>Predict</button>
            <button onClick={clearCanvas}>Clear</button>
            <p>{prediction}</p>
    </div>
  );
}

export default App;
