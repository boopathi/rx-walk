.PHONY: clean build watch

all: build

clean:
	rm -rf lib

build: clean
	babel src --out-dir lib --copy-files

watch: clean
	babel src --out-dir lib --watch --copy-files

test:
	babel-node tests/one.js
