/* exported start, end, run_wrapper */
/* globals init:true, run:true */
let start,
    end = 0;
async function run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW) {
    await init('./benchmarks/singlethreaded-rustwasm/pkg/Mandelbrot_bg.wasm');

    start = performance.now();

    let imageData = run(START_X, START_Y, WIDTH, HEIGHT, WINDOW);

    end = performance.now();

    return imageData;
}
