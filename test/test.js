const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis();

  let wind = await ibis.get.windSpeed();

  let forecast = await ibis.get.forecast();

  console.log(wind);
  console.log(forecast);
  
  
  
}

testFunc().catch(console.error);
