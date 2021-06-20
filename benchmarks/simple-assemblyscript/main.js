const memory = new WebAssembly.Memory({
	initial: 80,
	maximum: 80
});

function init_wasm(wasm_path, importObj) {
	// returns a promise that has webassembly result for the module that's
	// passed in.
	if(WebAssembly.instantiateStreaming) {
		return WebAssembly.instantiateStreaming(
			fetch(wasm_path, {cache:"force-cache"}), importObj)
	} else {
		return fetch(wasm_path, {cache:"force-cache"}).then(response =>
			response.arrayBuffer()
		).then(bytes =>
			WebAssembly.instantiate(bytes, importObj)
		).catch(console.error);
	}
}


let start,end = 0;
function returnSharedBufferjs(
	START_X_TOTAL, START_Y_TOTAL, canvas_width, canvas_height, WINDOW
) {
	const importObj = {
		main: {
			canvas_width,
			canvas_height,
			ITER_CONST:1000,
			START_X_TOTAL,
			START_Y_TOTAL,
			WINDOW
		},
		env: {
			abort(_msg, _file, line, column) {
				console.error("abort!" + line + ":" + column);
			},
			memory: memory
		},
	}
	return init_wasm("./benchmarks/simple-assemblyscript/out/main.wasm", importObj).then(result => {
		start = performance.now()
		result.instance.exports.compute()
		end = performance.now()
		return draw(0, canvas_width, canvas_height)
	}).catch(console.error);
}


function draw(arrayptr, WIDTH, HEIGHT) {
	//takes in pointer, returns imageData
	const arr_start = arrayptr
	const arr_end = arr_start + WIDTH * HEIGHT
	const tempmem = new Int16Array(memory.buffer)
	const imageArrayMemory = tempmem.slice(arr_start, arr_end);
	const arr = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
	imageArrayMemory.forEach(
		(val, i) => {
				arr[4 * i + 0] = val; arr[4 * i + 1] = val; arr[4 * i + 2] = val; arr[4 * i + 3] = 255;
		});

	let imageData = new ImageData(arr, WIDTH, HEIGHT);
	return imageData;
}
