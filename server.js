// general imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// faceapi specific imports
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const canvas = require('canvas');
const faceapi = require('face-api.js');

// configure server
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData, createCanvas } = canvas;

setupFaceApiRequirements();

app.post('/', (req, res) => {
  const results = getExpressionsFromImage(req.body.base64);
  res.send(results);
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}! 🚀`)
);

async function getExpressionsFromImage(base64Input) {
  // retrieve and draw image
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.onerror = err => {
    throw err;
  };
  img.src = 'data:image/png;base64,' + base64Input;

  // download image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('imageFromUser.png', buffer);
}

async function setupFaceApiRequirements() {
  // import nodejs bindings to native tensorflow,
  // not required, but will speed up things drastically (python required)
  require('@tensorflow/tfjs-node');

  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

  // load models
  await faceapi.nets.tinyFaceDetector.loadFromDisk('./models');
  await faceapi.nets.faceExpressionNet.loadFromDisk('./models');
}
