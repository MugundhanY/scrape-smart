// This file implements a Vercel Cron Job to trigger scheduled workflows
// https://vercel.com/docs/cron-jobs

import { NextResponse } from 'next/server';

// This route will be called once daily by Vercel's hobby tier cron system
export async function GET() {  try {
    // Call our internal cron endpoint to process scheduled workflows
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiSecret = process.env.API_SECRET;
    
    if (!apiSecret) {
      console.error('API_SECRET not defined in environment variables');
      return NextResponse.json({ success: false, error: 'API_SECRET not configured' }, { status: 500 });
    }
    
    const response = await fetch(`${appUrl}/api/workflows/cron`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiSecret}`,
      },
      cache: 'no-store', // Modern way to disable caching in fetch
    });
    
    const data = await response.json();
    
    // Return the response from the cron endpoint
    return NextResponse.json({
      success: true,
      triggered: data.workflowsToRun,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

// Configure this route to run once daily using Vercel Hobby Tier Cron
export const runtime = 'edge';
export const preferredRegion = 'sin1'; // Singapore region for lower latency
