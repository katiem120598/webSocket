// Example adapted from https://p5js.org/reference/#/p5.FFT

let sound, fft, waveform, spectrum, audioContext;

let numrows = 0;
let numcols = 0;
let numclients = 0;
let mode = "grid";
let clientshapes = [];

function preload() {
  sound = loadSound(
    "https://cdn.glitch.global/a32338f3-5980-41ad-b4b3-76e5515233d6/samplesound_techno_volume_03.mp3?v=1714518703040"
  );
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();

  //websocket setup
  const serverAddress = "wss://serverfortwo.glitch.me/";
  ws = new WebSocket(serverAddress);
  ws.onopen = function () {
    const clientdata = [{ type: "client_info", app: "display" }];
    ws.send(clientdata);
  };

  ws.onmessage = function (event) {
    console.log('message received')
    reader.onload = function () {
      let newshape = JSON.parse(reader.result);
      if (newshape.type === "newshape") {
        clientshapes.push([...newshape])
      }
    };
  };
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(1);
  beginShape();
  for (let i=0;i<clientshapes.length;i++){
        for(let shape of clientshapes){
            beginShape();
            for(let pt of shape){
                curveVertex(pt.x,pt.y);
            }
            endShape();
        } 
    }
  endShape();
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

