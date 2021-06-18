start: install 
	npx asc assembly/mandel_final.ts -b build/mandel_final.wasm -t build/mandel_final.wat -O3z --runtime stub --converge --sourceMap --enable simd --enable threads --maximumMemory 80 --importMemory --noExportMemory --sharedMemory --initialMemory 80 --memoryBase 4000000

install:
	npm i

