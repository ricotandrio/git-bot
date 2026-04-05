export interface LLMProvider {
  getClient(): any;
  generate(instruction: string, prompt: string): Promise<string>;
}