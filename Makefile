.PHONY: build deploy clean serve

build:
	zola build

deploy: build
	git add -f out && git commit -m "Deploy"
	# If this doesn't work, do `git checkout -b gh-pages && git push -u origin HEAD`
	git push origin `git subtree split --prefix out`:gh-pages --force

serve:
	zola serve

clean:
	rm -rf public
