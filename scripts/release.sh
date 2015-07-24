#!/bin/bash

# config
VERSION=$(node --eval "console.log(require('./package.json').version);")
FILES=$(node --eval "console.log(require('./package.json').files.join(' '));")
NAME=$(node --eval "console.log(require('./package.json').name);")

# build and test
npm test || exit 1

# checkout temp branch for release
git checkout -b gh-release

# run prepublish to build files
npm run prepublish

# force add files
git add $FILES -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# push commit so it exists on GitHub when we run gh-release
git push upstream gh-release

# create a ZIP archive of the dist files
zip -r dist/$NAME-v$VERSION.zip $FILES

# run gh-release to create the tag and push release to github
gh-release --assets $NAME-v$VERSION.zip

# publish release on NPM
npm publish

# checkout master and delete release branch locally and on GitHub
git checkout master
git branch -D gh-release
git push upstream :gh-release
