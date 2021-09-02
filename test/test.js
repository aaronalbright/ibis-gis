const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis();

  const forecast = await ibis.getAll.forecast();

  console.log(forecast);
}

testFunc().catch(console.error);
