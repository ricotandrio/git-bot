import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/core/config';

const genAI = new GoogleGenerativeAI(config.LLM.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
