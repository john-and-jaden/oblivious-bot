// general imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// faceapi specific imports
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const canvas = require('canvas');
const faceapi = require('face-api.js');

// configure server
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ extended: true }));

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData, createCanvas } = canvas;

setupFaceApiRequirements();

app.post('/', (req, res) => {
  getExpressionFromImage(req.body.base64).then(result => {
    res.send(result);
  });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}! 🚀`)
);

async function getExpressionFromImage(base64Input) {
  // retrieve and draw image
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.onerror = err => {
    throw err;
  };
  img.src = 'data:image/png;base64,' + base64Input;

  const detectionWithExpressions = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceExpressions();

  if (!detectionWithExpressions) {
    return "";
  }

  var expressions = detectionWithExpressions.expressions.asSortedArray();

  var expr = expressions
    .sort((a, b) => {
      return a.probability - b.probability;
    })
    .pop();

  console.log(expr);

  return expr.expression;
}

async function setupFaceApiRequirements() {
  // import nodejs bindings to native tensorflow,
  // not required, but will speed up things drastically (python required)
  require('@tensorflow/tfjs-node');

  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

  // load models
  await faceapi.nets.faceExpressionNet.loadFromDisk('./models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
}
