// import { Logtail } from '@logtail/node';
// import { LogtailTransport } from '@logtail/winston';
// import winston from 'winston';
// import config from '../config';

// const logtail = new Logtail(process.env.LOGTAIL_TOKEN || '');

// export const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [new LogtailTransport(logtail)],
// });

// logger.info('Hello logger');
// logtail.flush();

// // For dev fallback: also log to console in non-production
// if (config.env !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     })
//   );
// }

//------------------------------------------------------------------------------

// import path from 'path';
// import { createLogger, format, transports } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
// const { combine, timestamp, label, printf } = format;

// //Customm Log Format

// const myFormat = printf(({ level, message, label, timestamp }) => {
//   const date = new Date(timestamp as string);
//   const hour = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();
//   return `${date.toDateString()} ${hour}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
// });

// const logger = createLogger({
//   level: 'info',
//   format: combine(label({ label: 'BT' }), timestamp(), myFormat),
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: path.join(
//         process.cwd(),
//         'logs',
//         'winston',
//         'successes',
//         'btu-%DATE%-success.log'
//       ),
//       datePattern: 'YYYY-DD-MM-HH',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '30d',
//     }),
//   ],
// });

// const errorLogger = createLogger({
//   level: 'error',
//   format: combine(label({ label: 'BT' }), timestamp(), myFormat),
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: path.join(
//         process.cwd(),
//         'logs',
//         'winston',
//         'errors',
//         'btu-%DATE%-error.log'
//       ),
//       datePattern: 'YYYY-DD-MM-HH',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '30d',
//     }),
//   ],
// });

// export { errorLogger, logger };
