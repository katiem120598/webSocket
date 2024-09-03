// Example adapted from https://p5js.org/reference/#/p5.FFT

let sound, fft, waveform, spectrum;


function preload(){
  sound = loadSound('assets/samplesound_techno_volume_03.mp3');
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(togglePlay);

  fft = new p5.FFT();
}

function draw() {
  background(255)

  // `waveform` is now an array of 1024 values 
  // ranging from -1.0 to 1.0, representing the amplitude
  // of the audio signal at each frequency sample.
  // https://p5js.org/reference/#/p5.FFT/waveform
  waveform = fft.waveform();

  push();
  noFill();
  stroke(0);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < waveform.length; i++){
    const x = i * width / waveform.length;
    const y = (0.5 + waveform[i] / 2.0) * height;
    vertex(x,y);
  }
  endShape();
  pop();

  // Alternatively, you can also use the `analyze` method.
  // `spectrum` is now an array of 1024 values
  // ranging from 0 to 255, representing the amplitude
  // of the audio signal at each frequency sample
  // with 127 representing silence.
  // https://p5js.org/reference/#/p5.FFT/analyze
  spectrum = fft.analyze();

  // Amplitude in [0, 255] range makes it easier to work with colors
  push();
  noStroke();
  colorMode(HSB, 255, 100, 100);
  const w = width / spectrum.length;
  for (let i = 0; i < spectrum.length; i++){
    const x = i * width / spectrum.length;
    const h = spectrum[i] / 255.0 * height;
    fill(spectrum[i], 100, 100);
    rect(x, height, w, -h);
  }
  pop();



  fill(0);
  noStroke();
  text("Click on the screen to start/stop sound. Press 's' to print the audio spectrum to the console.", 10, height - 10);
}


function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}


function keyPressed() {
  if (key === 's') {
    console.log("Waveform:");
    console.log(waveform);
    
    console.log("Spectrum:");
    console.log(spectrum);
  }
}