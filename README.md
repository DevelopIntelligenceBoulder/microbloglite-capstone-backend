# Microblog API

This API represents the basic features of a Twitter-like site. The API supports Users, Authentication, Posts, and Likes. Users should be able to register, sign in, create posts, delete posts, like posts, and update their profile information.

## Setup
- Clone this repository to your machine and `cd` into the directory.
- In your terminal, **run `npm install`**.
- If your project is written in standard HTML, JavaScript, and CSS, rather than a framework like React or Angular, be sure to **run your front-end project via VS Code's Live Server extension or you may run into CORS errors**.

### Two ways to run this API server
#### Local MongoDB database
- If you want to run this API server with a **locally-installed database**, make sure MongoDB is installed on your machine and running as a service. To run the API server using this local database, simply run `npm run local` or `npm run local-watch`.
- If you get the error "PORT 5005 is already in use," you may have to stop a server which is already using that port, or you can override the port used by the MicroblogLite API server by modifying `PORT=5005` in the `"local"` script in `package.json` (choose a number between 3000 and 9000).

    For example, changing the PORT to 7337 would look like this:
    
    ```json
                             ↓↓↓↓
    "local": "cross-env PORT=7337 NODE_ENV=development JWT_SECRET=foobar node ./bin/www",
    ```

#### Cloud MongoDB database
- If you want to run this server with a **cloud database** (for example, in production), you will need to create a `.env` file by copying the `.env.example` file provided (`cp .env.example .env`) and edit it to include the correct connection details. Finally, run `npm start` or `npm watch`. A valid `.env` might look like this:
  ```
  DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@SUBDOMAINS.mongodb.net/microblogLite?retryWrites=true&w=majority"
  JWT_SECRET="whateveryouwant"
  ```

### Accessing the API docs
Visit [http://localhost:5005/](http://localhost:5005/) or [http://localhost:5005/docs](http://localhost:5005/docs) in your browser. You should see the MicroblogLite API documentation page.

### Testing the API in Postman
1. Create a new Workspace in Postman and then a new Collection.
2. Import [MicroblogLite_Test_Workflow.postman_collection.json](./MicroblogLite_Test_Workflow.postman_collection.json).
3. In the Environments panel, define a global variable `base_url` and set the value to the base URL for the server instance you would like to use (e.g. `http://localhost:5005` - _without_ a trailing slash). Save your change.
4. In the Collections panel, context-click (right-click) on the heading "MicroblogLite Test Workflow" and select "**Run collection**".
5. You will be presented with the Runner. No changes should need to be made to the default settings. Click the button "Rub MicroblogLite Test Workflow" after ensuring that your server is running (and running on the port you specified in Postman's `base_url` global variable).
6. If the API is running correctly, you should expect to see exclusively 200-level HTTP status codes in response to the requests.

## Notes on HTML sanitization
- Any HTML in the `username` and `fullName` fields will be removed automatically.
- Any HTML in the Post `text` and User `bio` fields will be sanitized. Some tags and attributes will be removed.
- Tags and attributes allowed are partially listed [here](https://www.npmjs.com/package/sanitize-html#default-options) under the `allowedTags` and `allowedAttributes` objects listed there. 
  - The following additional tags are allowed:
    - `<img>`
    - `<iframe>` but `autoplay` permission is removed, some additional security policies are being enforced, and only the following hostnames are permitted in the `src` attribute.
      - `www.youtube.com`
      - `open.spotify.com`
      - `embed.music.apple.com`
      - `player.vimeo.com`
      - `widget.deezer.com`
  - The following attributes are allowed on all elements:
    - alt
    - aria-*
    - class
    - data-*
    - lang
    - rel
    - title
    - translate
- Sanitizers are defined in `/services/sanitizers.js` and implemented in the controllers for the POST and PUT endpoints for Users and Posts.

## FOR MAINTAINERS

### Changes to the API (OpenAPI Spec and Postman Collection)

If changes are made to the API, you will need to correct the [OpenAPI spec](./specification.yaml) and [Postman Collection](./MicroblogLite_Test_Workflow.postman_collection.json) configurations manually. These are not yet configured to be generated from each other.

### Prism

[Prism](https://github.com/stoplightio/prism?tab=readme-ov-file#validation-proxy) helps us keep the OpenAPI/Swagger specification ([/specification.yaml](./specification.yaml)) in sync with the implementation. First ensure the Express server is running (`npm start`). Then run `npx prism proxy ./specification.yaml http://localhost:5005 --errors` or `npm run prism` to start the API validator proxy. Point your Postman client or front-end to the Prism server (likely http://127.0.0.1:4010). API requests sent through the Prism proxy will be validated against our OpenAPI spec before being passed onto the actual Express server.

### Passport versions

As of October 2024, the latest versions of Passport (v0.6.0 and v0.7.0) introduced a breaking change which ignores the `session: false` option, causing our current sessionless JWT implementation to error out, complaining that we aren't running session middleware. So right now, we're keeping Passport to v0.5.3. Hopefully, a future version will restore the sessionless functionality. Otherwise, we'll have to try to hold on v0.5.3 for as long as possible, replace Passport, or refactor our auth solution to use sessions to appease Passport.