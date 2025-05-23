This folder contains scripts that allow you to test calling
Supabase directly through the Supabase JS library.

I've been using it to write and test stored procedures
because Supabase doesn't have any way to call them

This is not a playground, any file in here should work
without further adjustment. But do feel free to add files
anytime you find yourself running a script regularly during
development.

## Setup

Each of these files takes in an email and password from `./credentials.js`. Create this file
using `credentials-example.js`.

From there you can run the stored procedfure in a file by executing
```
node src/api-examples/[rest_of_file_path]
```
Some editors also let you right click on a file to run it.