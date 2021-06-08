'use strict';

var mapValues = require('lodash/mapValues');
var fetch = require('node-fetch');
var parser = require('fast-xml-parser');
var shp = require('shpjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var mapValues__default = /*#__PURE__*/_interopDefaultLegacy(mapValues);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var parser__default = /*#__PURE__*/_interopDefaultLegacy(parser);
var shp__default = /*#__PURE__*/_interopDefaultLegacy(shp);

async function parseRSS(basin, example) {
  const feed = `https://www.nhc.noaa.gov/${
    example ? 'rss_examples/' : ''
  }gis-${basin}.xml`;

  const res = await fetch__default['default'](feed);
  const xmlData = await res.text();

  const {rss}  = parser__default['default'].parse(xmlData);
  
  let items = rss.channel.item;

  // Throws when the feed only has one result (no GIS products)
  // Usually, this is for off-season or when there are no active storms
  if (!items.length) {
    console.log(`Only one item found in feed: "${items.title}"`);
    throw new Error('No active storms found');
  }

  let shps = items.filter(d => d.title.includes('[shp]') || d.title.includes('Summary'));
  
  return shps
}

function formatGIS({ link, pubDate }) {
  return async function() {
    const res = await fetch__default['default'](link);
    const buffer = await res.buffer();

    let json = await shp__default['default'](buffer);
    if (json.length) {
      return json.map(d => ({
        ...d,
        pubDate: pubDate
      }));
    } else {
      json.pubDate = pubDate;
      return json;
    }
  };
}

function fetchData(shps, filterVal, name) {
  let gis;

  if (name && filterVal !== 'Wind Speed Probabilities') {
    gis = shps.filter(d => d.title.toLowerCase().includes(name) && d.title.includes(filterVal));
  } else {
    gis = shps.filter(d => d.title.includes(filterVal));
  }
  
  if (gis.length < 1) {
    if (filterVal == 'Forecast') {
      let arr = shps.filter(d => d.title.includes('Summary'));
      console.log(arr);
      gis = [
        {
          name: name,
          date: arr[0].pubDate
        }
      ];
      console.log(gis);
    }
    throw new Error(
      `Shapefile: "${filterVal}" not found for storm "${name}". It may not exist yet. Check https://www.nhc.noaa.gov/gis/ to ensure that it does.`
    );
  }
  
  // matches first word before a SPACE and (
  let r = /(\w+)(?= \()/g;

  return gis.map(d => {
    let stormName = d.title.match(r) || [undefined];
    // Ensures wind speed always fetched the polygon shapefile, not the point shapefile
    if (filterVal == 'Wind Speed Probabilities') {
      d.link = d.link.replace('halfDeg', '5km');
      stormName = ['Wind Speed Probabilities'];
    }

    // Always fetches latest Wind Field
    if (filterVal == 'Wind Field') {
      d.link = d.link.replace(/(\d+).zip/, 'latest.zip');
    } 

      return {
        name: stormName[0],
        date: d.pubDate,
        fileName: d.link,
        fetchGIS: formatGIS(d)
      };
  });
}

// filter methods mapped to `ibis.get`
const items = {
  forecast: 'Forecast',
  windSpeed: 'Wind Speed Probabilities',
  bestTrack: 'Preliminary Best Track',
  windField: 'Wind Field',
  stormSurge: 'Probabilistic Storm Surge 5ft'
};

/**
 * Gets hurricane GIS data as geoJSON
 * @param {Object} options
 * @param {String}  [options.name] - Optionally get data for specific storm by name if it exists
 * @param {String} [options.basin=at] - Specify basin
 * @param {Boolean} [options.exampleData=false] - Used to get active storm data from example RSS feed
 */
class Ibis {
  constructor({ name, basin = 'at', exampleData = false } = {}) {
    this.name = name;
    this.basin = basin;
    this.example = exampleData;
  }

  init = (filterVal, all) => {
    return async () => {
      let shps = await parseRSS(this.basin, this.example);
      let name = this.name ? this.name.toLowerCase() : undefined;

      let data = fetchData(shps, filterVal, name);

      return all ? data : data[0];
    };
  };

  get = mapValues__default['default'](items, m => this.init(m, false));
  getAll = mapValues__default['default'](items, m => this.init(m, true));

  /**
   * Custom fetch when RSS doesn't have current URL
   */

  async fetch(url) {
    return await formatGIS({ link: url, pubDate: null })();
  }
}

module.exports = Ibis;
