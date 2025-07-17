import path from 'path';

export const AUTOSTART_DIR = path.join(process.env.HOME, '.config', 'autostart');
export const IGNORE_DIR = path.join(AUTOSTART_DIR, 'entry');

// Helper to validate .desktop files
export function isValidDesktopFile(content) {
  return content.includes('[Desktop Entry]') && 
         content.includes('Exec=') && 
         content.includes('Name=');
}