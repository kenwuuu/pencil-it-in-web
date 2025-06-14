## General Knowledge

> This file is a list of all general information that is useful to me or others contributors.
>
> Ideally, this would be formatted and put into a nice wiki, but until someone else does it,
> or I have time, it will stay here.

- When running Supabase functions locally, the `anon_key` is different from the prod one,
  so you need to change the key in certain calls, or set your env variable differently.
- API keys in the repo are public keys so they're fine to stay out.
- Example API calls using the Supabase JS library are in `services/examples/edge-functions
- When renaming or moving files that use HTMX or are used by a file that uses HTMX, you have
  to refactor manually. Jetbrains refactor doesn't catch the strings. See `friends-container.js`
  and the mock data file `friends.html`. The JS file calls `friends.html` but if you move
  `friends.html`, `friends-container.js doesn't get updated with the new pathname.
- JetBrains IDEs don't format the HTML inside of JS functions. So if you make a new
  (Web Component) component, format the HTML with an online formatter and then paste it back in.
  I use [this site](https://www.freeformatter.com/html-formatter.html#before-output). I use 2
  spaces to save space because HTML is indent-heavy.
- `tsconfig.json` will throw an error since there are currently no TypeScript files in `src`.
  You may ignore this. TODO (#44): Migrate some code over to TypeScript.
- If you want to have mocks show up in prod build, we currently just put them into `public` because Vite bundles those
  without any hassle on our end. We should find a way to just bundle all `mock_data` folders though.
    - Then you just point HTMX to root, like `hx-get="/friends.html"`
- To test API with Postman:
    - POST to `https://mpounklnfrcfpkefidfn.supabase.co/auth/v1/token?grant_type=password`
    - Headers: `apikey` must be our anon/public key
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb3Vua2xuZnJjZnBrZWZpZGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODE0OTcsImV4cCI6MjA1Nzc1NzQ5N30.wZlH6_dd0WtEVC-BtMXEzcTUgSAIlegqSPnr3dyvjyA`
    - Body: {"email": "email@gmail.com","password": "password"}
- All new JS files need to be added to `vite.config.ts` in order to be included when we build for prod.
- The three lines of AlpineJS in `main.js` are just necessary. IDK why, their docs just say to do that.
- Supabase Functions common error: `JSON object requested, multiple (or no) rows returned`, this usually happens when
  you submit bad input, and it uses that input to call the database. Check that your input exists in the database.
- To always load into Event Creation component for testing, set `x-data=" { is_creating_new_event: true }"` to true in
  `events-container.js`
- If you're getting CORS errors, try adding `"Access-Control-Allow-Origin": origin` to the `Response`
  immediately following where the error occurs.

`[Error] Fetch API cannot load https://mpounklnfrcfpkefidfn.supabase.co/functions/v1/retrieve-user-friends due to access control checks.`

- this error occurs when the edge function doesn't handle preflight and CORS. Add the following code block to the
  top of
  your function under `Deno.serve`.

```javascript
  // handle preflight checks and provide CORS headers
if (req.method === 'OPTIONS') {
    return new Response('ok', {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "86400"
        }
    });
}
```