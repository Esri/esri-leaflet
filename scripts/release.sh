#!/bin/bash

# config
VERSION=$(node --eval "console.log(require('./package.json').version);")
FILES=$(node --eval "console.log(require('./package.json').files.join(' '));")
NAME=$(node --eval "console.log(require('./package.json').name);")

# checkout temp branch for release
git checkout -b gh-release

# build and test
npm test || exit 1

npm run prepublish

# force add files
git add $FILES -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# create a ZIP archive of the dist files
zip -r dist/$NAME-v$VERSION.zip $FILES

# run gh-release to create the tag and push release to github
gh-release --assets $NAME-v$VERSION.zip --dry-run

# publish release on NPM
# npm publish

# checkout master and cleanup release branch
# git checkout master
# git branch -D gh-release
