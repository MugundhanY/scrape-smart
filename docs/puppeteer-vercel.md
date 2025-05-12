# Puppeteer on Vercel for ScrapeSmart

This document explains how to configure Puppeteer for running on Vercel serverless functions.

## Current Implementation

We've configured Puppeteer to work optimally in Vercel's serverless environment by:

1. Using headless mode with specific launch arguments
2. Blocking unnecessary resource types (images, stylesheets, etc.)
3. Setting up proper error handling and resource cleanup
4. Configuring Vercel functions with proper memory and duration limits

## Troubleshooting Browser Issues

If you encounter issues with Puppeteer in the Vercel environment:

### 1. Check Function Logs

Vercel function logs will show detailed error messages related to browser launches.

### 2. Common Issues & Solutions

- **Memory Limits**: We've configured 1024MB of memory in `vercel.json`
- **Execution Timeouts**: We've set a 60-second timeout for functions
- **Browser Crashes**: Optimized launch arguments to prevent common failures

### 3. Alternative Approaches

If persistent issues occur, consider these alternatives:

- Use a headless browser API service like Browserless or Puppeteer-as-a-Service
- Switch to a more lightweight approach like using fetch with Cheerio for HTML parsing
- For complex workflows, consider using a dedicated VM or container service

## Production Considerations

For production environments with heavy scraping workloads:

1. Consider upgrading to Vercel's Pro plan for higher memory limits
2. Monitor function executions closely for timeouts or failures
3. Implement circuit breakers for Puppeteer operations to avoid cascading failures

## Environment Variables

The code is set up to use custom Chrome paths when available:

```
PUPPETEER_EXECUTABLE_PATH - Optional path to a Chrome executable
```
