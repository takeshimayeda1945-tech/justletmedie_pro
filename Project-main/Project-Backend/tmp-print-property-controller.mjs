import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const filePath = path.join(process.cwd(), 'src/controllers/propertyControllers.js');
console.log('PATH', filePath);
console.log('CONTENT');
console.log(fs.readFileSync(filePath, 'utf8'));
