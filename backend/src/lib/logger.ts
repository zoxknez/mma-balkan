import { env } from './env';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

class Logger {
  private isProduction = env.NODE_ENV === 'production';

  private formatLog(entry: LogEntry): string {
    if (this.isProduction) {
      // JSON format for production (easier to parse)
      return JSON.stringify(entry);
    }

    // Pretty format for development
    const emoji = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '🚨',
    }[entry.level];

    return `${emoji} [${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context ? { context } : {}),
      ...(!this.isProduction && typeof error !== 'undefined' ? { error } : {}),
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case LogLevel.DEBUG:
        if (!this.isProduction) console.debug(formatted, context, error);
        break;
      case LogLevel.INFO:
        console.info(formatted, this.isProduction ? undefined : context);
        break;
      case LogLevel.WARN:
        console.warn(formatted, this.isProduction ? undefined : context);
        break;
      case LogLevel.ERROR:
        console.error(formatted, this.isProduction ? undefined : { context, error });
        break;
    }

    // TODO: Send to external logging service (Datadog, CloudWatch, etc.)
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

export const logger = new Logger();

