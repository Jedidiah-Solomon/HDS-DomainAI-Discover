# HDS DomainAI Discover

This is a Next.js application that uses AI to help users discover the perfect domain name for their projects. It provides domain suggestions and in-depth market analysis.

## Features

-   **AI-Powered Domain Suggestions:** Get creative and relevant domain name ideas based on your project details.
-   **Deep Market Analysis:** Go beyond simple suggestions with a comprehensive analysis of market viability, trends, SEO potential, and more for any domain.
-   **Powered by Ollama:** Leverages a self-hosted Ollama instance for fast and reliable AI capabilities.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   An Ollama instance accessible via a URL.

### 1. Environment Variables

First, you need to set up your environment variables. Create a file named `.env` in the root of the project and add the connection details for your Ollama instance.

```bash
# .env
OLLAMA_BASE_URL=https://ollama.withhordanso.com
OLLAMA_API_KEY=your-ollama-api-key-here
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
