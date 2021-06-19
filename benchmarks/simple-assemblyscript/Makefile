out/main.wasm : install assembly/main.ts
	npx asc assembly/main.ts -b out/main.wasm -t out/main.wat -O3 --converge --maximumMemory 80 --importMemory --noExportMemory  --initialMemory 80 --memoryBase 2000000 --runtime stub
install:
	npm i
