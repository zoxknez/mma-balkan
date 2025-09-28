export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

function log(level: LogLevel, ...args: unknown[]) {
  if (isProd && level === 'debug') return; // drop debug in prod
  // Still allow warnings/errors in prod for visibility during monitoring
  // eslint-disable-next-line no-console
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  fn(...args);
}

export const logger = {
  debug: (...args: unknown[]) => log('debug', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
};
