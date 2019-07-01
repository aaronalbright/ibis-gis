import formatGIS from './_formatGIS';

export default function(shps, filterVal) {
  const gis = shps.filter(d => d.title.includes(filterVal));

  // matches first word before a SPACE and (
  let r = /(\w+)(?= \()/g;

  return gis.map(d => {
    let stormName = d.title.match(r);
    return {
      name: stormName[0],
      date: d.pubDate,
      fetchGIS: formatGIS(d)
    };
  });
}
