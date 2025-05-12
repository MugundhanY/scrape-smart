# Using Vercel Cron Jobs with ScrapeSmart

This document provides guidance on effectively using Vercel's cron jobs with the ScrapeSmart application, particularly focusing on the free tier constraints.

## Vercel Free Tier Cron Limitations

Vercel's free tier includes cron jobs with the following limitations:

1. **Schedule Frequency**:
   - Not every frequency is available
   - The most frequent allowed schedule is every 10 minutes (`0/10 * * * *`)

2. **Daily Execution Limit**: 
   - There's a limit to the number of executions per day
   - This is why we've optimized the cron job to run every 10 minutes instead of every minute

## Implementation Optimizations

To accommodate these limitations, we've made the following optimizations:

1. **10-Minute Schedule**:
   - Our cron job is configured to run every 10 minutes
   - This means that some workflows might execute with a slight delay (up to 10 minutes)

2. **Efficient Batching**:
   - When the cron job runs, it processes all workflows that are due
   - This ensures we maximize each cron job invocation

## Best Practices for Workflow Scheduling

When creating workflow schedules in ScrapeSmart:

1. **Align with 10-Minute Intervals**:
   - For time-sensitive workflows, align them with the 10-minute intervals (0, 10, 20, 30, 40, 50 minutes past the hour)
   - Example: `0,10,20,30,40,50 * * * *` instead of `5,15,25,35,45,55 * * * *`

2. **Use Less Frequent Schedules When Possible**:
   - Hourly: `0 * * * *`
   - Daily: `0 0 * * *`
   - Weekly: `0 0 * * 0`

3. **Consider Time Zones**:
   - All scheduled times are in UTC
   - Plan your schedules accordingly

## Upgrading to Vercel Pro

If you need more frequent executions or higher execution limits:

1. Consider upgrading to Vercel's Pro plan
2. This would allow more frequent cron job executions if needed

## Troubleshooting

If scheduled workflows aren't running as expected:

1. Check if the workflow's scheduled time aligns properly with the 10-minute intervals
2. Verify that you haven't exceeded Vercel's daily execution limits
3. Check the logs for any errors in workflow execution
