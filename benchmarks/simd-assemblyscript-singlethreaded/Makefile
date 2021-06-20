MEMORY_FLAGS = --maximumMemory 80 --importMemory --noExportMemory --initialMemory 80 --memoryBase 4000000
OPTIMIZATION_FLAGS = -O3 --converge
DEBUG_FLAGS = --sourceMap
FEATURE_FLAGS = --enable simd --enable threads
RUNTIME_FLAGS = --runtime stub
start: install
	npx asc assembly/mandel_final.ts -b build/mandel_final.wasm -t build/mandel_final.wat $(OPTIMIZATION_FLAGS) $(MEMORY_FLAGS) $(FEATURE_FLAGS) $(RUNTIME_FLAGS) $(DEBUG_FLAGS)

install:
	npm i

