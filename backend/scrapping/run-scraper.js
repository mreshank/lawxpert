#!/usr/bin/env node

/**
 * Script to run the lawyer profile scraper
 * 
 * Usage:
 *   node run-scraper.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('Starting lawyer profile scraper...');

try {
  // Run the scraper
  execSync('node scraper.js', {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  console.log('Scraping completed successfully!');
  console.log(`Data saved to: ${path.join(__dirname, 'lawyers_data.json')}`);
} catch (error) {
  console.error('Scraping process failed:', error.message);
  process.exit(1);
} 