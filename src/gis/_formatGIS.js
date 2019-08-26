import fetch from 'node-fetch';
import shp from 'shpjs';

export default function({ link, pubDate }) {
  return async function() {
    console.log(link);
    
    const res = await fetch(link);
    const buffer = await res.buffer();

    let json = await shp(buffer);
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
