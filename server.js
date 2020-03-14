const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`GET: you said ${req.query.param}`);
});

app.post('/', (req, res) => {
  console.log("hey");
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

// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require('@tensorflow/tfjs-node');

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const canvas = require('canvas');

const faceapi = require('face-api.js');

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
