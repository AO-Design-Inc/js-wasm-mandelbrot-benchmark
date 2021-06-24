/* exported start, end, returnImprovedjs */
'use strict';

let start,
    end = 0;

class Complex {
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }

    add(cplx) {
        this.real += cplx.real;
        this.imag += cplx.imag;
        return this;
    }

    mag() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    mul(cplx) {
        // (a + ib)*(c + id) = (ac - bd) + i(bc + ad)
        const real_part = this.real * cplx.real - this.imag * cplx.imag;
        const imag_part = this.imag * cplx.real + this.real * cplx.imag;
        this.real = real_part;
        this.imag = imag_part;
        return this;
    }
}

// Number of times mandelbrot will iterate
const ITER_CONST = 1000;

function mandelbrot(cplx) {
    let z = new Complex(0, 0);

    let count = 0;
    while (z.mag() <= 2 && count < ITER_CONST) {
        z = z.mul(z).add(cplx);
        count++;
    }

    return count;
}

function returnImprovedjs(
    x_start,
    y_start,
    canvas_width,
    canvas_height,
    window
) {
    start = performance.now();

    const step_X = window / canvas_width;
    const step_Y = window / canvas_height;

    const points_array = new Array(canvas_height * canvas_width * 4).fill(0);

    let count = 0;
    // this is atrocious
    // this part hasn't been optimized but eh
    for (
        let y = y_start, count_y = 0;
        count_y < canvas_width;
        y += step_Y, count_y++
    ) {
        for (
            let x = x_start, count_x = 0;
            count_x < canvas_height;
            x += step_X, count_x++
        ) {
            let val = mandelbrot(new Complex(x, y));
            let curr_pixel = count * 4;

            points_array[curr_pixel] = val;
            points_array[curr_pixel + 1] = val;
            points_array[curr_pixel + 2] = val;
            points_array[curr_pixel + 3] = 255;

            count++;
        }
    }

    end = performance.now();
    // creates new imageData object and puts it on the canvas
    return new ImageData(
        new Uint8ClampedArray(points_array),
        canvas_width,
        canvas_height
    );
}
