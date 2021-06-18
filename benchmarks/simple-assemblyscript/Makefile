out/main.wasm : install assembly/main.ts 
	npx asc assembly/main.ts -b out/main.wasm -t out/main.wat -O3s --converge --maximumMemory 50 --importMemory --noExportMemory  --initialMemory 50 --memoryBase 1000000 --runtime stub
install:
	npm i
