import { Integration } from '../integration.interface';
import { TerminalClient } from './terminal.client';
import type {
  TerminalAction,
  RunCommandPayload,
  RunCommandResult,
} from './terminal.types';

export class TerminalIntegration implements Integration {
  name = 'terminal';

  private client!: TerminalClient;

  async connect(config?: { defaultCwd?: string }): Promise<void> {
    this.client = new TerminalClient(config?.defaultCwd);
  }

  async execute(
    action: TerminalAction,
    payload: RunCommandPayload,
  ): Promise<RunCommandResult> {
    if (!this.client) {
      this.client = new TerminalClient();
    }

    switch (action) {
      case 'run_command':
        return this.client.runCommand(payload);
      default:
        throw new Error(`Action ${action} not supported`);
    }
  }
}
