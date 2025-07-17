import fs from 'fs';
import path from 'path';
import RSp from 'file:///usr/lib/node_modules/rsp-libcore.js/index.js'
import { AUTOSTART_DIR } from '../cli/utils.js';

const logger = new RSp.Logger(),
      exec = RSp.exec;

export default function () {

  try {

    const files = fs.readdirSync(AUTOSTART_DIR)
      .filter(file => file.endsWith('.desktop'))
      .sort();

    logger.head('Reindexing entries:', { breakdown: true });

    files.forEach((file, index) => {

      let cleaned = file.replace(/^\d+-/, "");

      const newName = `${String(index + 1).padStart(2, '0')}-${cleaned}`;
      const oldPath = path.join(AUTOSTART_DIR, file);
      const newPath = path.join(AUTOSTART_DIR, newName);
      
      if (cleaned !== newName) {
        fs.renameSync(oldPath, newPath);
        logger.success(`${cleaned} → ${newName}`);
      }
    })
  
  } catch (err) {
    console.error('Error reindexing entries:', err.message);
    process.exit(1);
  }
}