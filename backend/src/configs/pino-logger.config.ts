import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino/params';

export default registerAs(
  'pinoLogger',
  (): Params => ({
    forRoutes: ['/*path'],
    pinoHttp: {
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers["set-cookie"]',
        ],
        censor: '[SENSITIVE]',
      },

      // manual push to logstash
      //   transport: {
      //     target: 'pino-socket',
      //     options: {
      //       address: 'logstash',
      //       port: 5000,
      //       mode: 'tcp',
      //     },
      //   },
    },
  }),
);
