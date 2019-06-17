
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
import Ibis from 'node-ibis'

async function getBestTrack() {
  const ibis = new Ibis();

  const bestTrack = await ibis.get.bestTrack();
}
```

## API

*Coming soon*

## Using the data (definitions)

*Coming soon*


[1]: https://www.nhc.noaa.gov/