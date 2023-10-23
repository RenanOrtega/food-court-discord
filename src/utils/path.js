import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace(/\\utils$/, '');

export function Files(folder) {
    const normalizedPath = path.join(__dirname, folder);
    return fs.readdirSync(normalizedPath).filter(file => file.endsWith('.js'));
}

export function Parse(file) {
    return path.parse(file);
}