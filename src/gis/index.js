import formatGIS from './_formatGIS';

export default function(shps, filterVal) {
  const gis = shps.filter(d => d.title.includes(filterVal));
  
  if (gis.length < 1) {
    throw new Error(
      `Shapefile: "${filterVal}" not found. It may not exist yet. Check https://www.nhc.noaa.gov/gis/ to ensure that it does.`
    );
  }
  
  // matches first word before a SPACE and (
  let r = /(\w+)(?= \()/g;

  return gis.map(d => {
    let stormName = d.title.match(r) || [undefined]
    // Ensures wind speed always fetched the polygon shapefile, not the point shapefile
    if (filterVal == 'Wind Speed Probabilities') {
      d.link = d.link.replace('halfDeg', '5km')
    }

      return {
        name: stormName[0],
        date: d.pubDate,
        fetchGIS: formatGIS(d)
      };
  });
}
