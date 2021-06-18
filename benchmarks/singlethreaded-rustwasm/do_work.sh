wasm-pack build --target web
sed '/import\W/d;s/^export//g;/default/d' pkg/Mandelbrot.js > tmp_mandel_import.js
cat tmp_mandel_import.js  mandel_src.js > Mandelbrot.js
rm tmp_mandel_import.js