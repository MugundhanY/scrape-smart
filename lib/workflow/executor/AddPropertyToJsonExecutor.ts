import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';
import { ReadPropertyFromJsonTask } from '../task/ReadPropertyFromJson';
import { AddPropertyToJsonTask } from '../task/AddPropertyToJson';

export async function AddPropertyToJsonExecutor(environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>) : Promise<boolean> {
    try {
        const jsonData = environment.getInput("JSON");
        if(!jsonData){
            environment.log.error("input->JSON not defined");
        }
        const propertyName = environment.getInput("Property name");
        if(!propertyName){
            environment.log.error("input->propertyName not defined");
        }

        const propertyValue = environment.getInput("Property value");
        if(!propertyValue){
            environment.log.error("input->propertyValue not defined");
        }

        const json = JSON.parse(jsonData);
        json[propertyName] = propertyValue;
        environment.setOutput("Update JSON", JSON.stringify(json));
    } catch(error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}