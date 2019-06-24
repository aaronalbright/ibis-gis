import formatGIS from './_formatGIS';

export default function(shps, filterVal) {
  const gis = shps.filter(d => d.title.includes(filterVal));

  let r = /[A-Z]+\b/g;

  return gis.map(d => {
    let stormName = d.title.match(r);
    return {
      name: stormName[0],
      date: d.pubDate,
      fetchGIS: formatGIS(d)
    };
  });
}
