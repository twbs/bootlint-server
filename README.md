# Bootlint Server

[![NPM version](https://img.shields.io/npm/v/bootlint-server.svg)](https://www.npmjs.com/package/bootlint-server)
[![Build Status](https://img.shields.io/github/workflow/status/twbs/bootlint-server/Tests/master)](https://github.com/twbs/bootlint-server/actions?query=branch%3Amaster+workflow%3ATests)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg "MIT License")](https://github.com/twbs/bootlint-server/blob/master/LICENSE)
[![Dependency Status](https://img.shields.io/david/twbs/bootlint-server.svg)](https://david-dm.org/twbs/bootlint-server)
[![devDependency Status](https://img.shields.io/david/dev/twbs/bootlint-server.svg)](https://david-dm.org/twbs/bootlint-server?type=dev)

Run [Bootlint](https://github.com/twbs/bootlint-server) as a server.

## Getting Started

Install the module with: `npm install bootlint-server`

## What's this

Bootlint can also be run as an HTTP server that exposes a very simple API. Use `npm run start` to run the server.

By default, it runs on port `7070`. Set the `$PORT` environment variable to change which port it uses.

POST an HTML document to `/` and the document's lint problems will be returned as JSON.

The endpoint accepts an optional querystring argument named `disable`, whose value is a comma-separated list of linter IDs to disable.

Example:

```http
Request:
  POST / HTTP/1.1
  Content-Type: text/html

  <!doctype html>
  ...

Response:
  HTTP/1.1 200 OK
  Content-Type: application/json

  [
    {
      "id": "W003",
      "message": "<head> is missing viewport <meta> tag that enables responsiveness"
    },
    {
      "id": "W005",
      "message": "Unable to locate jQuery, which is required for Bootstrap's JavaScript plugins to work"
    },
    ...
  ]
```

## Contributing

The project's coding style is laid out in the ESLint configuration. Add unit tests for any new or changed functionality. Lint and test your code using the npm scripts.

Copyright (c) 2014-2020 The Bootlint Authors. Licensed under the MIT License.
