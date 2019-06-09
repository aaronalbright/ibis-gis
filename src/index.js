import fetch from 'node-fetch';
import shp from 'shpjs';
import parser from 'fast-xml-parser';

export default class Ibis {
  constructor({ name, basin = 'at', exampleData = false }) {
    this.basin = basin;
    this.example = exampleData;
    this.name = name;
    this.get = {};

    const items = {
      forecast: 'Forecast',
      bestTrack: 'Preliminary Best Track',
      windField: 'Advisory Wind Field',
      stormSurge: 'Probabilistic Storm Surge 5ft'
    };

    if (!this.name) {
      console.log('No storm name provided. Getting all active storms...');
    } else {
      console.log(`Looking for GIS files for storm ${this.name}...`);
    }

    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        this.get[key] = () => this.geoJSON(items[key]);
      }
    }

  }
  async geoJSON(shpTitle) {
    const hurricaneFeed = await this.parseRSS();

    if (hurricaneFeed.length == 0 && this.name) {
      throw new Error(`No GIS data found for storm ${this.name.toUpperCase()}`);
    }

    const wantedGIS = hurricaneFeed.find(d => d.title.includes(shpTitle));

    const res = await fetch(wantedGIS.link);
    const buffer = await res.buffer();
    const json = await shp(buffer);

    return json;
  }
  async parseRSS() {
    const feed = `https://www.nhc.noaa.gov/${
      this.example ? 'rss_examples/' : ''
    }gis-${this.basin}.xml`;

    const res = await fetch(feed);
    const xmlData = await res.text();

    // Destructure to simplify output
    const { rss } = parser.parse(xmlData);

    let items = rss.channel.item;

    // Returns all shapefile links unless storm name is provided
    // All shapefiles are always parsed so the user can decide which ones they want downloaded
    return items.filter(d => {
      if (this.name) {
        return (
          d.title.includes('[shp]') && d.title.includes(this.name.toUpperCase())
        );
      } else {
        return d.title.includes('[shp]');
      }
    });
  }
}
