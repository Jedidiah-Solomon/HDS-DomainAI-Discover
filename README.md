# HDS DomainAI Discover

This is a Next.js application that uses AI to help users discover the perfect domain name for their projects. It provides domain suggestions and in-depth market analysis.

## Features

-   **AI-Powered Domain Suggestions:** Get creative and relevant domain name ideas based on your project details.
-   **Deep Market Analysis:** Go beyond simple suggestions with a comprehensive analysis of market viability, trends, SEO potential, and more for any domain.
-   **Powered by OpenRouter:** Leverages the OpenRouter API to access a variety of powerful large language models.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   An OpenRouter API Key.

### 1. Environment Variables

First, you need to set up your environment variables. Create a file named `.env` in the root of the project and add your OpenRouter API key. You can also customize the models used for suggestions and analysis.

```bash
# .env
# Get your API key from https://openrouter.ai/keys
OPENROUTER_API_KEY="your-openrouter-api-key-here"

# (Optional) Customize the models used for AI tasks
OPENROUTER_SUGGESTION_MODEL="mistralai/mistral-7b-instruct"
OPENROUTER_ANALYSIS_MODEL="anthropic/claude-instant-v1"
```

### 2. Installation

Clone the repository and install the dependencies:

```bash
npm install
```
or
```bash
yarn install
```

### 3. Running the Development Server

Once the dependencies are installed and your environment variables are set up, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Runs the linter to check for code quality issues.
