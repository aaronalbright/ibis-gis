const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis({name: 'Isaias'});

  let wind = await ibis.get.windField();

  console.log(wind);

}

testFunc().catch(console.error);
