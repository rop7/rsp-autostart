import fs from 'fs';
import path from 'path';
import RSp from 'file:///usr/lib/node_modules/rsp-libcore.js/index.js'
import { AUTOSTART_DIR, isValidDesktopFile } from '../cli/utils.js';

const logger = new RSp.Logger(),
      exec = RSp.exec;

export default function () {

  try {
  
    const fileindex = process.argv[3];
    const entries = fs.readdirSync(AUTOSTART_DIR);
    const entry = entries.find(entry => entry.includes(fileindex));

    if (!entry) {
      logger.error('Entry not found', { breakup: true });
      process.exit(1);
    }

    const filePath = path.join(AUTOSTART_DIR, entry)
    const content = fs.readFileSync(filePath, 'utf8');

    // logger.debug({ fileindex, entries })

    if (isValidDesktopFile(content)) {
      logger.success(`${entry} is a valid .desktop file`, {breakup: true});
    } else {
      logger.error(`${entry} is NOT a valid .desktop file`, {breakup: true});
      process.exit(1);
    }
  
  } catch (err) {
    console.error('Validation error:', err.message);
    process.exit(1);
  }
}