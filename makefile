build:
	rm -rf ./dist
	npm run build
start:
	npm start
install:
	npm install -g .

install_deps:
	npm install
remove:
	npm remove -g galaxiat.serve.seo
refresh: remove install
publish: 
	npm publish