import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';

export async function PageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>) : Promise<boolean> {
    try {
        const html = await environment.getPage()!.content();
        environment.setOutput("Html", html);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}