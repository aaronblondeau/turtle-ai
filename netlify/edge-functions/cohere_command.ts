// NOTE, COHERE_API_KEY is set in netlify UI, "netlify dev" makes it work locally and when deployed:
// https://app.netlify.com/sites/turtle-ai/configuration/env

import type { Context } from "@netlify/edge-functions";

const validCommands = [
  'forward',
  'left',
  'right',
  'goto',
  'putPenUp',
  'putPenDown',
  'setWidth',
  'setColor'
]

export default async (request: Request, context: Context) => {

  const reqJson = await request.json();
  const prompt = reqJson.prompt;

  // Buile the request to cohere
  const cohereBody = {
    model: "command",
    prompt: `You are an assistant who writes JavaScript code that fulfills requests to create drawings.
    You draw by moving a turtle around a canvas that is 400 pixels wide, and 400 pixels tall.
    
    You have at your disposal the following JavaScript functions to operate the pen:
    - forward(steps: int) : moves the pen forward the given number of pixels
    - left(degrees: int) : turns oen to the left the given number of degrees
    - right(degrees: int) : turns pen to the right the given number of degrees
    - goto(x: int, y: int) : moves the pen to x,y coordinates without drawing a line
    - putPenUp() : disables drawing for later commands
    - putPenDown() : enables drawing for later commands
    - setWidth(thickness: int) : sets the thickness of the pen
    - setColor(code_or_name: string) : sets the pen color to either a color name or a hex color code
    - done() : indicate to the user that you are done fulfilling their request

    The drawing context and canvas is already setup for you.    
    You can only write code that consists of calls to these functions. You may also use for loops.

    If the request does not specify a width use 4.
    If the request does not specify a color use red.
    Do not draw outside the bounds of the canvas.
    Do not provide any explanation or reasons for the code.
    Your only output should be the code itself.
    Your drawing code must always end with the done() command.

    Here is an example request: Draw a square

    And here is the code that fulfills the request:
    \`\`\`javascript
    setColor("red");
    setWidth(4);
    putPenDown();
    forward(100);
    right(90);
    forward(100);
    right(90);
    forward(100);
    right(90);
    forward(100);
    right(90);
    \`\`\`
    
    Here is the request:
    ${prompt}`,
    maxTokens: 300,
    temperature: 0.9,
    k: 0,
    stopSequences: ["done()\n```", "done();\n```"],
    returnLikelihoods: "NONE"
  }

  // Make a request to the cohere api
  const postRequest = await fetch("https://api.cohere.ai/v1/generate", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer ' + Deno.env.get('COHERE_API_KEY'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cohereBody),
  });
  const cohereJson = await postRequest.json();
  let modelOutput = cohereJson.generations[0].text;

  // Clean up the output
  modelOutput = modelOutput.replace(/done\(\)\n```/g, '');
  modelOutput = modelOutput.replace(/done\(\);\n```/g, '');
  modelOutput = modelOutput.replace('```javascript', '');
  modelOutput = modelOutput.replace('```', '');
  let commands = ''
  for (let commandLine of modelOutput.split('\n')) {
    commandLine = commandLine.trim()

    // skip empty lines
    if (commandLine === '') continue

    // make sure commandLine starts with one of validCommands
    const command = commandLine.split('(')[0]
    if (validCommands.includes(command)) {
      commands += commandLine + '\n' 
    }
  }

  // Return the output
  return Response.json({ commands, modelOutput });
};
