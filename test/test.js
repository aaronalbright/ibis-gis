const Ibis = require('../dist');

async function getForecast() {
  const ibis = new Ibis({
    exampleData: true
  });

  const stormSurge = await ibis.get.stormSurge();
  console.log(stormSurge);
  
  const data = await stormSurge.fetchGIS();
  console.log(data);
}

getForecast().catch(console.error);
