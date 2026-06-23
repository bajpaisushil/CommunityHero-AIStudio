# CommunityHero-AIStudio

A local React + Express app built with AI Studio patterns. This repo demonstrates community task automation for small societies, WhatsApp broadcast generation, resident engagement, finance transparency, and AI assistance.

## Features

- `GEMINI_API_KEY` support for Gemini AI responses.
- WhatsApp broadcast notice builder with copy-to-clipboard and Open WhatsApp flow.
- Excel/CSV flat registry import simulation for housing society dues and resident management.
- Resident engagement dashboard, community action hub, remote owner dashboard, and finance transparency insights.
- Local AI assistant UI with chat-style interaction.

## Local setup

### Prerequisites

- Node.js 20+ or latest LTS.
- npm installed.

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the project root with values like:

```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

- `GEMINI_API_KEY` is required for Gemini AI API calls.
- `APP_URL` is used for local app routing and links.

### Run locally

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

## Notes for judges

- If `GEMINI_API_KEY` is missing or invalid, the server still starts and uses fallback logic for text generation.
- The WhatsApp broadcaster section compiles message text and allows copying the notice directly.
- The app is built with Vite and `tsx` for running `server.ts` locally.

## Troubleshooting

- If UI buttons or text are invisible, ensure `npm install` has finished and refresh the browser.
- The main entrypoint is `server.ts`, and the UI is served via Vite middleware.

## Files of interest

- `server.ts` — Express server and Gemini AI initialization.
- `src/App.tsx` — main application layout and tabs.
- `src/components/SmallSocietyExcelWhatsApp.tsx` — WhatsApp notice generator.
- `src/components/LocalAIAssistant.tsx` — local AI chat assistant.
