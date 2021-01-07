export default async function getDatabaseData() {
  const database = import('../../database/data.json');
  return database;
}
