---
permalink: /docs/developer-notes/
---

# Developer Notes

## Automated Testing

Test framework is created by LoopBack lb4 CLI, using LoopBack provided tool set and following LoopBack [best practices](https://loopback.io/doc/en/lb4/Testing-your-application.html). To launch test, run `yarn test`. A _Test_ launch config is provided to debug in VS Code.

Github Actions runs tests as part of the build. All test scripts should be able to run unattended, headless, quickly and depend only on local resources.

### Writing Test Specs

Thanks to [supertest](https://github.com/visionmedia/supertest) and LoopBack's [memory database connector](https://loopback.io/doc/en/lb4/Memory-connector.html), test specs can be written to cover nearly end-to-end request processing workflow (only _sendMail_ and _sendSMS_ need to be mocked). This allows test specs to anchor onto business requirements rather than program units such as functions or files, resulting in regression tests that are more resilient to code refactoring.
Whenever possible, a test spec should be written to

- start at a processing phase as early as possible. For example, to test a REST end point, start with the HTTP user request.
- assert outcome of a processing phase as late and down below as possible - the HTTP response body/code, the database record created, for example.
- avoid asserting middleware function input/output to facilitate code refactoring.
- mock email/sms sending function (implemented by default). Inspect the input of the function, or at least assert the function has been called.

## Code Coverage

After running `yarn test`, nyc code coverage report is generated in git ignored folder _/coverage_.

## Install Docs Website

If you want to contribute to _NotifyBC_ docs beyond simple fix ups, run

```sh
yarn --cwd docs install
yarn --cwd docs dev
```

If everything goes well, the last line of the output will be

```
> VuePress dev server listening at http://localhost:8080/NotifyBC/
```

You can now browse to the local docs site [http://localhost:8080/NotifyBC](http://localhost:8080/NotifyBC/)
