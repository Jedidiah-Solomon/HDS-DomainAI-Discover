import {genkit} from 'genkit';
import { config } from 'dotenv';

config();

// Force CommonJS require to resolve module loading issues with this specific plugin.
const ollamaPlugin = require('genkitx-ollama');

export const ai = genkit({
  plugins: [
    ollamaPlugin.ollama({
      serverAddress: process.env.OLLAMA_BASE_URL,
      defaultOptions: {
        requestHeaders: {
          'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
        },
      },
    }),
  ],
  model: `ollama/${process.env.OLLAMA_MODEL || 'llama2'}`,
});
