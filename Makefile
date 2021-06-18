run: build
	python3 server.py

build:
	cd benchmarks/assemblyscript-multithreaded && make start
	cd benchmarks/simple-assemblyscript && make out/main.wasm 
	cd benchmarks/singlethreaded-rustwasm && make