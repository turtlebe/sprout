const fs = require('fs');

const { parse } = require('csv-parse');

const inputPath = './data.csv';

/**
 * This node script generates three JSON objects: damage, seriousDamage, and extremeDamage,
 * which are used in the postharvest QA settings page.
 * These objects contain the pass/fail thresholds for leaf damage.
 * The related ticket is: https://plentyag.atlassian.net/browse/SD-25990
 * The script takes in a CSV file from this spreadsheet:
 * https://docs.google.com/spreadsheets/d/1JaSkThbVAx35_9VhkFjtycl5ijDMkYK8h1h3LtqgYgo/edit#gid=0
 *
 * The CSV file should have 14 columns:
 * 1. Crop
 * 2. SKU
 * 3. Damage Min Pass
 * 4. Damage Max Pass
 * 5. Damage Min Fail
 * 6. Damage Max Fail
 * 7. Serious Damage Min Pass
 * 8. Serious Damage Max Pass
 * 9. Serious Damage Min Fail
 * 10. Serious Damage Max Fail
 * 11. Extreme Damage Min Pass
 * 12. Extreme Damage Max Pass
 * 13. Extreme Damage Min Fail
 * 14. Extreme Damage Max Fail
 *
 * To run this script:
 * 1. replace data.csv with the CSV file you want to use.
 * 2. run `node generate-ph-qa-settings.js`
 * console.log will print the three JSON objects.
 */
const damage = {
  choicethresholds: [],
  required: true,
};
const seriousDamage = {
  choicethresholds: [],
  required: true,
};
const extremeDamage = {
  choicethresholds: [],
  required: true,
};

function addChoiceThresholds({ sku, category, isPass, min, max }) {
  const minNum = Number.parseInt(min, 10);
  const maxNum = Number.parseInt(max, 10);
  category.choicethresholds.push({
    discriminate: {
      skuvalue: sku,
      skukey: 'name',
      validation: {
        min: typeof minNum === 'number' ? minNum : 0,
        max: typeof maxNum === 'number' ? maxNum : 0,
      },
    },
    value: isPass ? 'PASS' : 'FAIL',
  });
}

function main() {
  fs.readFile(inputPath, function (err, fileData) {
    parse(fileData, { columns: false, trim: true }, function (err, rows) {
      rows.forEach((row, index) => {
        // skip first row since it is the header.
        if (index > 0) {
          const sku = row[1];

          const damageMinPass = row[2];
          const damageMaxPass = row[3];
          const damageMinFail = row[4];
          const damageMaxFail = row[5];
          addChoiceThresholds({
            sku,
            category: damage,
            isPass: true,
            min: damageMinPass,
            max: damageMaxPass,
          });
          addChoiceThresholds({
            sku,
            category: damage,
            isPass: false,
            min: damageMinFail,
            max: damageMaxFail,
          });

          const seriousDamageMinPass = row[6];
          const seriousDamageMaxPass = row[7];
          const seriousDamageMinFail = row[8];
          const seriousDamageMaxFail = row[9];
          addChoiceThresholds({
            sku,
            category: seriousDamage,
            isPass: true,
            min: seriousDamageMinPass,
            max: seriousDamageMaxPass,
          });
          addChoiceThresholds({
            sku,
            category: seriousDamage,
            isPass: false,
            min: seriousDamageMinFail,
            max: seriousDamageMaxFail,
          });

          const extremeDamageMinPass = row[10];
          const extremeDamageMaxPass = row[11];
          const extremeDamageMinFail = row[12];
          const extremeDamageMaxFail = row[13];
          addChoiceThresholds({
            sku,
            category: extremeDamage,
            isPass: true,
            min: extremeDamageMinPass,
            max: extremeDamageMaxPass,
          });
          addChoiceThresholds({
            sku,
            category: extremeDamage,
            isPass: false,
            min: extremeDamageMinFail,
            max: extremeDamageMaxFail,
          });
        }
      });

      console.log('damage:');
      console.log(JSON.stringify(damage, null, 2));

      console.log('\nseriousDamage:');
      console.log(JSON.stringify(seriousDamage, null, 2));

      console.log('extremeDamage:');
      console.log(JSON.stringify(extremeDamage, null, 2));
    });
  });
}

main();
