const Ibis = require('../dist');
const fs = require('fs-extra');

async function myFunc() {
  const ibis = new Ibis({ exampleData: true });

  const forecast = await ibis.get.forecast();

  await fs.outputJson('./tmp/forecast.json', forecast, { spaces: 2 });
}

myFunc().catch(console.error);
