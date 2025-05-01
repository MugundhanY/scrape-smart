import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';

export async function FillInputExecutor(environment: ExecutionEnvironment<typeof FillInputTask>) : Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if(!selector){
            environment.log.error("input->selector not defined");
        }
        const value = environment.getInput("Value");
        if(!value){
            environment.log.error("input->selector not defined");
        }

        await environment.getPage()!.type(selector, value);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}