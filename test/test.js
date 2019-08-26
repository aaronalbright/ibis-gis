const Ibis = require('../dist');

async function testFunc() {
  const ibis = new Ibis();

  let foo = await ibis.get.forecast();

  console.log(foo);
  
  
}

testFunc().catch(console.error);
