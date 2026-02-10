import {genkit} from 'genkit';
import {ollama} from 'genkitx-ollama';
import { config } from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    ollama({
      serverAddress: process.env.OLLAMA_BASE_URL,
      defaultOptions: {
        requestHeaders: {
          'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
        },
      },
    }),
  ],
  model: 'ollama/llama2',
});
