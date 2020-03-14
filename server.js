const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`GET: you said ${req.query.param}`);
});

// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require('@tensorflow/tfjs-node');

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const canvas = require('canvas');

const faceapi = require('face-api.js');

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData, createCanvas } = canvas;

setup();

app.post('/', (req, res) => {
  processImage(req.body.param);
  res.send(
    'You said ' +
      req.body.param +
      '\n And I respond the reverse: ' +
      myFun(req.body.param)
  );
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}! 🚀`)
);

function myFun(input) {
  result = '';
  for (var i = input.length - 1; i >= 0; i -= 1) {
    result += input[i];
  }
  return result;
}

async function setup() {
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

  await faceapi.nets.tinyFaceDetector.loadFromDisk('./models');
  await faceapi.nets.faceExpressionNet.loadFromDisk('./models');
}

async function processImage(base64Input) {
  console.log("yeet");

  // Generate Image from base64
  const img = new Image();
  // img.onload = () => ctx.drawImage(img, 0, 0)
  // img.onerror = err => { throw err }
  // img.src = base64Input;

  const detectionWithExpressions = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceExpressions();
  var expressions = detectionWithExpressions.expressions.asSortedArray();
  var expr = expressions
    .sort((a, b) => {
      return a - b;
    })
    .pop();
  return expr;
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.onerror = err => {
    throw err;
  };

  img.src = 'data:image/png;base64,' + base64Input;

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('test.png', buffer);
}
