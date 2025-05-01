import { waitFor } from '@/lib/helper/waitFor';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from '../task/LaunchBrowser';
import { PageToHtmlTask } from '../task/PageToHtml';
import { FillInputTask } from '../task/FillInputTask';
import { ClickElementTask } from '../task/ClickElement';
import { ExtractDataWithAITask } from '../task/ExtractDataWithAI';
import { prisma } from '@/lib/prisma';
import { symmetricDecrypt } from '@/lib/encryption';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';

export async function ExtractDataWithAiExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAITask>) : Promise<boolean> {
    try {
        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("input->credentials not defined");
            return false;
        }

        const AI_service = environment.getInput("AI Service");
        if (!AI_service) {
            environment.log.error("input->AI service not defined");
            return false;
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("input->prompt not defined");
            return false;
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("input->content not defined");
            return false;
        }

        const credential = await prisma.credential.findUnique({
            where: { id: credentials },
        });

        if (!credential) {
            environment.log.error("Credential not found");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("Failed to decrypt credential value");
            return false;
        }

        let result;
        if (AI_service.includes("ChatGPT")) {
            const openai = new OpenAI({
                apiKey: plainCredentialValue,
            });

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
                    },
                    {
                        role: "user",
                        content: content,
                    },
                    {
                        role: "user",
                        content: prompt,
                    }
                ],
                temperature: 1,
            });
            environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
            environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);
            result = response.choices[0].message?.content;
        } else if (AI_service.includes("Claude")) {
            // Using Anthropic's completions.create per current SDK guidelines
            const anthropic = new Anthropic({
                apiKey: plainCredentialValue,
            });

            const response = await anthropic.completions.create({
                model: "claude-3-sonnet-20240229",
                prompt: `You are a web scraper helper that extracts data from HTML or text. Your response should always be only the extracted data as a JSON array or object, without any additional words or explanations. If no data is found, return an empty JSON array.

Here is the content:
${content}

Here is your extraction prompt:
${prompt}`,
                max_tokens_to_sample: 1024,
                temperature: 1,
            });
            // The response contains the output in a "completion" property.
            result = response.completion;
            //environment.log.info(`Prompt tokens: ${response.usage?.input_tokens}`);
            //environment.log.info(`Completion tokens: ${response.usage?.output_tokens}`);
        } else if (AI_service.includes("Gemini")) {
            const gemini = new GoogleGenAI({
                apiKey: plainCredentialValue,
            });
        
            const response = await gemini.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `You are a web scraper helper that extracts data from HTML or text. Your response should always be only the extracted data as a JSON array or object, without any additional words or explanations. If no data is found, return an empty JSON array.
        
        Here is the content:
        ${content}
        
        Here is your extraction prompt:
        ${prompt}`
            });
        
            // Extract result from the response.
            result = extractJson(response.text!);
        
            environment.log.info(`Prompt tokens: ${response.usageMetadata?.promptTokenCount}`);
            environment.log.info(`Completion tokens: ${response.usageMetadata?.candidatesTokenCount}`);
        }
        

        if (!result) {
            environment.log.error("Empty response from AI");
            return false;
        }

        environment.setOutput("Extracted data", result);

    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
    return true;
}

function extractJson(text: string): string {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start === -1 || end === -1) {
      throw new Error("JSON block not found.");
    }
    const jsonString = text.substring(start, end);
    return jsonString;
  }