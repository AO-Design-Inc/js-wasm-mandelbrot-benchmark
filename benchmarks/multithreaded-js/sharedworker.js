//Abhi Allu
function mandelbrot(cplx) {
    let z = new Complex(0, 0);
    let count = 0;
    while (z.mag() < 2 && count < ITER_CONST) {
        z = z.mul(z).add(cplx);
        count++;
    }
    return count;
}
const ITER_CONST = 1000;
onmessage = function ({ data }) {
    const {
        START_X_TOTAL,
        START_Y_TOTAL,
        START_YC,
        STEP_X,
        STEP_Y,
        N_ROWS_PER_THREAD,
        X_LEN,
        sharedArray,
    } = data;
    for (
        let y = START_Y_TOTAL + START_YC * STEP_Y, count_y = START_YC;
        count_y < N_ROWS_PER_THREAD + START_YC;
        y += STEP_Y, count_y++
    ) {
        for (
            let x = START_X_TOTAL, count_x = 0;
            count_x < X_LEN;
            x += STEP_X, count_x++
        ) {
            let index = 4 * (count_x + count_y * X_LEN);
            let val = mandelbrot(new Complex(x, y));
            sharedArray[index + 0] = val;
            sharedArray[index + 1] = val;
            sharedArray[index + 2] = val;
            sharedArray[index + 3] = 255;
        }
    }
    postMessage('done');
};

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
        const real_part = this.real * cplx.real - this.imag * cplx.imag;
        const imag_part = this.imag * cplx.real + this.real * cplx.imag;
        this.real = real_part;
        this.imag = imag_part;
        return this;
    }
}
