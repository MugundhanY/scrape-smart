import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';
import { DeliverViaWebhookTask } from '../task/DeliverViaWebhook';

export async function DeliverViaWebhookExecutor(environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>) : Promise<boolean> {
    try {
        const targetUrl = environment.getInput("Target URL");
        if(!targetUrl){
            environment.log.error("input->targetUrl not defined");
        }
        const body = environment.getInput("Body");
        if(!body){
            environment.log.error("input->body not defined");
        }

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const statusCode = response.status;
        if(statusCode !== 200){
            environment.log.error(`status code: ${statusCode}`);
            return false;
        }

        const responseBody = await response.json();
        environment.log.info(JSON.stringify(responseBody, null, 4));
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}