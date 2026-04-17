import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import type { RunCommandPayload, RunCommandResult } from './terminal.types';

const exec = promisify(execCallback);

export class TerminalClient {
  constructor(private readonly defaultCwd: string = process.cwd()) {}

  async runCommand(payload: RunCommandPayload): Promise<RunCommandResult> {
    const { command, cwd, timeoutMs, env } = payload;

    try {
      const { stdout, stderr } = await exec(command, {
        cwd: cwd ?? this.defaultCwd,
        timeout: timeoutMs ?? 15_000,
        env: {
          ...process.env,
          ...(env ?? {}),
        },
        maxBuffer: 1024 * 1024,
      });

      return {
        stdout,
        stderr,
        exitCode: 0,
        signal: null,
        timedOut: false,
      };
    } catch (error) {
      const err = error as Error & {
        stdout?: string;
        stderr?: string;
        code?: number | null;
        signal?: NodeJS.Signals | null;
        killed?: boolean;
      };

      return {
        stdout: err.stdout ?? '',
        stderr: err.stderr ?? err.message,
        exitCode: err.code ?? null,
        signal: err.signal ?? null,
        timedOut: Boolean(err.killed),
      };
    }
  }
}
