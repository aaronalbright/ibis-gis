const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis();

  let forecast = await ibis.getAll.windField();

  // let bestTrack = await ibis.getAll.bestTrack();

  const data = await forecast[0];

  console.log(data);
}

testFunc().catch(console.error);
