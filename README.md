# turtle-ai

This a project that tests AI's ability to create code that draws with [LOGO/Turtle](https://caesarovich.github.io/better-turtle/index.html)

Currently hosted here : [https://turtle-ai.netlify.app/](https://turtle-ai.netlify.app/)

## Netlify (dev and hosting w/ edge functions)

Setup was initialized with:

```
netlify sites:create --name turtle-ai
```

I hand-created netlify.toml based on info here : https://deno.com/blog/netlify-edge-functions-on-deno-deploy

Look in vite.config.ts for env var config for Vue env var config info.

Env vars for edge functions come from netlify web UI. "netlify dev" pulls them down and provides them for local dev:

```
netlify dev 
```

(runs vite dev and edge functions)


To deploy

```
netlify deploy --build --prod
```
