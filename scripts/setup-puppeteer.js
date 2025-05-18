// This script sets up Puppeteer for deployment environments
// It's executed after the build process to ensure Puppeteer is correctly configured
// See docs/puppeteer-vercel.md for more details

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Detect environment
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';

console.log(`Setting up Puppeteer for ${isProduction ? 'production' : 'development'} environment`);
console.log(`Running in Vercel: ${isVercel ? 'Yes' : 'No'}`);

// Make sure the .next/cache directory exists for browser caching
if (isProduction) {
  try {
    const cacheDir = path.join(process.cwd(), '.next', 'cache', 'puppeteer');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
      console.log(`Created Puppeteer cache directory: ${cacheDir}`);
    }
  } catch (error) {
    console.warn(`Warning: Could not create Puppeteer cache directory: ${error.message}`);
  }
}

// In Vercel, we use chromium-min for smaller package size
if (isVercel || isProduction) {
  try {
    console.log('Setting up @sparticuz/chromium-min for Vercel environment');
    
    // Check if chromium-min is installed
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules', '@sparticuz', 'chromium-min'))) {
      console.log('Installing @sparticuz/chromium-min');
      execSync('npm install @sparticuz/chromium-min@latest');
    }

    // Create an environment variables file for the Vercel runtime
    // This approach works in Vercel's serverless functions
    const envFilePath = path.join(process.cwd(), '.env.production.local');
    let envFileContent = '';
    
    if (fs.existsSync(envFilePath)) {
      envFileContent = fs.readFileSync(envFilePath, 'utf8');
    }

    // Only add the variables if they don't already exist
    if (!envFileContent.includes('PUPPETEER_EXECUTABLE_PATH')) {
      const chromiumBin = `PUPPETEER_EXECUTABLE_PATH="/node_modules/@sparticuz/chromium-min/bin/chromium-min"
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
PUPPETEER_HEADLESS="new"
`;
      fs.appendFileSync(envFilePath, chromiumBin);
      console.log('Added Puppeteer environment variables to .env.production.local');
    }
  } catch (error) {
    console.error('Error setting up Puppeteer for Vercel:', error);
    process.exit(1);
  }
} else {
  console.log('Skipping Vercel-specific Puppeteer setup in development environment');
}

// Output final configuration for logging purposes
console.log('Puppeteer setup complete');
console.log('Browser executable path:', process.env.PUPPETEER_EXECUTABLE_PATH || 'Using default path');
console.log('Headless mode:', process.env.PUPPETEER_HEADLESS || 'Not specifically set (defaults to true)');
