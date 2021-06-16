let time = document.getElementById("time");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

const selectElement = document.querySelector('#version');
let selectedVersion = selectElement.value;
let imageData;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

selectElement.addEventListener('change', (event) => {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    selectedVersion = event.target.value;

    // creates a module worker
    var myWorker = new Worker('worker.js');
    
    // sends selected version to webworker to be evaluated
    myWorker.postMessage([selectedVersion, WIDTH, HEIGHT]);
    console.log("Message Posted to Worker")

    time.textContent = "Loading...";

    // gets [ImageData, time_to_execute] from webworker
    myWorker.onmessage = function(e) {
        ctx.putImageData(e.data[0], 0, 0);
        time.textContent = e.data[1]
        console.log('Message received from worker');
        myWorker.terminate();
    }

    
});
