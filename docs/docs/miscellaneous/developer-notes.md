---
permalink: /docs/developer-notes/
---

# Developer Notes

## Setup development environment

Install Visual Studio Code and [recommended extensions](https://github.com/bcgov/NotifyBC/blob/main/.vscode/extensions.json).

Multiple run configs have been created to facilitate debugging server, client, test and docs.

::: warning Client certificate authentication doesn't work in client debugger
Because Vue cli webpack dev server cannot proxy passthrough HTTPS connections, client certificate authentication doesn't work in client debugger. If testing client certificate authentication in web console is needed, run `npm run build` to generate prod client distribution and launch server debugger on https://localhost:3000
:::

## Automated Testing

_NotifyBC_ uses [Jest](https://jestjs.io/) test framework bundled in NestJS. To launch test, run `npm run test:e2e`. A _Test_ launch config is provided to debug in VS Code.

Github Actions runs tests as part of the build. All test scripts should be able to run unattended, headless, quickly and depend only on local resources.

To run automated testing on Windows, Docker Desktop needs to be running.

### Writing Test Specs

Thanks to [supertest](https://github.com/visionmedia/supertest) and [MongoDB In-Memory Server](https://github.com/nodkz/mongodb-memory-server), test specs can be written to cover nearly end-to-end request processing workflow (only _sendMail_ and _sendSMS_ need to be mocked). This allows test specs to anchor onto business requirements rather than program units such as functions or files, resulting in regression tests that are more resilient to code refactoring.
Whenever possible, a test spec should be written to

- start at a processing phase as early as possible. For example, to test a REST end point, start with the HTTP user request.
- assert outcome of a processing phase as late and down below as possible - the HTTP response body/code, the database record created, for example.
- avoid asserting middleware function input/output to facilitate code refactoring.
- mock email/sms sending function (implemented by default). Inspect the input of the function, or at least assert the function has been called.

## Install Docs Website

If you want to contribute to _NotifyBC_ docs beyond simple fix ups, run

```sh
cd docs && npm install && npm run dev
```

If everything goes well, the last line of the output will be

```
> VuePress dev server listening at http://localhost:8080/NotifyBC/
```

You can now browse to the local docs site [http://localhost:8080/NotifyBC](http://localhost:8080/NotifyBC/)

## Publish Version Checklist

1. update _version_ in _package.json_
2. run `npm i`
3. globally find and replace older version number referenced in _docs_ folder
4. update _version_ _appVersion_ in _helm/Chart.yaml_ (major/minor only)
5. update [What's new](../getting-started/what's-new.md) (major/minor only)
6. create a new Github release
