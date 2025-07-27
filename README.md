<div align="center">
  <img src="echoforge_logo.png" alt="Echoforge Logo" width="200"/>


  # EchoForge - AI-Powered Podcast Creation Platform

  [![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  <p>Create and publish AI-generated podcasts with customizable voices and automated content generation</p>
</div>

## Overview

EchoForge is a powerful platform that allows users to create professional-quality podcasts using AI. The platform leverages OpenAI's latest models to generate engaging content, convert text to lifelike speech, and create custom podcast artwork.
- **$FORGE CA:** 65JFYzMa5jkTm6eQ4qLez2YGc5MEJafosAmWZ4Rfpump
- **Twitter:** [https://x.com/echoforgeai](https://x.com/echoforgeai)

## Features

- 🎙️ High-definition AI voice generation with premium voice options (alloy, shimmer, nova, echo, fable, onyx)
- 🤖 GPT-4o powered intelligent content generation with proper podcast scripting
- 🎨 AI Image generation for stunning podcast thumbnails (DALL-E 3)
- 🎵 Interactive audio player with progress tracking
- 🔍 Advanced podcast search and discovery
- 📱 Fully responsive design across all devices
- 🤝 Automated metadata generation with titles and descriptions
- 🔄 Streamlined publishing workflow

## Tech Stack

### Frontend
- Next.js 14.2
- TypeScript
- Tailwind CSS
- Framer Motion
- Convex
- Radix UI Components
- Uploadstuff

### Backend
- OpenAI API (GPT-4o, TTS-1-HD, DALL-E 3)
- Convex Database & Storage
- Node.js

## Getting Started

1. Clone the repository:

    ```console
    git clone https://github.com/dmitrithegoat/echoforgeai.git
    cd echoforgeai
    ```

2. Install dependencies:

    ```console
    pnpm install
    ```

3. Set up environment variables in `.env.local`:

    ```
    OPENAI_API_KEY=your_openai_api_key
    NEXT_PUBLIC_CONVEX_URL=your_convex_url
    ```

4. Start the Convex development server:

    ```console
    pnpm convex
    ```

5. In a new terminal, start the Next.js development server:

    ```console
    pnpm dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

1. Deploy the Convex backend:

    ```console
    pnpm convex:deploy
    ```

2. Build the Next.js application:

    ```console
    pnpm build
    ```

3. Deploy to your hosting platform of choice (Vercel recommended):

    ```console
    # If using Vercel
    vercel
    
    # For production deployment
    vercel --prod
    ```

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/convex` - Convex backend functions and schema
- `/public` - Static assets
- `/hooks` - Custom React hooks
- `/providers` - React context providers
- `/constants` - Application constants and configurations
- `/types` - TypeScript type definitions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.