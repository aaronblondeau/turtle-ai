// NOTE, OPENAI_API_KEY is set in netlify UI, "netlify dev" makes it work locally and when deployed:
// https://app.netlify.com/sites/turtle-ai/configuration/env

import { stripIndent } from "https://deno.land/x/deno_tags@1.8.2/tags.ts";

export async function openAiGenerate(model = 'gpt-3.5-turbo', prompt: string) {
  // Build the request to openai
  // NOTE : if you change the list of commands in the prompt you'll also want to update validCommands array in extractCommands.ts
  const openaiBody = {
    model,
    messages: [
      {
        role: 'system',
        content: stripIndent`You are an assistant who writes JavaScript code that fulfills requests to create drawings.
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
          \`\`\``
      },
      {
        role: 'user',
        content: prompt
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["done()\n```", "done();\n```"],
  }

  // Make a request to the openai api
  const postRequest = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer ' + Deno.env.get('OPENAI_API_KEY'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openaiBody),
  });

  // Parse the response as JSON
  const openaiJson = await postRequest.json();

  // Pull only the drawing commands out of the model output
  const modelOutput = openaiJson.choices[0].message.content;

  return modelOutput
}