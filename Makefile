BABEL=./node_modules/.bin/babel

.PHONY: clean build watch

all: build

clean:
	rm -rf lib

build: clean
	${BABEL} src --out-dir lib --copy-files

watch: clean
	${BABEL} src --out-dir lib --watch --copy-files

test:
	babel-node tests/one.js
