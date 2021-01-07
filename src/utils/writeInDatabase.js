import fs from 'fs';
import path from 'path';

export default async function writeInDatabase(databaseData) {
  const root = path.dirname(require.main.filename);
  fs.writeFileSync(`${root}/../database/data.json`, JSON.stringify(databaseData), 'utf8', (err) => {
    if (err) {
      console.log(err);
    }
  });
}
