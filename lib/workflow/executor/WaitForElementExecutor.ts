import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';
import { WaitForElementTask } from '../task/WaitForElement';

export async function WaitForElementExecutor(environment: ExecutionEnvironment<typeof WaitForElementTask>) : Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if(!selector){
            environment.log.error("input->selector not defined");
        }

        const visibility = environment.getInput("Visibility");
        if(!visibility){
            environment.log.error("input->selector not defined");
        }



        await environment.getPage()!.waitForSelector(selector, {
            visible: visibility === "visible",
            hidden: visibility === "hidden",
        });
        environment.log.info(`Element ${selector} became: ${visibility}`);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}