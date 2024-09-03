// Example adapted from https://github.com/mdn/webaudio-examples/tree/main/audio-analyser
// `assets/samplesound_techno_volume_03.mp3` downloaded from https://soundcloud.com/samplesoundmusic/techno-volume-03

// UI elements
const msg = document.querySelector("output");
const startBtn = document.querySelector("#start_button");
const stopBtn = document.querySelector("#stop_button");
const modeDropdown = document.querySelector("#vizmode-select");
const canvasElt = document.querySelector("#canvas");

// Attach behavior to UI elements
startBtn.addEventListener("click", startHandler);
stopBtn.addEventListener("click", stopHandler);
modeDropdown.addEventListener("change", modeHandler);

// A global var to store the main sourceNode
// and make it accessible to all event handlers.
let sourceNode;
let vizMode = modeDropdown.value;


// What to do when mode dropdown changes
function modeHandler(event) {
  console.log("Visualization mode changed");
  vizMode = modeDropdown.value;
}

// What to do when start button is clicked
function startHandler(event) {
  console.log("Start button clicked");

  event.preventDefault();
  startBtn.disabled = true;
  stopBtn.disabled = false;

  // A user interaction happened we can create the audioContext
  const audioContext = new AudioContext();

  // Load the audio file
  msg.textContent = "Loading audio...";
  fetch('assets/samplesound_techno_volume_03.mp3')
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      msg.textContent = "Decoding audio...";
      return audioContext.decodeAudioData(buffer)
    })
    .then((decodedBuffer) => {
      // Set up the AudioBufferSourceNode
      sourceNode = new AudioBufferSourceNode(audioContext, {
        buffer: decodedBuffer,
        loop: true,
      });

      // Set up the audio analyser and the javascript node
      const analyserNode = new AnalyserNode(audioContext);
      const javascriptNode = audioContext.createScriptProcessor(
        1024,
        1,
        1
      );

      // Connect the nodes together
      sourceNode.connect(audioContext.destination);
      sourceNode.connect(analyserNode);
      analyserNode.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      // Play the audio
      msg.textContent = "Audio playing...";
      sourceNode.start(0); // Play the sound now

      let it = 0;
      // Set up the event handler that is triggered every 
      // time enough samples have been collected,
      // then trigger the audio analysis and render the results.
      javascriptNode.onaudioprocess = () => {
        // Read the frequency values
        const amplitudeArray = new Uint8Array(
          analyserNode.frequencyBinCount
        );

        // Get the time domain data for this sample
        analyserNode.getByteTimeDomainData(amplitudeArray);

        // `amplitudeArray` is now an array of 1024 values 
        // ranging from 0 to 255, representing the amplitude
        // of the audio signal at each frequency sample.
        // with 127 representing silence. 
        // Check it out:
        if (it == 100) console.log(amplitudeArray);

        // Draw the display when the audio is playing
        if (audioContext.state === "running") {
          // Draw the time domain in the canvas
          requestAnimationFrame(() => {
            // Get the canvas 2d context
            const canvasContext = canvasElt.getContext("2d");

            // Clear the canvas
            canvasContext.clearRect(
              0,
              0,
              canvasElt.width,
              canvasElt.height
            );

            if (vizMode === "thin") {
              // Draw the amplitude inside the canvas
              for (let i = 0; i < amplitudeArray.length; i++) {
                const value = amplitudeArray[i] / 256;
                const y = canvasElt.height - canvasElt.height * value;
                canvasContext.fillStyle = "white";
                canvasContext.fillRect(i, y, 1, 1);
              }

            } else if (vizMode === "solid") {
              // Draw the amplitude inside the canvas
              const w = Math.max(canvasElt.width / amplitudeArray.length, 1);
              for (let i = 0; i < amplitudeArray.length; i++) {
                // Draw the frequency domain in the canvas
                const normFreqVal = amplitudeArray[i] / 256;
                const nx = i / amplitudeArray.length;
                const x = canvasElt.width * nx;
                const y = canvasElt.height;
                const h = -canvasElt.height * normFreqVal;
                const hue = 360 * normFreqVal;
                canvasContext.fillStyle = `hsl(${hue}, 100%, 50%)`;
                canvasContext.fillRect(x, y, w, h);
              }
            }
          });
        }

        it++;
      };
    });
}

// What to do when stop button is clicked
function stopHandler(event) {
  console.log("Stop button clicked");

  event.preventDefault();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  sourceNode?.stop(0);
  msg.textContent = "Audio stopped.";
}