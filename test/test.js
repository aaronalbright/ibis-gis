const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis();

  const data = await ibis.get.stormSurge();
  console.log(data);

  const gis = await data.fetchGIS();
  console.log(gis);
  
}

testFunc().catch(console.error);
