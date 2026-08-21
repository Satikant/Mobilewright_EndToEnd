import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { TestInfo } from '@playwright/test';
import type { Screen } from '@mobilewright/core';
import { env, type LogLevel } from '../config/env.ts';

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export class Logger {
  constructor(
    private readonly context: string,
    private readonly testInfo?: TestInfo,
  ) {}

  child(context: string): Logger {
    return new Logger(`${this.context}:${context}`, this.testInfo);
  }

  debug(message: string, extra?: Record<string, unknown>): void {
    this.write('debug', message, extra);
  }

  info(message: string, extra?: Record<string, unknown>): void {
    this.write('info', message, extra);
  }

  warn(message: string, extra?: Record<string, unknown>): void {
    this.write('warn', message, extra);
  }

  error(message: string, extra?: Record<string, unknown>): void {
    this.write('error', message, extra);
  }

  async attachScreenshot(screen: Screen, name: string): Promise<Buffer> {
    const fileName = `${sanitize(name)}.png`;
    const path = this.testInfo
      ? this.testInfo.outputPath(fileName)
      : join(env.logDir, 'screenshots', fileName);
    const buffer = await screen.screenshot({ path });
    if (this.testInfo) {
      await this.testInfo.attach(name, { body: buffer, contentType: 'image/png' });
    }
    this.info(`screenshot saved: ${name}`, { path });
    return buffer;
  }

  async attachText(name: string, body: string): Promise<void> {
    if (this.testInfo) {
      await this.testInfo.attach(name, { body, contentType: 'text/plain' });
    }
    this.debug(`attached text: ${name}`);
  }

  private write(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
    if (LEVELS[level] < LEVELS[env.logLevel]) return;
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      level,
      context: this.context,
      test: this.testInfo?.title,
      retry: this.testInfo?.retry,
      message,
      ...extra,
    });
    const printer = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    printer(line);
    const file = join(env.logDir, `${new Date().toISOString().slice(0, 10)}.log`);
    mkdirSync(dirname(file), { recursive: true });
    appendFileSync(file, `${line}\n`);
  }
}

function sanitize(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80);
}

export const rootLogger = new Logger('framework');
