---
title: L.esri.Geocoding.GeocodeService
layout: documentation.hbs
---

# L.esri.Geocoding.GeocodeService

A basic wrapper for speaking to ArcGIS Online and ArcGIS Server geocoding services. Used internally by `L.esri.Geocoding.geosearch.`

### Constructor

<table>
    <thead>
        <tr>
            <th>Constructor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code class="nobr">L.esri.Geocoding.geocodeService({{{param 'Object' 'options'}}})</code></td>
            <td>Creates a new Geocoding service. You can pass in the `url` of a custom geocoding endpoint in the options if you do not want to use the ArcGIS Online World Geocoding service.</td>
        </tr>
    </tbody>
</table>

### Options

Accepts all options you can pass to [L.esri.Service](service.html). `Url` will refer to the [ArcGIS World Geocoder](https://developers.arcgis.com/en/features/geocoding/) by default but a custom geocoding service can also be used.

### Events

Fires all [L.esri.Service](service.html) events.

### Methods

<table>
    <thead>
        <tr>
            <th>Method</th>
            <td>Returns</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>geocode()</code></td>
            <td><code>`L.esri.Geocoding.geocode`</code></td>
            <td>Returns a new Geocode task bound to this server.</td>
        </tr>
        <tr>
            <td><code>suggest()</code></td>
            <td><code>`L.esri.Geocoding.suggest`</code></td>
            <td>Returns a new Suggest task bound to this server.</td>
        </tr>
        <tr>
            <td><code>reverse())</code></td>
            <td><code>`L.esri.Geocoding.reverseGeocode`</code></td>
            <td>Returns a new ReverseGeocode task bound to this server.</td>
        </tr>
    </tbody>
</table>
