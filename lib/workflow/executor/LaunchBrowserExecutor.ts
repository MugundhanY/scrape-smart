import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { Browser as PuppeteerBrowser } from 'puppeteer';
import { Browser as PuppeteerCoreBrowser } from 'puppeteer-core';
import { Page as PuppeteerPage } from 'puppeteer';
import { Page as PuppeteerCorePage } from 'puppeteer-core';

// Define remote executable path for Chromium
const remoteExecutablePath = 'https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar';

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Website Url");
        
        // Determine if running in Vercel production environment
        const isVercelProduction = process.env.VERCEL_ENV === 'production';
        
        // Define browser with the specific type for each environment
        let browser: PuppeteerBrowser | PuppeteerCoreBrowser;
        
        if (isVercelProduction) {
            // Vercel production configuration using chromium-min
            environment.log.info('Launching browser in Vercel production environment');
            browser = await puppeteerCore.launch({
                args: chromium.args,
                executablePath: await chromium.executablePath(remoteExecutablePath),
                headless: true,
            }) as PuppeteerCoreBrowser;
        } else {
            // Development environment configuration
            environment.log.info('Launching browser in development environment');
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage', // Overcome limited resource issues in Vercel
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                ],
            }) as PuppeteerBrowser;
        }
        environment.log.info(`Browser started successfully`);        environment.setBrowser(browser as any);
        const page = await browser.newPage() as PuppeteerPage | PuppeteerCorePage;
        
        // Block unnecessary resource types to improve performance (helps in resource-limited environments)
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            // Block unnecessary resources like images, fonts, etc.
            if (['image', 'font', 'media', 'stylesheet'].includes(resourceType)) {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Set a custom user-agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5777.128 Safari/537.36');

        // Increase the navigation timeout
        await page.setDefaultNavigationTimeout(30000); // 30 seconds - reduced to work better in serverless
        
        try {
            // Enhanced navigation with retry for detached frames
            environment.log.info(`Navigating to: ${websiteUrl}`);
            await page.goto(websiteUrl, { 
                waitUntil: ['domcontentloaded', 'networkidle2'],
                timeout: 25000 
            }).catch(async (err) => {
                // If navigation fails (common in serverless), try with simpler settings
                environment.log.info(`Navigation error: ${err.message}, trying fallback navigation`);
                return page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });
            });
            
            environment.setPage(page as any);
            environment.log.info(`Opened page at: ${websiteUrl}`);
        } catch (navigationError: unknown) {
            const errorMessage = navigationError instanceof Error 
                ? navigationError.message 
                : 'Unknown navigation error';
            environment.log.error(`Failed to navigate: ${errorMessage}`);
            throw navigationError;
        }
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}