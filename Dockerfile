# syntax=docker/dockerfile:1
ARG nodeVersion=lts
# Check out https://hub.docker.com/_/node to select a new base image
FROM node:${nodeVersion}

RUN apt-get update && apt-get install curl libssl-dev -y

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Bundle app source code
COPY --chown=node . .

COPY <<EOF src/config.local.ts
module.exports = {
  queue: {
    connection: null,
  },
};
EOF

RUN npm i && npm run build && npm i --omit=dev

ENV HOST=0.0.0.0 PORT=3000 SMTP_PORT=2525 NODE_ENV=production NOTIFYBC_WORKER_PROCESS_COUNT=1

EXPOSE ${PORT} ${SMTP_PORT}
CMD [ "node", "." ]
