build:
	cd benchmarks/assemblyscript-multithreaded && make start
	cd benchmarks/simple-assemblyscript && make out/main.wasm 
	python3 server.py