const fetch = require('node-fetch');
const fs = require('fs-extra');
const shp = require('shpjs');
const parser = require('fast-xml-parser');

const url =
  'http://www.nhc.noaa.gov/gis/forecast/archive/al012013_5day_002.zip';

const file = './data/forecast.json';

class Ibis {
  constructor() {}
  async getForecast(shape) {
    const res = await fetch(url);
    const buffer = await res.buffer();
    const geoJSON = await shp(buffer);

    return geoJSON.filter(d => d.fileName === `al012013.002_5day_${shape}`);
  }
}

// async function readEach() {
// const ibis = new Ibis();

// // Returns forecast for active storm in geoJSON format.
// // If no active storms, returns "No active storms"
// let [forecast] = await ibis.getForecast('lin');

// await fs.outputJson(file, forecast, {spaces: 2})
// }

fetch('https://www.nhc.noaa.gov/rss_examples/gis-at.xml')
  .then(res => res.text())
  .then(xml => {
    let { rss } = parser.parse(xml);

    let items = rss.channel.item;

    let wanted = ['Forecast [shp]', 'Preliminary Best Track [shp]'];

    let found = [];

    for (let each of wanted) {
        found.push(items.find(d => d.title.includes(each)))
    }
    

    console.log(found);
    

  })
  .catch(console.error);
