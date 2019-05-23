const Ibis = require('./src/index');
const fs = require('fs-extra');

async function myFunc() {
  const ibis = new Ibis({ example: true });

  const forecast = await ibis.shp.forecast();
  const bestTrack = await ibis.shp.bestTrack();

  await fs.outputJson('./tmp/forecast.json', forecast, { spaces: 2 });
  await fs.outputJson('./tmp/bestTrack.json', bestTrack, { spaces: 2 });
}

myFunc().catch(console.error);
