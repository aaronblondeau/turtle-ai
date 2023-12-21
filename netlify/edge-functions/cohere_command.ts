// export default () => new Response("Hello world " + Deno.env.get('URL'));

import type { Context } from "@netlify/edge-functions";

// NOTE, COHERE_API_KEY is set in netlify UI, "netlify dev" makes it work locally and when deployed:
// https://app.netlify.com/sites/turtle-ai/configuration/env

export default async (request: Request, context: Context) => {
  return Response.json({ yeah: "buddy", key: Deno.env.get('COHERE_API_KEY') });
};
