import mapValues from 'lodash/mapValues';

import parseRSS from './rss';
import fetchGIS from './gis';

const items = {
  forecast: 'Forecast',
  bestTrack: 'Preliminary Best Track',
  windField: 'Advisory Wind Field',
  stormSurge: 'Probabilistic Storm Surge 5ft'
};

const names = [
  'Andrea',
  'Barry',
  'Chantal',
  'Dorian',
  'Erin',
  'Fernand',
  'Gabrielle',
  'Humberto',
  'Imelda',
  'Jerry',
  'Karen',
  'Lorenzo',
  'Melissa',
  'Nestor',
  'Olga',
  'Pablo',
  'Rebekah',
  'Sebastien',
  'Tanya',
  'Van',
  'Wendy'
];

class Ibis {
  /**
   * Gets hurricane GIS data as geoJSON
   * @param {Object} [opts] - Options for getting data
   * @param {string}  [opts.name] - Name of storm to get GIS data. Must exist in NHC feed.
   * @param {string} [opts.basin] - Either 'at' for Atlantic or 'ep' for Eastern Pacific
   * @param {boolean} [opts.exampleData] - Used to get example active storm data
   */
  constructor({name, basin = 'at', exampleData = false } = {}) {
    this.name = name;
    this.basin = basin;
    this.example = exampleData;

  }

  find = filterVal => async () => {
    let shps = await parseRSS(this.basin, this.example);
    if (this.name) {
      shps = shps.filter(d => d.title.includes(this.name.toUpperCase()));
      console.log(shps.length);
    }
    const gis = shps.filter(d => d.title.includes(filterVal));

    let r = /[A-Z]+\b/g;

    if (gis.length === 1) {
      let stormName = gis[0].title.match(r);
      return {
        name: stormName[0],
        date: gis[0].pubDate,
        fetchGIS: fetchGIS(gis[0])
      };
    } else {
      return gis.map(d => {
        let stormName = d.title.match(r);
        return {
          name: stormName[0],
          date: d.pubDate,
          fetchGIS: fetchGIS(d)
        };
      });
    }
  };

  get = mapValues(items, m => this.find(m));
}

module.exports = Ibis;
