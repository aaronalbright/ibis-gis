# Ibis 🌀

According to legend, the ibis is the last sign of wildlife to take shelter before a hurricane hits and the first to reappear once the storm has passed.

This one gets hurricane GIS data from the [National Hurricane Center](https://www.nhc.noaa.gov/) in GeoJSON format.

**Requires Node 14 or higher**

## Why?

The NHC provides an easy-to-access RSS feed of its GIS products that are updated regularly during an active storm. This tool allows for automating the fetching process in addition to converting the `.shp` ZIP files into an array of GeoJSON FeatureCollections.

Ibis attempts to be as unopinionated as possible. It doesn't change any properties or names of the GIS data. It does not format times or time zones. It only assumes you want a specific shapefile.

It uses asynchronous functions to limit how often it has to download new files. You can frequently check shapefiles for updated data without downloading the file every time!

## Install

**npm**

```
npm install ibis-gis
```

**Yarn**

```
yarn add ibis-gis
```

## Usage

```js
import Ibis from 'ibis-gis';

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
  - `options.name <String>`: Get data for specific storm by name if it exists. Case insensitive.
  - `options.basin <String>`: Specify basin feed. Possible values: `at, ep, cp` for Atlantic, Eastern Pacific or Central Pacific, respectively. (Optional, default `'at'`)
  - `options.exampleData <Boolean>`: Fetch data from the example RSS feed for testing. (Optional, default `false`)

If no options are passed, it will fetch all active storms in the Atlantic basin.

#### Example

```js
import Ibis from 'ibis-gis';

async function getBestTrack() {
  // Example storm, known name
  const ibis = new Ibis({
    name: 'Andrea',
    exampleData: true,
  });

  const bestTrack = await ibis.get.bestTrack();
  /** returns 
   * {
      name: [String],
      date: [String],
      fetchGIS: [Function]
    }
  */

  const date = await bestTrack.date;
  // 'Thu, 06 Jun 2013 02:32:31 GMT'
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
  fileName: <String> - URL of the file from the RSS feed
  fetchGIS: <Function> @returns GeoJSON array of FeatureCollections
}
```

#### fetchGIS

Asynchronously fetches ZIP file from RSS feed and converts GeoJSON.

Returns `Promise<Object>`: Array of FeatureCollections with `fileName` and `pubData`.

#### Example

```js
async function myFunc() {
  // Active storm, Atlantic basin
  const ibis = new Ibis();

  const stormSurge = await ibis.get.stormSurge();

  const jsonData = await bestTrack.stormSurge();
  /** returns
   * { 
   *  type: 'FeatureCollection',
   *  features: [ [Object], [Object], ...],
   *  fileName: 'al012013_2013060706_gt5',
   *  pubDate: 'Thu, 06 Jun 2013 02:49:27 GMT' 
     }
  */
}
```

#### getAll

The same methods as **`get`**. Useful when more than one active storms are found. Methods will return an array containing objects for each storm.

Will also return `metaData` in the array containing storm summary objects.

#### Example

```js
async function myFunc() {
  // More than one active storm, East Pacific basin
  const ibis = new Ibis();

  const windField = await ibis.getAll.windField();

  const stormName = await windField[0].name; // 'Larry'

  const metaData = windField.metaData 
  /* 
  [
    {
      'nhc:center': '13.5, -34.2',
      'nhc:type': 'Hurricane',
      'nhc:name': 'Larry',
      'nhc:wallet': 'AT2',
      'nhc:atcf': 'AL122021',
      'nhc:datetime': '11:00 AM AST Thu Sep 2',
      'nhc:movement': 'W at 17 mph',
      'nhc:pressure': '985 mb',
      'nhc:wind': '80 mph',
      'nhc:headline': '...LARRY IS LARGER AND A BIT STRONGER... ...STEADY TO RAPID INTENSIFICATION LIKELY IN THE COMING DAYS...'
    }
  ]
  */
}
```

#### fetch

Custom fetch function. Ideal for fetching NHC URLs that may not be in the RSS feed. This is a convenience method for `fetchGIS()` with a `{pubdate: null}`.

Returns `Promise<Object>`: GeoJSON shapefile.

#### Example

```js
async function init() {
  const ibis = new Ibis();

  const forecast = await ibis.fetch(
    'https://www.nhc.noaa.gov/gis/forecast/archive/al122021_5day_latest.zip'
  );
  /* returns
  [{
    type: 'FeatureCollection',
    features: [ [Object] ],
    fileName: 'al122021-008_5day_lin',
    pubDate: null
  }, ...] 
  */
}
```
