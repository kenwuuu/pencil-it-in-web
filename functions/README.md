# Common Errors

- `Unexpected end of JSON input`
  - How to debug: print `req` to see what data we're missing in the request
  - Also, `GET` requests don't allow bodies, so if we're getting data that 
requires a body, that's actually a `POST`