const Ibis = require('../dist');

async function getForecast() {
  const ibis = new Ibis({
    basin: 'ep'
  });

  const stormSurge = await ibis.get.forecast();
  console.log(stormSurge);
}

getForecast().catch(console.error);
