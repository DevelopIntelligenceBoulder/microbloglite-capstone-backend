# Microblog API

This API represents the basic fetures of a twitter(ish) site. The API supports Users, Authentication, Posts, and Likes. Users should be able to register, sign in, create posts, delete posts, like posts, and update their profile information.

## Basic setup for local development
The API requires uses Mongoose and a MongoDB database. To work with the API locally you will need to create the DB locally, create a local .env file with your database URL, and setup your .env file.

### Create the Database
 - Make sure MongoDB is installed on your machine. 

### Set up the code
- For then clone this repository
- Change directories to the cloned repository `cd microblogLite`
- create your `.env` file by copying the example provided `cp .env.example .env`
- edit the `.env` file to include something similar to the following example:
  ```
  DATABASE_URL="mongodb://127.0.0.1:227017/DB_NAME_HERE"
  JWT_SECRET="whateveryouwant"
  ```

### Install dependencies
- From the command line, type `npm install`
- From the command line, type `npm start` or `npm run watch` if you want to leverage `nodemon`.
- Test the API by making a accessing `http://localhost:5000` in a broswer

> **NOTE:** visiting `http://localhost:5000` will take you to a swagger/openapi documentation that describes and allows you test all the endpoints.

### HTML sanitization
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
