import formatGIS from './_formatGIS';

const fileRef = {
  forecast: 'Forecast',
  windSpeed: 'Wind Speed Probabilities',
  bestTrack: 'Preliminary Best Track',
  windField: 'Wind Field',
  stormSurge: 'Probabilistic Storm Surge 5ft'
}

export default function(shps, filterVal, name) {
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
      ]
      console.log(gis);
    }
    throw new Error(
      `Shapefile: "${filterVal}" not found for storm "${name}". It may not exist yet. Check https://www.nhc.noaa.gov/gis/ to ensure that it does.`
    );
  }
  
  // matches first word before a SPACE and (
  let r = /(\w+)(?= \()/g;

  return gis.map(d => {
    let stormName = d.title.match(r) || [undefined]
    // Ensures wind speed always fetched the polygon shapefile, not the point shapefile
    if (filterVal == 'Wind Speed Probabilities') {
      d.link = d.link.replace('halfDeg', '5km')
      stormName = ['Wind Speed Probabilities'];
    }

    // Always fetches latest Wind Field
    if (filterVal == 'Wind Field') {
      d.link = d.link.replace(/(\d+).zip/, 'latest.zip')
    } 

      return {
        name: stormName[0],
        date: d.pubDate,
        fileName: d.link,
        fetchGIS: formatGIS(d)
      };
  });
}
