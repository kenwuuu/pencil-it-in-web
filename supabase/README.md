# Developing

## Accessing env variables

Each function needs this code at the top to access the `.env` file.
```javascript
import { config } from 'https://deno.land/x/dotenv/mod.ts';

await config({export: true});
```

They can then be accessed like so:
```javascript
const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
  global: {
    headers: {
      Authorization: req.headers.get('Authorization')
    }
  }
});
```

# Running and testing

## Run function locally and hit local
`supabase start` and `supabase functions serve`

**docs incomplete**

## Run function locally and hit prod
Each function's folder needs a `.env` file with `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

Then, in the folder of the function you want to run, run `deno --allow-net 
--allow-env --allow-read index.ts`

Finally, using Postman, hit the URL it provides, e.g. `http://0.0.0.0:8000/functions/v1/insert-friendship`
- Auth Type = `Bearer Token`
- Body must be `raw` and `JSON`. Body value would look like `{"username": "ken"}` 
for `insert-friendship`

