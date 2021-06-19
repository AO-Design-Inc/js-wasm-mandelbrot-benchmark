declare const canvas_width: i32;
declare const canvas_height: i32;
declare const ITER_CONST: i16;
declare const DIV_CLASS: u8;
declare const N_THREADS: u8;
declare const START_X_TOTAL:f32
declare const START_Y_TOTAL:f32
declare const WINDOW:f32

@inline
function mandelbrot(c_r:f64, c_i:f64):i16{
	let count:i16 = 0;
	let z_r:f64 = 0., z_i:f64 = 0., t_r:f64 = 0., t_i:f64 = 0.;
	for(; z_r*z_r + z_i*z_i < 4; count++) {
		t_r = z_r*z_r - z_i*z_i + c_r;
		t_i = 2*z_i*z_r + c_i;
		z_r = t_r;
		z_i = t_i;
		if(count > ITER_CONST) {
			break;
		}
	}
	return count;
}

export function compute():void {
	let memcounter = 0
	const step_X:f32 = WINDOW/f32(canvas_width);
	const step_Y:f32 = WINDOW/f32(canvas_height);
	for (let y = START_Y_TOTAL, count_y = 0; count_y < canvas_height; y += step_Y, count_y++){
		for (let x = START_X_TOTAL, count_x = 0; count_x < canvas_width; x += step_X, count_x++){
			store<i16>(memcounter, mandelbrot(x,y));
			memcounter += 2
		}
	}
}
