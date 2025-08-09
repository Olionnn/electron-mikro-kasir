import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};

const files = fs.readdirSync(__dirname).filter(file =>
  file.endsWith('.js') && file !== 'index.js' && file !== 'contoh.js'
);

for (const file of files) {
  const { default: model } = await import(path.join(__dirname, file));
  models[model.name] = model;
}
console.log('✅ Models loaded:', Object.keys(models).join(', '));



export { db };
export default models;
