Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

### Before filing an issue

Please take a look at [previous issues](https://github.com/Esri/esri-leaflet/issues?labels=FAQ&milestone=&page=1&state=closed) that resolve common problems.

If you're just looking for help, you'll probably attract the most eyes if you post in [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-leaflet,leaflet) or the [Esri Leaflet place](https://geonet.esri.com/discussion/create.jspa?sr=pmenu&containerID=1841&containerType=700&tags=esri-leaflet,leaflet) on GeoNet.

If you think you're encountering a new bug, please feel free to log an [issue](https://github.com/Esri/esri-leaflet/issues/new) and include the steps to reproduce the problem (and preferably a running sample).

### I want to contribute, what should I work on?

There is a lot of room for contributions to Esri Leaflet. Make sure you checkout the [development instructions](https://github.com/Esri/esri-leaflet#development-instructions) in the readme to help you get started.

##### More examples

The Esri Leaflet website is written using http://assemble.io/ and can be found at https://github.com/Esri/esri-leaflet/tree/master/site/source. You can use the existing examples as a reference.

##### More tests

Esri Leaflet has a fairly comprehensive test suite built with [Mocha](http://visionmedia.github.io/mocha/), [Chai](http://chaijs.com/), [Sinon](http://sinonjs.org), [Karma](http://karma-runner.github.io/0.12/index.html) and [Grunt](http://gruntjs.com/). Tests can be found in at https://github.com/Esri/esri-leaflet/tree/master/spec.

You can run the tests with the `grunt karma:watch` to watch files and rerun test automatically and `grunt karma:coverage` (to generate a code coverage report.

##### Support for new services and layer types

support for new layer types and services are always needed.  The [plugin candidates](https://github.com/Esri/esri-leaflet/issues?labels=Plugin+Canidate&page=1&state=open) list is a good place to start.

### Can I publish my own Esri Leaflet plugins?

Of course! if you develop reusuable components for use with Esri Leaflet that you think would be helpful to share with other developers, please [file an issue](https://github.com/Esri/esri-leaflet/issues?state=open) so we discuss it.

### Setting up a dev environment

Make Sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
5. Install the dependencies with `npm install`
5. run `grunt` from the command line. This will start the web server locally at [http://localhost:8001](http://localhost:8001) and start watching the source files and running linting and testing commands.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Linting

Please make sure your changes pass JS Hint. This will help make sure code is consistant throguh out Esri Leaflet. You can run JS Hint with `grunt jshint`.

### Testing

Please make sure your changes dont break existing tests. Testing is essential for determining backward compatibility and catching breaking changes. You can run tests with `grunt karma:run`, `grunt karma:watch` or `grunt karma:coverage.`
