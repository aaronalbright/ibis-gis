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
  
  return items.filter(d => d.title.includes('[shp]'));
}

