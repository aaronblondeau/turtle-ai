import { openAiGenerate } from "./lib/openai.ts";
import extractCommands from "./lib/extractCommands.ts";

export const config = { path: "/api/openai_gpt_4" };

export default async (request: Request) => {

  const reqJson = await request.json();
  const prompt = reqJson.prompt;

  const modelOutput = await openAiGenerate('gpt-4', prompt)
  const commands = extractCommands(modelOutput)

  // Return the output
  return Response.json({ commands, modelOutput });
};
