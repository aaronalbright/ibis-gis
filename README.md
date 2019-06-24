# Ibis 🌀

According to legend, the ibis is the last sign of wildlife to take shelter before a hurricane hits and the first to reappear once the storm has passed.

This one gets hurricane GIS data from the [National Hurricane Center](https://www.nhc.noaa.gov/) in GeoJSON format.

## Why? 

The NHC provides an easy-to-access RSS feed of its GIS products that are updated regularly during an active storm. This tool allows for automating the fetching process in addition to converting the `.shp` ZIP files into an array of GeoJSON FeatureCollections.

Ibis attempts to be as unopinionated as possible. It doesn't change any properties or names of the GIS data. It does not format times or time zones. It only assumes you want a specific shapefile.

It uses asynchronous functions to limit how often it has to download new files. You can frequently check shapefiles for updated data without downloading the file every time!

## Install
__npm__
```
npm install node-ibis
```
__Yarn__
```
yarn add node-ibis
```

## Usage

```js
import Ibis from 'node-ibis'

async function getForecast() {
  const ibis = new Ibis();
 
  const forecast = await ibis.get.forecast(); 

  const data = await forecast.fetchGIS();
}
```

## API

### Ibis

#### Parameters

- `options <Object>`
  - `options.name <String>`: Optionally get data for specific storm by name if it exists. Case insensitive.
  - `options.basin <String>`: Specify basin feed. Possible values: `at, ep, cp` for Atlantic,  Eastern Pacific or Central Pacific, respectively. (Optional, default `'at'`)
  - `options.exampleData <Boolean>`: Fetch data from the example RSS feed for testing. (Optional, default `false`)

If no options are passed, it will fetch all active storms in the Atlantic basin.

#### Example

```js
import Ibis from 'node-ibis'

async function getBestTrack() {
  // Example storm, known name
  const ibis = new Ibis({
    name: 'Andrea',
    exampleData: true
  });

  const bestTrack = await ibis.get.bestTrack();
  /** returns 
   * {
      name: [String],
      date: [String],
      fetchGIS: [Function]
    }
  */

  const data = await bestTrack.fetchGIS();
}
```

#### get

Gets shapefile matching the selected method of the first (or only) storm.

All methods are asynchronous.

**Methods**
- `forecast()`: Forecast Track, Cone of Uncertainty, Watches/Warnings.
- `bestTrack()`: Track, Points, and Wind Swath.
- `windField()`: Initial and Forecast Surface Winds.
- `stormSurge()`: Probabilistic Storm Surge 5ft

Returns `Promise<Object>`:
```
{
  name: <String> - Storm name for the shapefile,
  date: <String> - Last published date for the shapefile
  fetchGIS: <Function> @returns GeoJSON array of FeatureCollections
}
```

#### fetchGIS
Asynchronously fetches ZIP file from RSS feed and converts GeoJSON.

Returns `Promise<Object>`: Array of FeatureCollections with `fileName` and `pubData`.

#### Example
```js
async function getStormSurge() {
  // Active storm, Atlantic basin
  const ibis = new Ibis();

  const bestTrack = await ibis.get.stormSurge();

  const jsonData = await bestTrack.fetchGIS();
  /** returns GeoJSON array of FeatureCollections:
   * [ 
      { type: 'FeatureCollection',
      features: [ [Object], [Object] ],
      fileName: 'al012013.002_5day_lin',
      pubDate: 'Thu, 06 Jun 2013 02:32:31 GMT' },
      { type: 'FeatureCollection',
      features: [ [Object], [Object] ],
      fileName: 'al012013.002_5day_pgn',
      pubDate: 'Thu, 06 Jun 2013 02:32:31 GMT' },
      ...
    ]
  */
}
```

#### getAll

The same methods as **`get`**. Useful when more than one active storms are found. Methods will return an array containing objects for each storm.
#### Example
```js
async function myFunc() {
  // More than one active storm, East Pacific basin
  const ibis = new Ibis({
    basin: 'ep'
  });

  const bestTrack = await ibis.getAll.stormSurge();

  const publishDate = await bestTrack[1].date;
}
```