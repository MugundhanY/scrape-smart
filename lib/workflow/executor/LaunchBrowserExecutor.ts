import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import puppeteer from 'puppeteer';
import { LaunchBrowserTask } from '../task/LaunchBrowser';

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Website Url");
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox',], //"--proxy-server=brd.superproxy.io:33335"], // Add these arguments for better compatibility
        });
        environment.log.info(`Browser started successfully`);
        environment.setBrowser(browser);
        const page = await browser.newPage();
        /*
        await page.authenticate({
            username: 'brd-customer-hl_2269956f-zone-scrape_flow',
            password: 'vhyqvoxbl7ag'
        })
        */

        // Set a custom user-agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5777.128 Safari/537.36');

        // Increase the navigation timeout
        await page.setDefaultNavigationTimeout(60000); // 60 seconds

        await page.goto(websiteUrl, { waitUntil: 'networkidle2' });
        environment.setPage(page);
        
        environment.log.info(`Opened page at: ${websiteUrl}`);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}