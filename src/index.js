import fetch from 'node-fetch';
import shp from 'shpjs';
import parser from 'fast-xml-parser';

export default class Ibis {
  constructor({ name, basin = 'at', example = false }) {
    this.basin = basin;
    this.example = example;
    this.name = name;

    if (!this.name) {
      console.log('No storm name provided. Getting all active storms...');
    }
  }
  async forecast() {
    return this.getShp('Forecast')
  }
  async bestTrack() {
    return this.getShp('Preliminary Best Track');
  }
  async getShp(shpTitle) {
    const hurricaneFeed = await this.parseRSS();

    if (hurricaneFeed.length == 0 && this.name) {
      throw new Error(`No GIS data found for storm ${this.name.toUpperCase()}`)
    }
    
    const wantedGIS = hurricaneFeed.find(d => d.title.includes(shpTitle));

    const res = await fetch(wantedGIS.link);
    const buffer = await res.buffer();
    const geoJSON = await shp(buffer);

    return geoJSON;
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