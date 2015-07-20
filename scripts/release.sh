#!/bin/bash

# Get current version from package.json
VERSION=$(node --eval "console.log(require('./package.json').version);")

# Get a list of files to add form package.json
FILES=$(node --eval "console.log(require('./package.json').files.join(' '));")

# Checkout temp branch for release
git checkout -b gh-release

# Build and test
npm test || exit 1
npm run prepublish

# Force add files
git add $FILES -f

# Commit changes with a versioned commit message
git commit -m "build $VERSION"

# Create a ZIP archive of the dist files
zip -r ./dist/esri-leaflet-v$VERSION.zip $FILES

# Run gh-release to create the tag and push release to github
gh-release --assets ./dist/esri-leaflet-v$VERSION.zip

# Publish release on NPM
npm publish

# Checkout master and cleanup release branch
git checkout master
git branch -D gh-release
