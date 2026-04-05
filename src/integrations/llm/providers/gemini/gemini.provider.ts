import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string, model: string = "gemini-2.5-flash") {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({ model });
  }

  async generate(instruction: string, prompt: string): Promise<string> {
    const fullPrompt = `
      ${instruction}

      User:
      ${prompt}
    `.trim();

    const result = await this.model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return text;
  }
}