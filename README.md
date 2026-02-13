# HDS DomainAI Discover

This is a Next.js application that uses AI to help users discover the perfect domain name for their projects. It provides domain suggestions and in-depth market analysis.

## Features

-   **AI-Powered Domain Suggestions:** Get creative and relevant domain name ideas based on your project details.
-   **Deep Market Analysis:** Go beyond simple suggestions with a comprehensive analysis of market viability, trends, SEO potential, and more for any domain.
-   **Powered by Ollama:** Leverages the power of large language models through a self-hosted or managed Ollama instance.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   Access to an Ollama instance.

### 1. Environment Variables

First, you need to set up your environment variables. Create a file named `.env` in the root of the project and add the following variables, replacing the placeholder values with your actual Ollama configuration:

```bash
# Your Ollama instance URL
OLLAMA_BASE_URL=https://ollama.withhordanso.com

# Your Ollama API Key (if required by your endpoint)
OLLAMA_API_KEY=f13a09df51ab48c63a271d0b18af8ca812347dd43a10cc50e7c4c81395f91912

# The Ollama model to use for generation
OLLAMA_MODEL=llama2
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
