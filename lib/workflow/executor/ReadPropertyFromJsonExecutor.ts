import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';
import { ReadPropertyFromJsonTask } from '../task/ReadPropertyFromJson';

export async function ReadPropertyFromJsonExecutor(environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>) : Promise<boolean> {
    try {
        const jsonData = environment.getInput("JSON");
        if(!jsonData){
            environment.log.error("input->JSON not defined");
        }
        const propertyName = environment.getInput("Property name");
        if(!propertyName){
            environment.log.error("input->propertyName not defined");
        }

        const json = JSON.parse(jsonData);
        const propertyValue = json[propertyName];
        if(propertyName === undefined){
            environment.log.error("Property not found in JSON");
            return false;
        }
        environment.setOutput("Property value", propertyValue);
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}