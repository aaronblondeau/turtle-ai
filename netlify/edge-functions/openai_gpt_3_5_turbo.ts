import { openAiGenerate } from "./lib/openai.ts";
import extractCommands from "./lib/extractCommands.ts";

export const config = { path: "/api/openai_gpt_3_5_turbo" };

export default async (request: Request) => {

  const reqJson = await request.json();
  const prompt = reqJson.prompt;

  const modelOutput = await openAiGenerate('gpt-3.5-turbo', prompt)
  const commands = extractCommands(modelOutput)

  // Return the output
  return Response.json({ commands, modelOutput });
};
