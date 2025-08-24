# AI-Based WhatsApp Reminder Bot  

An AI-powered WhatsApp bot that helps users stay on top of their tasks!  
Users can send their **to-do items** over WhatsApp, and the bot will:  
- **Parse the task and extract date/time** using AI.  
- **Schedule reminders** using cron jobs.  
- **Send WhatsApp reminders** at the right time via [Baileys API](https://github.com/WhiskeySockets/Baileys).  

---

##  Features  
-  Add tasks via WhatsApp messages  
-  AI-based natural language parsing (e.g., "Remind me to call mom at 6 PM")  
-  Cron-based task scheduling  
-  Lightweight storage with SQLite  
-  WhatsApp messaging powered by Baileys  
-  Simple and self-hosted  

---

## Tech Stack  
- **Node.js** – Server-side runtime  
- **Baileys API** – WhatsApp Web API for messaging  
- **SQLite** – Lightweight database for storing tasks  
- **Cron Jobs** – Scheduling reminders  
- **AI/LLM** – Natural language understanding  

---

## `.env` File

Create a `.env` file in the root directory and add the following variables:

```env
PHONE_NUMBER=your_whatsapp_number
GEMINI_API_KEY=your_gemini_api_key
PINO_LOG_LEVEL=info
```
---

## 📂 Project Structure  

```bash
├── src
│   ├── index.ts              # Main entry point, starts the bot
│   ├── ai.ts                 # Calls AI model for parsing task content
│   ├── language.ts           # Custom messages and responses
│   ├── messages.ts           # Parses messages and sends WhatsApp replies
│   ├── dbQueries.ts          # Database queries
│   ├── Database
│   │   └── db.ts             # SQLite connection setup
│   └── cron
│       └── index.ts          # Cron scheduler for reminders
├── package.json
├── README.md
└── .env                      # Environment variables
```

## Setup & Installation  

### Clone the repository  
```bash
git clone https://github.com/Durgadp08/RemainderBot.git
cd RemainderBot
```
### Install dependencies
```bash
npm install
```
## Configure environment variables
```bash
Create a .env file in the root directory and add your details
```

## Running the Project
```bash
npm run cron
```
Running this command will generate a qr.png file in the project directory.

Scan this QR code with your WhatsApp app to log in and activate the bot.