import numpy as np
from fastapi import FastAPI
from pydantic  import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import tensorflow
from tensorflow import keras
from keras.models import load_model
import base64
import cv2

model=load_model('mnist_model.h5')

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
      allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

class Model(BaseModel):
    image:str

@app.get('/')
def get():
    return {"status":"Handwritten digit recorgnition api is working "}


@app.post('/predict')
def makePredict(req: Model):
    try:
        
        image_data = base64.b64decode(req.image)
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

        
        img = cv2.resize(img, (28, 28))
        img = 255 - img  
        img = img.astype("float32") / 255.0
        img = img.reshape(1, 28, 28, 1)

        
        pred = model.predict(img)
        digit = int(np.argmax(pred))

        return {"prediction": digit}

    except Exception as e:
        return {"error": str(e)}
