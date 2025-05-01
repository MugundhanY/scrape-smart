import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';

export async function ClickElementExecutor(environment: ExecutionEnvironment<typeof ClickElementTask>) : Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if(!selector){
            environment.log.error("input->selector not defined");
        }

        await environment.getPage()!.click(selector);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}