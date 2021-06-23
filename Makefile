#run: build
#python3 server.py
build: lint
	cd benchmarks/assemblyscript-multithreaded && $(MAKE)
	cd benchmarks/simple-assemblyscript && $(MAKE)
	cd benchmarks/singlethreaded-rustwasm && $(MAKE)
	cd benchmarks/simd-assemblyscript-singlethreaded/ && $(MAKE)
	cd benchmarks/optimized-assemblyscript-singlethreaded/ && $(MAKE)

lint: install
	npx prettier --write **/*.js
	npx eslint **/*.js

install:
	npm install 