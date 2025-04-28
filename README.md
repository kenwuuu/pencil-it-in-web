# Setting up

Install libraries.

```bash
npm i
```

Run the site.

```bash
npm run dev
```

Todo: I have some linters and formatters installed. Explain how to use them.

# Project Structure

This project is structured very much like a standard, vanilla HTML/CSS/JS
website. It shouldn't be hard to learn or painful like using React. Everything
you remember from playing around in HTML should carry over. Below are the
little catches and differences between this and a vanilla HTML site.

## Frontend

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
                    hx-get="mocks/events_data.html"
                    hx-trigger="load"
                    hx-target=".events-agenda"
            >
            ```

        - Honestly, as I've been working on this project, I've been feeling like
          HTMX should be dropped since this is turning more into a webapp than a
          website.

    - AlpineJS: allows us to handle some logic inside HTML, reducing JS use.
      For example,
      it lets us hide HTML elements based on navbar menu selections. Normally,
      that would be something that would require us to use JS.
        - The code below from `events-container.js` shows the `<create-event>`
          component if `is_creating_new_event` is true.
            ```html
                <div class="flex" x-data=" { is_creating_new_event: false  }">
                    <create-event x-show="is_creating_new_event"></create-event>
                </div>
            ```
    - Vite: honestly no idea what this does. I think it makes running a local
      server a lot easier
    - Svelte: potential future addition. A frontend framework that encompasses
      page navigation, state management, and components, much like React or Angular.
      But I hear it's easier and better, also faster loads.

- Styling:
    - DaisyUI: a ready-to-use UI styling library. This covers
      most small components you'll see in the frontend.
        - Use by adding DaisyUI class names to an HTML element. Like `btn` below.
            ```html
          <button class="btn btn-primary">
          ```
    - Tailwind CSS: CSS but easier. Again, usage is with class names in HTML
      elements.
        ```html
        <div class="flex"
        ```

## Backend

The backend and the database are on Supabase, an open source, relational DB
alternative to Firebase. This site is mostly a frontend project since
all it's really doing is serving a list of events to people lmao so
I don't have much to say rn

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