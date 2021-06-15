let time = document.getElementById("time");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');


const selectElement = document.querySelector('#version');
let selectedVersion = selectElement.value;
let imageData;

// creates a module worker
var myWorker = new Worker('worker.js', { type: 'module' });

selectElement.addEventListener('change', (event) => {
    selectedVersion = event.target.value;
    
    // sends selected version to webworker to be evaluated
    myWorker.postMessage(selectedVersion);
    console.log("Message Posted to Worker")

    // on response from webworker, throw it on the canvas
    myWorker.onmessage = function(e) {
        console.log(e.data);
        ctx.putImageData(e.data[0], 0, 0);
        time.textContent = e.data[1]
        console.log('Message received from worker');
    }

});
