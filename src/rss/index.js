import fetch from 'node-fetch';
import parser from 'fast-xml-parser';

export default async function(basin, example) {
  const feed = `https://www.nhc.noaa.gov/${
    example ? 'rss_examples/' : ''
  }gis-${basin}.xml`;

  const res = await fetch(feed);
  const xmlData = await res.text();

  const {rss}  = parser.parse(xmlData);
  
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

