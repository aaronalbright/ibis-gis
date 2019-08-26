const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis();

  let custom = await ibis.fetch(
    'https://www.nhc.noaa.gov/gis/forecast/archive/al052019_fcst_latest.zip'
  );

  console.log(custom);
  
}

testFunc().catch(console.error);
