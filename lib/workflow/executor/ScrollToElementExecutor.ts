import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';
import { ScrollToElementTask } from '../task/ScrollToElement';

export async function ScrollToElementExecutor(environment: ExecutionEnvironment<typeof ScrollToElementTask>) : Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if(!selector){
            environment.log.error("input->selector not defined");
        }

        await environment.getPage()!.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error(`Element with selector ${selector} not found`);
            } else {
                const top = element.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }, selector);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}