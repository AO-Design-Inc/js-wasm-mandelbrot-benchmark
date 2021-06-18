current_dir = $(shell pwd)
build:
	npm install
	npx wasm-pack build --target web
	$(current_dir)/do_work.sh
	
#chmod u+x ./do_work.sh
#curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
#curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh 
