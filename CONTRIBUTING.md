# Setting Up

## Quick start

0. We use DaisyUI and Tailwind for UI components and styling, and AlpineJS for reactivity.
   If you're styling something, look to Daisy first. If you
   use Daisy, please provide the reason in your PR.
1. Read `Running locally for development`
2. Read `Build for prod`. Your code should build successfully before you create a PR.
3. Read `End-to-end tests`. Your code should pass all tests before PR.
    1. If you add tests relevant to your code, I will think you're very cool 😎. See
       `Create tests from recording interactions`
4. Comment on the issue that you want so that GitHub will allow me to assign it to you.
5. Your PR title should be imperative (like you're commanding the code to change) and your
   change should be small enough that only a title is needed. Descriptions welcome if you
    2. Good title would look like: "Add loading spinner to Create Event button" or "Connect Profile
       Page to database"

## Running locally for development

Create `.env` in the root directory and fill in the appropriate
values. Look to `.env.example` for reference.
Contact Ken for necessary credentials.

Install libraries.

```bash
npm i
```

Run the site.

```bash
npm run dev
```

### Create an account

Create an account at `/index.html`.

After creating an account, navigate to `/events.html`.

### View dev site on computer

The compiler will then tell you where to access the site: typically `https://localhost:5173`.

TODO (#50): We have some linters and formatters installed. Explain how to use them.

### View locally hosted site on phone

**1. Get Your Computer’s Local IP Address**

- **macOS/Linux**: Run in terminal:
  `ifconfig | grep inet`

  Look for something like `192.168.x.x` under `en0` or `wlan0`.

- **Windows**: Run in Command Prompt:
  `ipconfig`

  Look for IPv4 Address — something like `192.168.1.42`

**2. Start Your Server to Bind to 0.0.0.0**

`npx vite --host`

**3. Access on Phone**

Navigate to: `http://<your-computer-ip>:<port>`
Example: `http://192.168.1.42:5173`

## Getting ready for prod

### Build for prod

Build into `dist`: `npm run build`

Then host the build locally to check it out: `npm run serve`

TODO: Setup Playwright so we can run it against the prod build and not just
our dev preview from `npx vite`

### Building phone apps

Build into `dist`: `npm run build`

Sync `dist` code into Capacitor folders: `npx cap sync`.
`npx cap sync` will copy your built web bundle expected to be found in webDir of the Capacitor Config file to your
native project and install the native project's dependencies

Pick a target and run iOS simulator: `npx cap run ios` or pick a target, like iPhone 16 Pro:
`npx cap run --target 58CBFE7A-53BA-4A37-9278-8A981C41779D ios`

### Testing API calls during development

Download Postman and make an account. Ask me to share the project with
you.

#### Setting up Postman

If you are me and unfortunately starting from scratch, you'll want to
make a `pencil-it-in` **Workspace**, then two **Collections**, one named **Local**,
and another named fwRemote.

Make two environments, `Local` and `Remote - Prod`.
You'll also want to create a sign in call first, save the `access_token` that it responds
with using a post-response Script. You can see it saves it to the current `environment`.

```javascript
const response = pm.response.json();
pm.environment.set("auth_token", response.token); // Adjust key name based on your response
```

Use the variable in `Authorization`, pick `Bearer Token`, then set token as `{{access_token}}`.

## Developing

When developing a new feature, I generally start by writing an Edge Function that
does what the new feature requires. That gets run locally with
`deno --allow-net --allow-env --allow-read index.ts` and then I hit it with Postman to
check that it does the correct things. Afterwards, I make a service file in the relevant
directory, like `src/events/services/update-attendance-status.js`. This is usually pretty
barebones as all it does is wrap the Edge Function call to allow the frontend to call the
backend without worrying about how to set up the call.

## Testing

### Unit tests (testing functions)

None for now.

### Integration tests (testing components with mock API data)

None for now.

### End-to-end tests (browser automation)

We use Playwright for e2e tests.

**Set up credentials**: Add your account credentials to `constants.ts`, see `constants.example.ts`.
Then run `node tests/auth.setup.ts`.

**Run Playwright tests**: `npx playwright test`

**Run Playwright tests with UI**: `npx playwright test --ui`

**Run Playwright tests on local server**:

- If you're a **contributor**, you can probably skip this unless you want. This runs tests against
  the output of `npm run build && npm run serve`
- Update `test:slow` in `package.json` and `baseURL` in `playwright.config.ts` with the
  network IP address that's printed when you run `npm run serve`. Terminate this process
  with `ctrl + c`.
- Then run `npm run test:slow`

**Create tests from recording interactions**: `npx playwright codegen [url]`, e.g.
`npx playwright codegen http://localhost:5173`

#### [How to use Playwright with GitHub Actions for e2e testing of Vercel preview deployments](https://cushionapp.com/journal/how-to-use-playwright-with-github-actions-for-e2e-testing-of-vercel-preview)

## Project Structure

This project is structured very much like a standard, vanilla HTML/CSS/JS
website. It shouldn't be hard to learn or painful like using React. Everything
you remember from playing around in HTML should carry over. Below are the
little catches and differences between this and a vanilla HTML site.

### General

The homepage for the site is `/events.html`, but the landing page is
`/` or `index.html` which also contains the sign in button right now.

### Folder structure

All developer code exists within `src` and in the top level HTML/JS, like `index.html` and `main.ts`;
anything outside of `src` is probably automatically generated and safe to ignore.

#### Frontend

The main libraries that this project uses are:

- General:

    - Web Components: more of a way of coding than a library. And yes, the name
      is "Web Components", it's not a phrase. Basically, you take an oft reused HTML
      component, like your website header, make a JS file, make a JS function, put
      the HTML in that function, export that function, and then you can reuse
      the component just by importing the JS file and using the component like any
      HTML element.
        - `site-header.js` is a good example. Note that the class name
          in the first line, and the second parameter in `customElements.define`
          has to match. The first parameter will be how you call it in HTML, `<site-header>`
    - HTMX: allows us to send requests to the server without using JS.

        - Usages of HTMX exist inside HTML tags and are prepended with `hx`. The
          last three lines are an
          example of what HTMX looks like, from `events-container.js`:

          ```html
          <div
            class="prose page-container"
            hx-get="src/events/mock_data/events_data.html"
            hx-trigger="load"
            hx-target=".events-agenda"
          ></div>
          ```

        - Honestly, as I've been working on this project, I've been feeling like
          HTMX should be dropped since this is turning more into a webapp than a
          website.

    - AlpineJS: allows us to handle some logic inside HTML, reducing JS use.
      For example,
      it lets us hide HTML elements based on navbar menu selections. Normally,
      that would be something that would require us to use JS.
        - The code below from `events-container.js` shows the `<event-creation-component>`
          component if `is_creating_new_event` is true.
          ```html
          <div class="flex" x-data=" { is_creating_new_event: false  }">
            <event-creation-component
              x-show="is_creating_new_event"
            ></event-creation-component>
          </div>
          ```
    - Vite: New React Builder that doesn't require to recompile everytime you change code.
    - Svelte: potential future addition. A frontend framework that encompasses
      page navigation, state management, and components, much like React or Angular.
      But I hear it's easier and better, also faster loads.

- Styling:
    - DaisyUI: a ready-to-use UI styling library. This covers
      most small components you'll see in the frontend.
        - Use by adding DaisyUI class names to an HTML element. Like `btn` below.
          ```html
          <button class="btn btn-primary"></button>
          ```
    - Tailwind CSS: CSS but easier. Again, usage is with class names in HTML
      elements. Used for more general/specific CSS needs like spacing and sizing.
      ```html
      <div class="flex"
      ```

#### Backend

The backend and the database are on Supabase: an open source, relational DB
alternative to Firebase. This site is mostly a frontend project since
all it's really doing is serving a list of events to people.

For testing calls to the backend, I like to just open `supabase-client.js`
and write my JS call right underneath the client instantiation. For example,
the code below defines a function that signs a user up using the `supabase`
library, and then calls that function.

```javascript
export async function signUpUser(email, password) {
    const {
        data: {user, session},
        error,
    } = await supabase.auth.signUp({
        email,
        password,
    });
    return {user, session, error};
}

const {user, session, error} = signUpUser('matriax1@gmail.com', 'password');
```

We also have some api calls in `src/api-examples` that you can use to directly run stored
procedures in Supabase. Read `src/api-examples/README.md` for more info.
