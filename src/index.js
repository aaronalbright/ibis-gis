import mapValues from 'lodash/mapValues';

import parseRSS from './rss';
import fetchData from './gis';

// filter methods mapped to `ibis.get`
const items = {
  forecast: 'Forecast',
  bestTrack: 'Preliminary Best Track',
  windField: 'Advisory Wind Field',
  stormSurge: 'Probabilistic Storm Surge 5ft'
};

/**
   * Gets hurricane GIS data as geoJSON
   * @param {object} [options]
   * @param {String}  [options.name] - Optionally get data for specific storm by name if it exists
   * @param {String} [options.basin=at] - Specify basin
   * @param {Boolean} [options.exampleData=false] - Used to get active storm data from example RSS feed
   */
class Ibis {
  constructor({ name, basin = 'at', exampleData = false }) {
    this.name = name;
    this.basin = basin;
    this.example = exampleData;
  }

  init = filterVal => {
    return async () => {
      let shps = await parseRSS(this.basin, this.example);
      if (this.name) {
        let name = this.name.toUpperCase();
        shps = shps.filter(d => d.title.includes(name));
        if (shps.length < 1) {
          throw new Error(`${name} does not exist in the active storms feed.`);
        }
      }

      let data = fetchData(shps, filterVal);
      
      // No array when only one storm to simply output
      if (data.length == 1) {
        data = data[0]
      }
      
      return data;
    };
  };
  
  get = mapValues(items, m => this.init(m));
}

module.exports = Ibis;
