declare const canvas_width: i32;
declare const canvas_height: i32;
declare const ITER_CONST: i16;
declare const DIV_CLASS: u8;
declare const N_THREADS: u8;
declare const START_X_TOTAL: f32;
declare const START_Y_TOTAL: f32;
declare const WINDOW: f32;

@inline
function mandelbrot_simd(c_rl: v128, c_il: v128): v128 {
    let z_r = f32x4(0., 0., 0., 0.);
    let z_i = f32x4(0., 0., 0., 0.);
    let t_r = f32x4(0., 0., 0., 0.);
    let t_i = f32x4(0., 0., 0., 0.);
    const ones = i32x4(1, 1, 1, 1);
    const fours = f32x4(4., 4., 4., 4.);
    let count = i32x4(0, 0, 0, 0);
    for (
        let total_count = 0, any_in_convergence_region = true;
        any_in_convergence_region && total_count < ITER_CONST;
        total_count++
    ) {
        z_i = v128.add<f32>(c_il, v128.mul<f32>(v128.add<f32>(z_r, z_r), z_i));
        z_r = v128.add<f32>(c_rl, v128.sub<f32>(t_r, t_i));
        t_r = v128.mul<f32>(z_r, z_r);
        t_i = v128.mul<f32>(z_i, z_i);
        const mask = v128.le<f32>(v128.add<f32>(t_r, t_i), fours);
        any_in_convergence_region = v128.any_true(mask);
        count = v128.add<i32>(count, v128.and(ones, mask));
    }
    return count;
}

export function compute(): void {
	let memcounter = 0;
	const step_X = WINDOW / f32(canvas_width);
	const step_Y = WINDOW / f32(canvas_height);
	let a1 = f32x4(0, 0, 0, 0);
	let a2 = f32x4(0, 0, 0, 0);
	for (let y = START_Y_TOTAL, count_y = 0; count_y < canvas_height; y += step_Y, count_y++) {
		a1 = v128.splat<f32>(y);
		for (let x = START_X_TOTAL, count_x = 0; count_x < canvas_width; x += 4 * step_X, count_x += 4) {
			a2 = v128.replace_lane<f32>(
				v128.replace_lane<f32>(
					v128.replace_lane<f32>(
						v128.replace_lane<f32>(a2, 3, x + 3 * step_X),
				    2, x + 2 * step_X),
				1, x + step_X),
			0, x);
            v128.store(memcounter, mandelbrot_simd(a2, a1));
            memcounter += 16;
		}
	}
}
