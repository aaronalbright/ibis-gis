const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis({exampleData: true});

  let wind = await ibis.get.forecast();

  console.log(wind);

}

testFunc().catch(console.error);
