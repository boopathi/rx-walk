.PHONY: build watch


build:
	babel src --out-dir lib --copy-files

watch:
	babel src --out-dir lib --watch --copy-files

test:
	babel-node tests/one.js
