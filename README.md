# Multi-Agent Real Estate Assistant Chatbot

An AI-powered real estate assistant chatbot designed to solve property-related issues and answer tenancy FAQs using two distinct agents. This system features both image and text-based interaction, built using React (Vite) for the frontend and Flask + Gemini API for the backend.

---

## ✨ Features

- ✅ **Agent 1: Property Issue Detection & Troubleshooting**
  - Accepts property images and optional text descriptions
  - Detects common issues like mold, water damage, cracks, etc.
  - Provides actionable advice (e.g., "Call a plumber", "Use anti-damp paint")
  - Capable of follow-up questions for better diagnosis

- ✅ **Agent 2: Tenancy FAQ Assistant**
  - Handles location-based tenancy questions
  - Jurisdiction-aware responses for rent, eviction, and deposits
  - Keeps consistent role and never breaks character

- 🌟 **Animated Gradient UI**
  - Tailwind CSS-based vibrant UI with floating backgrounds and blur effects

---

## 🧰 Tech Stack

### 🎨 Frontend
- **ReactJS** (Vite-based project setup)
- **TailwindCSS** (Styling with utility-first approach)
- **React Markdown** (Chat rendering with support for markdown + GFM)
- **Deployed via Vercel** (Frontend hosting)

### 🧠 AI / Backend
- **Flask** (REST API for agent communication)
- **Google Gemini API (1.5 Flash)** via `google.generativeai`
  - **Used for both text and multimodal (image+text) models**
  - **AI Studio** used to configure and manage models
- **System Instruction Fine-tuning** (Role enforcement for agents)
- **Deployed via Vercel** (Flask backend hosted using `vercel.json`)

### 🖼️ Image Analysis
- **Google Gemini Multimodal LLM** (via Google AI Studio)
  - Accepts and processes uploaded property images
  - Detects issues like mold, water stains, cracks, etc.

### 🌍 Other Tools
- **CORS** for frontend-backend integration
- **Dotenv** to securely manage environment variables
- **Axios** for frontend HTTP requests
- **Vercel** for serverless, scalable deployment

---

## 📂 Project Structure

```
├── real-estate-bot-frontend
│   ├── src
│   │   ├── App.jsx          # Main UI logic
│   │   ├── assets/
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── real-estate-chatbot-ai-api
    ├── api/
    │   └── index.py         # Flask app with agent1 and agent2 routes
    ├── requirements.txt
    └── vercel.json
```

---

## 📈 Logic: Agent Routing

**Frontend:**
- Users land on an agent selection screen
- Agent 1 expects optional text and image (with preview)
- Agent 2 expects only text input for tenancy queries

**Backend:**
- `/api/agent1`: Accepts `multipart/form-data` with `text`, `image`, and `history`
- `/api/agent2`: Accepts JSON with `query`, `location`, and `history`
- Both endpoints use Google Gemini API (1.5 Flash) for response generation via AI Studio

---

## ⚙️ Installation Instructions

### 💻 Frontend Setup (React + Vite)

```bash
cd real-estate-bot-frontend
npm install
npm run dev
```

### ⚙️ Backend Setup (Flask + Gemini API)

```bash
cd real-estate-chatbot-ai-api
pip install -r requirements.txt
cd api
python index.py
```

> Ensure `.env` file includes your Gemini API key in the ai api folder also include `.env` in the frontend folder with the hosted link:
In AI API FOLDER
```
GEMINI_API_KEY=your_api_key_here
```
In VITE FRONTEND FOLDER
```
VITE_SOME_URL=ai api hosted link or locally then http://localhost:5000
```


## 👥 Use Case Examples

### Agent 1 (Issue Detection)

**User:** “What’s wrong with this wall?” (uploads image)

**Response:**
> "It appears there's mold due to water seepage. Use a dehumidifier and check for plumbing leaks."

### Agent 2 (Tenancy FAQ)

**User:** “Can my landlord evict me without notice?”

**Response:**
> "In most jurisdictions, landlords must give written notice before eviction unless there's illegal activity."

---

## 🎨 Screenshots (Insert during documentation)

1. **Agent Selection Screen** – Screenshot: `screenshots/agent-selection.png`
2. **Agent 1 Chat Interface** – Screenshot: `screenshots/agent1-chat.png`
3. **Agent 2 Chat Interface** – Screenshot: `screenshots/agent2-chat.png`

---

## 📹 Demo Video (Replace with actual link)

A walkthrough video of the working chatbot is available here:

🔗 [Watch Demo Video](https://drive.google.com/file/d/your-demo-video-link-here)



## 🚀 Deployment

- **Frontend:** https://multi-agent-real-estate-chatbot.vercel.app
- **Backend:** Deployed via `vercel.json` in the backend folder
- **AI Models:** Configured and deployed via **Google AI Studio** using Gemini 1.5 Flash



---


## 📄 License

This project is licensed under the **MIT License**.
🔗 [MIT LICENSE](https://github.com/abhaydixit07/multi-agent-real-estate-chatbot/blob/main/LICENSE)



