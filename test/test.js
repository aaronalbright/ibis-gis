const Ibis = require('../dist');
const fs = require('fs-extra');

const file = './.tmp/forecast.json';

async function myFunc() {
  const ibis = new Ibis({ exampleData: true });

  let forecast = await ibis.get.forecast();

  let gis = await forecast.fetchGIS();

  await fs.outputJSON(file, gis, {spaces: 2});

}

myFunc().catch(console.error);
