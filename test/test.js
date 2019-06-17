const Ibis = require('../dist');
const fs = require('fs-extra');

const file = './.tmp/forecast.json'

async function myFunc() {
  const ibis = new Ibis({ exampleData: true });

  const forecast = await ibis.get.forecast();

  let advisoryDate = forecast[0].features[0].properties.ADVDATE;

  try {
    await fs.ensureFile(file)
  } catch (err) {
    console.error(err);
  }

  const lastForecast = await fs.readJSON(file, {throws: false});

  // Ensures advisory can be checked against itself
  let lastAdvisory;
  if (lastForecast != null) {
    lastAdvisory = lastForecast[0].features[0].properties.ADVDATE;
  }

  if (advisoryDate !== lastAdvisory) {
    console.log('Current file out of date. Writing current data to file..');
    await fs.outputJSON(file, forecast);
  } else {
    console.log('No new data. Closing...');
    process.exit();
  }

  // parse date to check if current file already has it. Use filenames maybe?
}

myFunc().catch(console.error);
