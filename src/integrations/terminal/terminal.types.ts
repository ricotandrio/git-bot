export type TerminalAction = 'run_command';

export type RunCommandPayload = {
  command: string;
  cwd?: string;
  timeoutMs?: number;
  env?: Record<string, string>;
};

export type RunCommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  timedOut: boolean;
};
