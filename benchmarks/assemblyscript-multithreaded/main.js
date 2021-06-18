const memory = new WebAssembly.Memory({
	initial: 80,
	maximum: 80,
	shared: true
});

const ITER_CONST = 1000;
const N_THREADS = 8;
const workers = new Array(N_THREADS);
for(let i=0; i<N_THREADS; i++) {
    workers[i] = new Worker("benchmarks/assemblyscript-multithreaded/wasm_worker.js");
}

function computeAndDrawMandel(START_X_TOTAL, START_Y_TOTAL, WIDTH, HEIGHT, WINDOW) {
	let donecount = 0;
	const startTime = performance.now()
	for (let i =0; i<N_THREADS; i++) {
		console.log(i)
		//const worker = new Worker("wasm_worker.js")
		workers[i].postMessage({
			n_worker: i,
			n_threads: N_THREADS,
			memory: memory,
			width: WIDTH,
			height: HEIGHT,
			ITER_CONST,
			START_X_TOTAL, 
			START_Y_TOTAL,
			WINDOW

		})
	}

	return new Promise((res, rej) => {
		workers.forEach( (worker) => worker.onmessage = e => {
			donecount++
			if(donecount == N_THREADS) {
				res(draw(0, WIDTH, HEIGHT))
			}
		})
	});
}

function draw(arrayptr, WIDTH, HEIGHT) {
	//takes in pointer, returns imageData
	const arr_start = arrayptr
	const arr_end = arr_start + WIDTH * HEIGHT
	const tempmem = new Int32Array(memory.buffer)
	const imageArrayMemory = tempmem.slice(arr_start, arr_end);
	const arr = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
	imageArrayMemory.forEach(
		(val, i) => {
			if (val) {
				arr[4 * i + 0] = val; arr[4 * i + 1] = val; arr[4 * i + 2] = val; arr[4 * i + 3] = 255;
			}
		});

	let imageData = new ImageData(arr, WIDTH, HEIGHT);
	return imageData;
}
