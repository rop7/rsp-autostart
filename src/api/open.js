import fs from 'fs';
import path from 'path';
import RSp from 'file:///usr/lib/node_modules/rsp-libcore.js/index.js'
import { AUTOSTART_DIR } from '../cli/utils.js';

const logger = new RSp.Logger(),
      exec = RSp.exec;

export default () => {

    const fileindex = process.argv[3];
    const entries = fs.readdirSync(AUTOSTART_DIR);
    const entry = entries.find(entry => entry.includes(fileindex));

    if (!entry) {
      logger.error('Entry not found', { breakup: true });
      process.exit(1);
    }

    const filePath = path.join(AUTOSTART_DIR, entry)

    logger.success('Opening entry "' + filePath + '":', { breakup: true });

    exec(`xdg-open ${filePath}`);

}