build:
	rm -rf ./dist
	npm run build
start:
	npm start
install:
	npm install -g .
remove:
	npm remove -g galaxiat.serve.seo
refresh: remove install
publish: npm publish