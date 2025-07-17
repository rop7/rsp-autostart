#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTOSTART_DIR = path.join(process.env.HOME, '.config/autostart');
const IGNORE_DIR = path.join(AUTOSTART_DIR, 'entry');

// Track files we're currently modifying
const currentlyModifying = new Set();

// Keep process alive
const keepAlive = () => {
  console.log("Service is active (Press Ctrl+C to exit)...");
  setInterval(() => {}, 1000);
};

// Check if file needs PM2 wrapping
function needsPM2Wrap(content) {
  return !content.includes('pm2 start');
}

// Check if file needs indexing
function needsIndexing(filename) {
  return !filename.match(/^\d{2}-/);
}

// Modify Exec to use PM2
function modifyExecToPM2(filePath) {

  if (filePath.includes('cleanupPM2')) {
    return
  }

  if (currentlyModifying.has(filePath)) return;
  
  currentlyModifying.add(filePath);
  
  try {

    const content = fs.readFileSync(filePath, 'utf8');
    
    // if (!needsPM2Wrap(content)) {
    //   currentlyModifying.delete(filePath);
    //   return;
    // }

    const entryName = path.basename(filePath, '.desktop').replace(/^\d{2}-/, '');
    
    const modifiedContent = content.replace(
      /^Exec=(.*)$/m,
      `Exec=${entryName}"`
    );
    
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log(`Updated ${path.basename(filePath)} to use PM2`);
  } catch (err) {
    console.error(`Error modifying ${filePath}:`, err.message);
  } finally {
    setTimeout(() => currentlyModifying.delete(filePath), 1000);
  }
}

// Reindex all .desktop files
function reindexAll() {

  try {

    const files = fs.readdirSync(AUTOSTART_DIR).filter(file => file.endsWith('.desktop') && needsIndexing(file) &&!file.startsWith('.')).sort();

    files.forEach((file, index) => {

      if (file.includes('cleanupPM2')) {
        return
      }

      const newName = `${String(index + 1).padStart(2, '0')}-${file}`;
      const oldPath = path.join(AUTOSTART_DIR, file);
      const newPath = path.join(AUTOSTART_DIR, newName);
      
      fs.renameSync(oldPath, newPath);
      
      modifyExecToPM2(newPath);
      
      console.log(`Reindexed: ${file} → ${newName}`);

    })

  } catch (err) {
    console.error('Error during reindexing:', err.message);
  }
}

// Initial scan of all files
function initialScan() {
  console.log("Performing initial scan...");
  
  try {
    const files = fs.readdirSync(AUTOSTART_DIR)
      .filter(file => file.endsWith('.desktop') && !file.startsWith('.'));
    
    // First pass: index unindexed files
    if (files.some(needsIndexing)) {
      reindexAll();
    }
    
    // Second pass: ensure PM2 wrapping
    files.forEach(file => {
      const filePath = path.join(AUTOSTART_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (needsPM2Wrap(content)) {
          modifyExecToPM2(filePath);
        }
      } catch (err) {
        console.error(`Error scanning ${file}:`, err.message);
      }
    });
    
    console.log("Initial scan completed");
  } catch (err) {
    console.error('Error during initial scan:', err.message);
  }
}

// Watch directory for changes
const watcher = fs.watch(
  AUTOSTART_DIR,
  { persistent: true },
  (eventType, filename) => {
    if (!filename || filename.startsWith('.')) return;
    
    const filePath = path.join(AUTOSTART_DIR, filename);
    
    if (filePath.startsWith(IGNORE_DIR)) return;
    
    if (filename.endsWith('.desktop')) {
      console.log(`Detected ${eventType} on ${filename}`);
      
      if (eventType === 'rename') {
        setTimeout(() => {
          if (fs.existsSync(filePath)) {
            if (needsIndexing(filename)) reindexAll();
            modifyExecToPM2(filePath);
          } else {
            reindexAll();
          }
        }, 100);
      } else if (eventType === 'change' && !currentlyModifying.has(filePath)) {
        modifyExecToPM2(filePath);
      }
    }
  }
);

watcher.on('error', (err) => {
  console.error('Watcher error:', err);
});

process.on('SIGINT', () => {
  console.log('\nStopping watcher...');
  watcher.close();
  process.exit(0);
});

// Start the service
console.log(`Starting autostart manager for ${AUTOSTART_DIR}`);
initialScan();
console.log(`Watching for changes...`);
keepAlive();