---
permalink: /docs/quickstart/
---

# Quick Start

For the impatient, to get _NotifyBC_ instance up and running on localhost, you need

- internet connection
- Node.js
- git
- (Windows only) Docker Desktop running

then run

```sh
docker run --rm --pull always -dp 6379:6379 redis # only on Windows
git clone https://github.com/bcgov/NotifyBC.git
cd NotifyBC
npm i && npm run build
npx cross-env NOTIFYBC_WORKER_PROCESS_COUNT=1 npm run start
# wait till console displays "Server is running at http://0.0.0.0:3000/api"
# => Now browse to http://localhost:3000
```

If you're running into problems, check out full [installation](../installation/) guide.
