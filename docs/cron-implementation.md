# ScrapeSmart Cron Job Implementation

This document explains how scheduled workflows are executed in ScrapeSmart.

## Architecture

ScrapeSmart uses a combination of database scheduling and external triggers to run workflows on schedules defined by cron expressions.

### Components:

1. **Database**: 
   - Each workflow can have a `cron` field containing a cron expression
   - The `nextRunAt` field indicates when the workflow should next be executed

2. **API Endpoints**:
   - `/api/workflows/cron`: Finds and triggers workflows that are due to run
   - `/api/workflows/execute`: Executes a specific workflow and calculates its next run time

3. **Scheduler**:
   - External scheduler hitting the `/api/cron` endpoint every 10 minutes (optimized for Vercel's free tier)
   - The cron endpoint is secured with API_SECRET authentication
   - Designed to process multiple workflows in a single execution to optimize for fewer cron invocations

## Deployment

For production, we use Vercel's built-in cron jobs to trigger the workflow scheduler.

### Setup on Vercel:

1. The `vercel.json` file configures the cron schedule:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron",
         "schedule": "0 0 * * *"
       }
     ]
   }
   ```

   Note: For hobby tier accounts, we're limited to daily cron jobs. If you need more frequent scheduling, you'll need to upgrade to the Pro plan.

2. This triggers the `/api/cron` endpoint every 10 minutes, which then calls the internal cron processing endpoint.
3. This schedule is optimized for Vercel's free tier, which has limitations on execution frequency.

## Local Testing

To test scheduled workflows locally:

1. Run the application with `npm run dev`
2. Use `npm run test-cron` to manually trigger the cron job

## Troubleshooting

If scheduled workflows aren't running:

1. Check the logs for authentication errors
2. Verify that workflows have valid cron expressions and nextRunAt dates
3. Ensure the API_SECRET environment variable is correctly set
4. Check that the cron job is properly configured in Vercel
