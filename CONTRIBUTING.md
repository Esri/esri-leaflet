Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

### Before filing an issue

Please take a look at [previous issues](https://github.com/Esri/esri-leaflet/issues?labels=FAQ&milestone=&page=1&state=closed) that resolve common problems.

If you're just looking for help, you'll probably attract the most eyes if you post in [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-leaflet,leaflet) or the [Esri Leaflet Community](https://community.esri.com/t5/esri-leaflet/ct-p/esri-leaflet) on GeoNet.

If you think you're encountering a new bug, please feel free to log an [issue](https://github.com/Esri/esri-leaflet/issues/new) and include the steps to reproduce the problem (and preferably a running sample).

**Please include the following in your issue:**

* Browser
* Browser version
* Leaflet version `L.version`
* Esri Leaflet version `L.esri.VERSION`
* Bundling tool (webpack, browserify, Require JS) if any

### I want to contribute, what should I work on?

There is a lot of room for contributions to Esri Leaflet. Make sure you check out the [development instructions](https://github.com/Esri/esri-leaflet#development-instructions) in the readme to help you get started.

##### More samples

If you'd like to add an additional sample to the Esri Leaflet documentation, [let us know by creating an issue in this repository](https://github.com/Esri/esri-leaflet/issues/new?assignees=&labels=Documentation&template=documentation.yml).

##### More tests

Esri Leaflet has a fairly comprehensive test suite built with [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), [Sinon](https://sinonjs.org/), and [Karma](https://karma-runner.github.io/). The tests can be found in the [`spec` folder](https://github.com/Esri/esri-leaflet/tree/master/spec).

You can run the tests with `npm test`.

##### Support for new services and layer types

Support for new layer types and services are always needed.  The [plugin candidates](https://github.com/Esri/esri-leaflet/issues?labels=Plugin+Candidate&page=1&state=open) list is a good place to start.

### Can I publish my own Esri Leaflet plugins?

Of course! If you develop reusable components for use with Esri Leaflet that you think would be helpful to share with other developers, please [file an issue](https://github.com/Esri/esri-leaflet/issues?state=open) so we can discuss it.

### Setting up a dev environment

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
3. Install the [`package.json`](https://github.com/Esri/esri-leaflet/blob/master/package.json#L14-L49) dependencies by running `npm install`
4. In order to compile/minify the source code of the API in a newly created `dist` folder, run `npm run build`.
5. If you'd like to debug interactively, run `npm start`. This will start the web server at [http://localhost:5000](http://localhost:5000) and start watching the raw source for changes.
6. [http://localhost:5000/debug/sample.html](http://localhost:5000/debug/sample.html) is a demo app that you can use to get the lay of the land.
7. If you'd like to share your changes, just create a [pull request](https://help.github.com/articles/creating-a-pull-request)

If you'd like to build the Esri Leaflet website locally, make sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

### Linting

Please make sure your changes pass JS Hint. This will help make sure code is consistent throughout Esri Leaflet. After installing the node dependencies for this project you can run `npm run lint` so that `semistandard` can make sure all is well.

### Testing

Please make sure your changes don't break existing tests. Testing is essential for determining backward compatibility and catching breaking changes. You can run tests with `npm test` (or `npm t`, or `npm run test` if you're not into the whole brevity thing).
