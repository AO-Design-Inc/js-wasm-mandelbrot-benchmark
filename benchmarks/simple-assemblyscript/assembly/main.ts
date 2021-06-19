declare const canvas_width:  i32
declare const canvas_height: i32
declare const START_X_TOTAL: f32
declare const START_Y_TOTAL: f32
declare const WINDOW: f32

const ITER_CONST = 1000

@unmanaged
class Complex {
	constructor(
		public real: f64 = 0,
		public imag: f64 = 0
	) {}

	@inline
	add(cplx: Complex): this {
		this.real = this.real + cplx.real;
		this.imag = this.imag + cplx.imag;
		return this;
	}

	@inline
	mag(): f64 {
		let re = this.real
		let im = this.imag
		return Math.sqrt(re * re + im * im)
	}

	@inline
	mul(cplx: Complex): this {
		let re1 = this.real
		let im1 = this.imag
		let re2 = cplx.real
		let im2 = cplx.imag
		this.real = re1 * re2 - im1 * im2
		this.imag = im1 * re2 + re1 * im2
		return this
	}

	set(real: f64, imag: f64): void {
		this.real = real
		this.imag = imag
	}
}

const z = new Complex()
const cplx = new Complex()

@inline
function mandelbrot(real: f64, imag: f64): i16 {
	z.set(0, 0)
	cplx.set(real, imag)

	let count = 0;
	while (z.mag() <= 2 && count < ITER_CONST) {
		z.mul(z).add(cplx) // z = z^2 + cplx
	}
	return <i16>count
}

export function compute(): void {
	const step_X:f32 = WINDOW/f32(canvas_width);
	const step_Y:f32 = WINDOW/f32(canvas_height);
	for (let y = START_Y_TOTAL, count_y = 0; count_y < canvas_height; y += step_Y, count_y++){
		for (let x = START_X_TOTAL, count_x = 0; count_x < canvas_width; x += step_X, count_x++){
			store<i16>(2*(count_y*canvas_width + count_x), mandelbrot(x,y));
		}
	}
}
