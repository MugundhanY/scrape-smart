// This script can be used to manually trigger cron jobs during development
// Optimized for Vercel's free tier - runs every 10 minutes in production
// Run with: node scripts/trigger-cron.js

const dotenv = require('dotenv');
const fetch = require('node-fetch'); // You might need to install: npm install node-fetch
dotenv.config();

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const apiSecret = process.env.API_SECRET;

if (!appUrl || !apiSecret) {
  console.error('Missing required environment variables: NEXT_PUBLIC_APP_URL or API_SECRET');
  process.exit(1);
}

async function triggerCron() {
  console.log(`Triggering cron job at ${new Date().toISOString()}`);
    try {
    console.log(`Calling cron endpoint: ${appUrl}/api/workflows/cron`);
    
    const response = await fetch(`${appUrl}/api/workflows/cron`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiSecret}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (data.workflowsToRun > 0) {
      console.log(`Triggered ${data.workflowsToRun} workflow(s)`);
      console.log('Waiting for workflows to complete...');
      // Give time for workflows to start processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Check your workflow executions in the dashboard for results');
    } else {
      console.log('No workflows to run at this time');
    }
  } catch (error) {
    console.error('Error triggering cron job:', error);
  }
}

triggerCron();
