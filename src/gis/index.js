import fetch from 'node-fetch';
import shp from 'shpjs';

export default function({ link, pubDate }) {
  return async function() {
    const res = await fetch(link);
    const buffer = await res.buffer();
    const json = await shp(buffer);
    return json.map(d => ({
      ...d,
      pubDate: pubDate
    }));
  };
}
