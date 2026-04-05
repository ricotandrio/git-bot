import { Integration } from "../integration.interface";
import { GITBOT_PROMPT } from "./prompts";
import { ASSISTANT_PROMPT } from "./prompts/assistant.prompt";
import { LLMProvider } from "./providers/llm.provider";

export class LLMIntegration implements Integration {
  name = "gemini";

  private client!: LLMProvider;

  async connect(llmProvider: LLMProvider) {
    this.client = llmProvider;
  }

  async execute(action: string, payload: any) {
    switch (action) {
      case "ask_question":
        return this.client.generate(ASSISTANT_PROMPT, payload.prompt);
      case "git_bot":
        return this.client.generate(GITBOT_PROMPT, payload);
      default:
        throw new Error(`Action ${action} not supported`);
    }
  }
}