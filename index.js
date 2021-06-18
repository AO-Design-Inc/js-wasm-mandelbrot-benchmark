

let time = document.getElementById("time");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

const selectElement = document.querySelector('#version');
let selectedVersion = selectElement.value;
let imageData;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const LOADING = 'Loading...';

var myWorker;

const refreshButton = document.getElementById('refresh');

refreshButton.addEventListener('click', () => {
    if(selectElement.value !== 'none') {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        myWorker.postMessage([selectedVersion, WIDTH, HEIGHT]);
        console.log("Message Posted to Worker")
    
        time.textContent = LOADING;
    
        // gets [ImageData, time_to_execute] from webworker
        myWorker.onmessage = function(e) {
            ctx.putImageData(e.data[0], 0, 0);
            time.textContent = e.data[1];
        }
    }
    
});

selectElement.addEventListener('change', (event) => {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    selectedVersion = event.target.value;

    // creates a new module worker
    if (myWorker){
        myWorker.terminate();
    }
    myWorker = new Worker('worker.js');
    
    // sends selected version to webworker to be evaluated
    myWorker.postMessage([selectedVersion, WIDTH, HEIGHT]);
    console.log("Message Posted to Worker");

    time.textContent = LOADING;

    // gets [ImageData, time_to_execute] from webworker
    myWorker.onmessage = function(e) {
        ctx.putImageData(e.data[0], 0, 0);
        time.textContent = e.data[1];
    }

});
