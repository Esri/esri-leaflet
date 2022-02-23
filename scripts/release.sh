#!/bin/bash

# config
VERSION=$(node --eval "console.log(require('./package.json').version);")
NAME=$(node --eval "console.log(require('./package.json').name);")

# build and test
npm test || exit 1

# Integrity string and save to siteData.json
JS_INTEGRITY=$(cat dist/esri-leaflet.js | openssl dgst -sha512 -binary | openssl base64 -A)
echo "{\"name\": \"esri-leaflet\",\"version\": \"$VERSION\",\"lib\": {\"path\": \"dist/esri-leaflet.js\",\"integrity\": \"sha512-$JS_INTEGRITY\"}}" > dist/siteData.json

# checkout temp branch for release
git checkout -b gh-release

# force add files
git add dist -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# push commit so it exists on GitHub when we run gh-release
git push https://github.com/Esri/esri-leaflet gh-release

# create a ZIP archive of the dist files
zip -r $NAME-v$VERSION.zip dist

# run gh-release to create the tag and push release to github
gh-release --assets $NAME-v$VERSION.zip

# publish release on NPM
npm publish

# checkout master and delete release branch locally and on GitHub
git checkout master
git branch -D gh-release
git push https://github.com/Esri/esri-leaflet :gh-release
