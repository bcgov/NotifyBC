import path from 'path';
module.exports = {
  all: {
    'serve-favicon': {params: [path.join(__dirname, '..', 'favicon.ico')]},
    compression: {},
    helmet: {
      params: [
        {
          hsts: {
            maxAge: 0,
          },
        },
      ],
    },
  },
  apiOnly: {
    morgan: {
      params: [
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status ":req[X-Forwarded-For]"',
      ],
      enabled: false,
    },
  },
};
