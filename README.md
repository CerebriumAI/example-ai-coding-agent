# AI Coding Assistant Frontend

![AI Coding Assistant](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6SsfgFGpT2Fcj74vMAl3cXK5KpN7HW.png)

A Next.js frontend for an AI-powered coding assistant, inspired by tools like v0.dev and bolt.new. This repository contains the frontend implementation discussed in the tutorial ["Building Your Own AI Coding Assistant"](tutorial-link).

## Overview

This frontend application provides the user interface for interacting with an AI coding assistant that can:
- Generate code from natural language prompts
- Display real-time code generation
- Show file structure and component organization
- Preview deployed code in a sandboxed environment with E2B

The backend implementation, which handles the AI model and code generation, is covered in detail in the accompanying tutorial.

## Features

- 🎯 Clean, intuitive chat interface
- 📝 Real-time code streaming and display
- 🌳 File tree visualization
- 🔍 Realtime Code preview
- 🚀 Instant preview deployment with E2B
- 💾 Local storage for conversation history

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- WebSocket for real-time communication

## Prerequisites

Before running this frontend, ensure you have:
- Node.js 18.0.0 or higher
- A running backend instance (see the tutorial for setup instructions)
- Environment variables configured

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/CerebriumAI/example-ai-coding-agent.git
cd exampe-ai-coding-agent
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:

Create a `.env` file:
```
CEREBRIUM_SOCKET_URL=your_backend_websocket_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Implementation

This frontend is designed to work with the AI coding assistant backend described in the tutorial ["Building Your Own AI Coding Assistant"](tutorial-link). The tutorial covers:

- Setting up a FastAPI backend with WebSocket support
- Implementing an AI model for code generation
- Deploying code to a sandboxed environment
- Real-time communication between frontend and backend

To set up the complete system, follow the tutorial to implement the backend before connecting it to this frontend.