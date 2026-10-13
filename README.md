# 🚀 Techarket Web Builder

> **The Universal AI-Powered Development Platform for Everyone** — Build apps and websites in minutes using Local AI (Ollama) or Cloud AI (Gemini, OpenAI, Claude, Grok), directly in your browser.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Highlights

- 🧠 **Dual AI Architecture**: Use **100% Private Local AI** via [Ollama](https://ollama.ai) (Mistral, Code Llama, DeepSeek, Gemma, Phi) or **Cloud AI APIs** (Google Gemini, OpenAI GPT-4, Anthropic Claude, Grok, and more).
- 💻 **Monaco Code Editor**: Professional-grade VS Code editor in the browser with full syntax highlighting, file tree navigation, and code completion.
- 📱 **Intelligent Live Preview**: Instant live preview with device simulation (Desktop, Tablet, Mobile) and responsive testing.
- ⚡ **Zero Server Costs (100% Free)**: Runs entirely client-side. Visitors use Bring-Your-Own-Key (BYOK) for Cloud AI or local Ollama — costing $0 in hosting and compute!
- 🗄️ **Database Schema Generation**: Auto-generate schemas, tables, and connection boilerplate for **Supabase (PostgreSQL)** and **Firebase (Firestore)**.
- 📦 **One-Click Export**: Download complete, production-ready project archives as `.zip` or push directly to GitHub.
- 🖥️ **Simulated Terminal**: Interactive terminal console simulating `npm install`, `dev`, `build`, and package processes.
- 🎨 **Pre-built Component Library**: Ready-to-use modern UI component blocks for rapid assembly.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Archiving**: [JSZip](https://stuk.github.io/jszip/) & [FileSaver](https://github.com/eligrey/FileSaver.js/)

---

## 🚀 Quick Start (Run Locally)

### 1. Clone the repository
```bash
git clone https://github.com/techarket-design/techarket-web-builder.git
cd techarket-web-builder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Deploy to Vercel for Free

### Option A: 1-Click Deployment
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository: `techarket-design/techarket-web-builder`.
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**! Your site will be live at `https://techarket-web-builder.vercel.app` in under 60 seconds with free auto-renewing SSL.

### Option B: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🤖 Connecting AI Models

### 1. Free Cloud AI (Recommended for Web Visitors)
Techarket supports Bring-Your-Own-Key (BYOK):
- **Google Gemini**: Get a free API key at [Google AI Studio](https://aistudio.google.com/).
- **Groq / OpenRouter / OpenAI**: Enter your API key in the AI Configuration Panel (`Settings` > `AI Providers`). Keys are saved securely in your browser's `localStorage` and never sent to any intermediate server.

### 2. Local AI (Ollama)
Run private local models with Ollama:
1. Install [Ollama](https://ollama.ai).
2. Pull your model:
   ```bash
   ollama pull mistral
   ```
3. To allow web browsers to connect to your local Ollama:
   - **Windows (PowerShell)**:
     ```powershell
     $env:OLLAMA_ORIGINS="*"
     ollama serve
     ```
   - **macOS / Linux**:
     ```bash
     OLLAMA_ORIGINS="*" ollama serve
     ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
