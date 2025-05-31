# pencil it in

### pencil it in is the first shared calendar built for friends, not meetings.

pencil it in shows your group’s real-time availability instantly—no invites,
no back-and-forth, just instant visibility to plan hangouts fast.

# Onboarding

## General Knowledge

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

## Setting Up

### Run the Project

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

#### View dev site on computer

The compiler will then tell you where to access the site: typically `https://localhost:5173`.

TODO (#50): We have some linters and formatters installed. Explain how to use them.

#### View locally hosted site on phone

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

### Create an account

Create an account at `/index.html`.

After creating an account, navigate to `/events.html`.

### Testing API calls during development

Download Postman and make an account. Ask me to share the project with
you.

#### Setting up Postman

If you are me and unfortunately starting from scratch, you'll want to
make a `pencil-it-in` **Workspace**, then two **Collections**, one named **Local**,
and another named Remote.

Make two environments, `Local` and `Remote - Prod`.
You'll also want to create a sign in call first, save the `access_token` that it responds
with using a post-response Script. You can see it saves it to the current `environment`.

```javascript
const response = pm.response.json();
pm.environment.set("auth_token", response.token); // Adjust key name based on your response
```

Use the variable in `Authorization`, pick `Bearer Token`, then set token as `{{access_token}}`.

## Testing

### Unit tests (testing functions)

### Integration tests (testing components with mock API data)

### End-to-end tests (browser automation)

Using Playwright.

**Set up credentials**: Add your account credentials to `constants.ts`, see `constants.example.ts`. Run
`[auth.setup.ts](tests/auth.setup.ts)`.

**Run Playwright tests**: `npx playwright test`

**Run Playwright tests with UI**: `npx playwright test --ui`

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

All developer code exists within `src`; anything outside of it is automatically generated.

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
