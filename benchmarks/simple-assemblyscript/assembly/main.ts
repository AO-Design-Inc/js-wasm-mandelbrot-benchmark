declare const canvas_width: i32;
declare const canvas_height: i32;
declare const ITER_CONST: i32;
declare const START_X_TOTAL:f32
declare const START_Y_TOTAL:f32
declare const WINDOW:f32

@unmanaged
class Complex {
	real: f64 = 0;
	imag: f64 = 0;

	constructor(real:f64, imag:f64){
		this.real = real;
		this.imag = imag;
	}

	@inline
	add(cplx: Complex): Complex {
		this.real = this.real + cplx.real;
		this.imag = this.imag + cplx.imag;
		return this;
	}

	@inline
	mag(): f64 {
		return Math.sqrt(this.real * this.real + this.imag * this.imag)
	}

	@inline
	mul(cplx: Complex): Complex {
		const __tempr  = this.real*cplx.real - this.imag*cplx.imag;
		const __tempi = this.imag*cplx.real + this.real*cplx.imag;
		this.real = __tempr;
		this.imag = __tempi;
		return this
	}


	set(real:f64,imag:f64): void {
		this.real = real;
		this.imag = imag;
	}

}

const z:Complex = new Complex(0,0);
const cplx:Complex = new Complex(0,0)

@inline
function mandelbrot(real:f64,imag:f64):u8{
	z.set(0,0)
	cplx.set(real,imag)

	//var in_set:i8 = 0;
	let count = 0;
	for (; z.mag() <= 2; count++) {
		(z.mul(z)).add(cplx); // z = z^2 + cplx
		if (count > ITER_CONST) {
			//in_set = 1;
			break;
		}
	}
	return u8(count);
}

const step_X:f32 = WINDOW/f32(canvas_width);
const step_Y:f32 = WINDOW/f32(canvas_height);
for (let y = START_Y_TOTAL, count_y = 0; count_y < canvas_height; y += step_Y, count_y++){
	for (let x = START_X_TOTAL, count_x = 0; count_x < canvas_width; x += step_X, count_x++){
		store<u8>(count_x*canvas_height + count_y, mandelbrot(x,y));
	}
}
