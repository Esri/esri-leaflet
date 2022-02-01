const ssri = require('ssri');
const fs = require('fs');
const fetch = require('node-fetch');

/**
 * The packages that will be included in the output.
 */
const packages = [
  {
    name: 'leaflet',
    libPath: 'dist/leaflet.js',
    cssPaths: ['dist/leaflet.css']
  },
  {
    name: 'esri-leaflet',
    libPath: 'dist/esri-leaflet.js'
  },
  {
    name: 'esri-leaflet-geocoder',
    libPath: 'dist/esri-leaflet-geocoder.js',
    cssPaths: ['dist/esri-leaflet-geocoder.css']
  },
  {
    name: 'esri-leaflet-vector',
    libPath: 'dist/esri-leaflet-vector.js'
  },
  {
    name: 'esri-leaflet-gp',
    libPath: 'dist/esri-leaflet-gp.js'
  },
  {
    name: 'esri-leaflet-renderers',
    libPath: 'dist/esri-leaflet-renderers.js'
  },
  {
    name: 'leaflet.markercluster',
    libPath: 'dist/leaflet.markercluster.js',
    cssPaths: ['dist/MarkerCluster.css', 'dist/MarkerCluster.Default.css']
  },
  {
    name: 'esri-leaflet-cluster',
    libPath: 'dist/esri-leaflet-cluster.js'
  },
  {
    name: 'esri-leaflet-heatmap',
    libPath: 'dist/esri-leaflet-heatmap.js'
  }
];

/**
 * Calls the NPM API to get the most recent package version number.
 *
 * @param {string} packageName - the npm package name slug
 * @returns version number (string)
 */
const getLatestVersion = async (packageName) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const data = await response.json();

  return data['dist-tags']['latest'];
};

/**
 * Gets the integrity string for a file at a particular URL.
 *
 * @param {string} url - the URL of the file to get the integrity string
 * @returns string
 */
const getIntegrity = async (url) => {
  const response = await fetch(url);

  const integrity = await ssri.fromStream(response.body);
  return integrity.toString();
};

/**
 * Gets all the information for a package
 * @param {string} name - the package name
 * @param {string} libPath - the path in dist files to the main library file
 * @param {string[]} cssPaths - the paths in the dist files to the css files
 * @returns object
 */
const getPackageInfo = async (name, libPath, cssPaths) => {
  const version = await getLatestVersion(name);
  const retInfo = {
    name,
    version
  };

  if (libPath) {
    retInfo.lib = {};
    retInfo.lib.url = `https://unpkg.com/${name}@${version}/${libPath}`;
    retInfo.lib.integrity = await getIntegrity(retInfo.lib.url);
  }

  if (cssPaths) {
    retInfo.css = await Promise.all(
      cssPaths.map(async (path) => {
        const retObj = {};
        retObj.url = `https://unpkg.com/${name}@${version}/${path}`;
        retObj.integrity = await getIntegrity(retObj.url);
        return retObj;
      })
    );
  }

  return retInfo;
};

/**
 * The main entry point - gets all the package info and
 * writes it to siteData.json.
 */
const main = async () => {
  const infos = await Promise.all(
    packages.map(async (packageInfo) => {
      return await getPackageInfo(
        packageInfo.name,
        packageInfo.libPath,
        packageInfo.cssPaths
      );
    })
  );

  fs.writeFileSync('siteData.json', JSON.stringify(infos, null, 2));
};

main();
