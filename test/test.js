const Ibis = require('../dist');

async function getForecast() {
  const ibis = new Ibis({
    exampleData: true
  });

  const forecast = await ibis.get.forecast();

  console.log(forecast);
  

  const data = await forecast.fetchGIS();
  
}

getForecast().catch(console.error);
