# WorkFlowly - AI Workflow Automator

**Tagline:** Turn meetings, emails and documents into action — automatically.

WorkFlowly is an AI-powered workflow automation tool that transforms unstructured communication (emails, meetings, documents) into structured, actionable tasks using Google's Gemini AI.

![WorkFlowly Demo](https://img.shields.io/badge/Status-Hackathon%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%20Pro-blue)

## 🚀 Features

- **📧 Email → Tasks**: Extract action items from emails automatically
- **🎤 Meeting Recap**: Upload meeting transcripts and get decisions + action items
- **📄 Document Digest**: Process PDFs and documents to extract key takeaways
- **📋 Kanban Board**: Visual task management with Backlog, In Progress, and Done columns
- **🤖 AI-Powered**: Uses Gemini Pro for intelligent extraction with confidence scores
- **⚡ Real-time Updates**: Live task board updates using SWR
- **🎨 Premium UI**: Modern, responsive design with Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Gemini API Key** - [Get it free from Google AI Studio](https://makersuite.google.com/app/apikey)

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
cd WorkflowAgent
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure Environment Variables

#### Backend Configuration

1. Copy the example environment file:
```bash
cd backend
copy .env.example .env
```

2. Edit `backend/.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
STORAGE_PATH=./storage
UPLOADS_PATH=./uploads
```

#### Frontend Configuration

The frontend `.env.local` is already configured. If needed, verify it contains:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🎯 Running the Application

### Option 1: Run Both Servers Separately (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
🚀 WorkFlowly Backend running on http://localhost:3001
✅ Gemini API key configured
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### Option 2: Quick Start (if you have Node.js installed)

Open two terminal windows and run:

**Terminal 1:**
```bash
cd backend && npm start
```

**Terminal 2:**
```bash
npm run dev
```

## 🎮 Using WorkFlowly

1. **Open your browser** to `http://localhost:3000`

2. **Select Source Type**: Choose Meeting, Email, or Document

3. **Upload or Paste Content**:
   - Drag & drop a file (TXT, PDF, DOCX)
   - OR paste text directly

4. **Extract Tasks**: Click "Extract Tasks with AI"

5. **Manage Tasks**: 
   - View tasks in the Kanban board
   - Edit assignees and due dates
   - Move tasks between columns
   - Delete completed tasks

## 📁 Demo Data

Try the pre-made demo files in the `demo-data/` folder:

- **`sample-email.txt`** - Marketing campaign email with 5 action items
- **`meeting-transcript.txt`** - Sprint planning meeting with multiple tasks
- **`project-brief.txt`** - Mobile app redesign project document

## 🏗️ Project Structure

```
WorkflowAgent/
├── app/                          # Next.js frontend
│   ├── components/               # React components
│   │   ├── TaskBoard.tsx        # Kanban board
│   │   ├── TaskCard.tsx         # Individual task cards
│   │   ├── UploadPanel.tsx      # File upload interface
│   │   └── ProcessingStatus.tsx # Loading/error states
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── backend/                      # Express backend
│   ├── routes/                  # API routes
│   │   ├── ingest.js           # File/text ingestion
│   │   ├── process.js          # AI processing
│   │   └── tasks.js            # Task CRUD operations
│   ├── services/               # Business logic
│   │   ├── gemini.js           # Gemini AI integration
│   │   └── storage.js          # File-based storage
│   └── server.js               # Express server
├── demo-data/                   # Sample files for testing
└── README.md                    # This file
```

## 🔌 API Endpoints

### Ingest Routes
- `POST /api/ingest/file` - Upload file (PDF, TXT, DOCX)
- `POST /api/ingest/text` - Submit text directly

### Process Routes
- `POST /api/process/source` - Process source with Gemini AI

### Task Routes
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task manually
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🤖 How It Works

1. **Upload**: User uploads a file or pastes text
2. **Parse**: Backend extracts text (PDF parsing for PDFs)
3. **AI Processing**: Gemini AI analyzes content with specialized prompts
4. **Extraction**: AI returns structured JSON with action items
5. **Task Creation**: Backend creates tasks from AI output
6. **Display**: Frontend shows tasks in Kanban board
7. **Management**: User can edit, move, and delete tasks

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, SWR
- **Backend**: Node.js, Express
- **AI**: Google Gemini Pro
- **Storage**: File-based JSON (easily upgradable to Firestore/MongoDB)
- **File Processing**: pdf-parse, multer

## 🔒 Security & Privacy

- **Minimal Data Storage**: Only stores task metadata
- **Local Processing**: All data stays on your server
- **No External Sharing**: Files are processed locally
- **API Key Security**: Environment variables for sensitive data

## 🐛 Troubleshooting

### "npx is not recognized" or "node is not recognized"

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Backend shows "GEMINI_API_KEY not set"

**Solution**: 
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `backend/.env` file
3. Restart the backend server

### "Failed to fetch tasks" error

**Solution**: Make sure the backend is running on port 3001

### File upload fails

**Solution**: Check that the `backend/uploads` directory exists (it's created automatically)

### AI returns invalid JSON

**Solution**: The system has multiple fallback strategies. If it still fails, try simplifying your input text.

## 📊 Demo Script (for Hackathon Presentation)

### 1. Introduction (30 seconds)
"WorkFlowly turns messy communication into organized action. Watch as we transform a meeting transcript into actionable tasks in seconds."

### 2. Live Demo (2 minutes)
1. Show empty task board
2. Upload `meeting-transcript.txt`
3. Click "Extract Tasks with AI"
4. Show extracted tasks with confidence scores
5. Demonstrate task editing and status changes

### 3. Key Features Highlight (1 minute)
- "AI extracts assignees and due dates automatically"
- "Confidence scores flag uncertain items for review"
- "Works with emails, meetings, and documents"

### 4. Value Proposition (30 seconds)
"Save hours every week. No more manual task creation. Let AI handle the busywork."

## 🚀 Future Enhancements

- [ ] Gmail OAuth integration
- [ ] Slack notifications
- [ ] Calendar integration for due dates
- [ ] Audio file transcription
- [ ] Weekly progress reports
- [ ] Team collaboration features
- [ ] Mobile app


