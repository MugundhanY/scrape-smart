import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';
import { NavigateUrlTask } from '../task/NavigateUrl';

export async function NavigateUrlExecutor(environment: ExecutionEnvironment<typeof NavigateUrlTask>) : Promise<boolean> {
    try {
        const url = environment.getInput("URL");
        if(!url){
            environment.log.error("input->url not defined");
        }

        await environment.getPage()!.goto(url);
        environment.log.info(`Navigated to ${url}`);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}