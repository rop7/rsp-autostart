import fs from 'fs';
import RSp from '@ropsoft/rsp-libcore.js'
import { AUTOSTART_DIR } from '../bin/utils.js';

const logger = new RSp.Logger();

export default function listEntries() {

  try {
  
    if (!fs.existsSync(AUTOSTART_DIR)) {
      logger.error('Autostart directory does not exist');
      return;
    }

    const files = fs.readdirSync(AUTOSTART_DIR)
      .filter(file => file.endsWith('.desktop'))
      .sort();

    if (files.length === 0) {
      logger.error('No autostart entries found');
      return;
    }

    // console.log('Autostart entries:');
    logger.head('Listing autostart entries:', { breakdown: true });

    files.forEach(file => logger.echo(`${file}`));
  
  } catch (err) {
    logger.error('Error listing entries:', err.message);
    process.exit(1);
  }
}