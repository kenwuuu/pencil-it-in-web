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
- The three lines of AlpineJS in `main.ts` are just necessary. IDK why, their docs just say to do that.
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

- `supabaseKey is required` refers to missing SUPABASE_SERVICE_ROLE_KEY key when running an edge function.
  - When running locally, this is fixed with adding a `.env` file in the same directory as the `index.ts`
    with SUPABASE_SERVICE_ROLE_KEY. Also add this code to the top of `index.ts`
    -
    ```javascript
    import { config } from 
    'https://deno.land/x/dotenv/mod.ts';
    ```

await config({export: true});`

## Github

#### Github Secrets

**TESTING_EMAIL** is used in automated e2e testing where an account is created
and then deleted after testing.
**PLAYWRIGHT_KEN_EMAIL** is used as the primary account that all prod tests are
run on. It is Ken's real account.

## Developing a new full stack feature

### Common gotchas

The files that we tell you to copy from mimic the most common use case of Edge Functions.
You may find occasions where you could do something a different way but it's likely to
be an edge case. For example, we do successfully use the Supabase library to call Edge
Functions in `update-attendance-status.js` but I have no idea how that works. Will need
to debug. But the point is that I've spent hours, on separate occasions, trying to debug
that code before realizing that it's **simpler** and **faster** to just use `fetch`.

- Using Supabase's JS library to call Edge Functions:
  - for some reason, this just doesn't work. Haven't debugged it yet but the simplest
    thing to do is to just use `fetch()`. Just copy
    `upsert-notification-token.js` and replace `edgeFunctionName` and `body.
- Not handling preflight CORS requests:
  - Copy `functions/upsert-notification-token/index.ts`. Note the top few lines of code
    that address CORS.

## Cross platform app deep linking on Supabase

The reason we do it the way below is because Supabase links to their own auth page
first to trigger verification, before redirecting to our site. But this sometimes
doesn't work on iOS because email clients (gmail) will open in a popup
browser and not the full browser. For some reason, iOS doesn't respond to redirects
to app links linked in that manner, and only likes it when users do a little clicky
click. If

The simplest way I found to handle this is to adjust Supabase's verification URL to point
to a simple page that has a script that instantly redirects the user to the home page.

Example redirect page with style imported from `styles.css`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover, initial-scale=1.0,
      minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        name="viewport"
  />
  <title>Pencil It In</title>
</head>
<body
        class="flex items-center justify-center min-h-screen bg-base-100 text-center"
>
<!--  Button fall back if automatic redirects don't work  -->
<div class="space-y-4">
  <p class="text-lg text-gray-600 mb-8">
    Email verified!
  </p>

  <a class="btn btn-primary" href="https://www.pencilitin.app/events.html">
    Open App
  </a>
</div>
</body>
<link href="../../style.css" rel="stylesheet" type="text/css"/>
</html>
```

To change Supabase's verification URL:
Auth > Emails > URL Configuration > Insert your redirect page URL
from the file above into `Site URL`

If deep linking is set up correctly, clicking the button will take you to the app.
Also, see this [nice tool](10.0.0.181:5173/src/auth/auth-redirect-to-app.html) that
iOS has to test if the URL you're hitting will open your app.
