
# WORK IN PROGRESS DOC

# Ibis

According to legend, the ibis is the last sign of wildlife to take shelter before a hurricane hits and the first to reappear once the storm has passed.

This one gets hurricane GIS data from the [National Hurricane Center](1) in geoJSON format.



## Install
```
npm install node-ibis
```

## Usage

```js
const Ibis = require('node-ibis')

async function getBestTrack() {
  const ibis = new Ibis();

  const data = await ibis.shp.bestTrack();
}

```

## API

*Coming soon*


[1]: https://www.nhc.noaa.gov/