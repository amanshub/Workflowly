# 🚀 Quick Setup Guide for WorkFlowly

## ⚡ 5-Minute Setup (For Hackathon Demo)

### Step 1: Install Node.js (if not already installed)

**Windows:**
1. Download from: https://nodejs.org/
2. Run the installer
3. Verify installation: Open PowerShell and type `node --version`

### Step 2: Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

### Step 3: Configure Backend

1. Open `backend/.env.example`
2. Replace `your_gemini_api_key_here` with your actual API key
3. Save the file as `backend/.env` (remove `.example`)

### Step 4: Install Dependencies

Open PowerShell in the project folder:

```powershell
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 5: Run the Application

**Terminal 1 (Backend):**
```powershell
cd backend
npm start
```

Wait for: `🚀 WorkFlowly Backend running on http://localhost:3001`

**Terminal 2 (Frontend):**
```powershell
npm run dev
```

Wait for: `▲ Next.js ... - Local: http://localhost:3000`

### Step 6: Test It!

1. Open browser: http://localhost:3000
2. Click "Meeting" source type
3. Drag & drop `demo-data/meeting-transcript.txt`
4. Click "Extract Tasks with AI"
5. Watch the magic happen! ✨

---

## 🎯 Demo Checklist

Before your hackathon presentation:

- [ ] Node.js installed and working
- [ ] Gemini API key configured in `backend/.env`
- [ ] Both servers running (backend on 3001, frontend on 3000)
- [ ] Tested with at least one demo file
- [ ] Browser open to http://localhost:3000
- [ ] Demo files ready in `demo-data/` folder

---

## 🐛 Common Issues

**Issue:** "npm is not recognized"
**Fix:** Restart PowerShell after installing Node.js

**Issue:** Backend shows API key warning
**Fix:** Make sure you saved the file as `.env` not `.env.example`

**Issue:** Frontend can't connect to backend
**Fix:** Check that backend is running on port 3001

---

## 📱 For Live Demo

1. **Pre-load demo files** - Have them ready to drag & drop
2. **Clear existing tasks** - Start with empty board for impact
3. **Show confidence scores** - Highlight AI uncertainty detection
4. **Demonstrate editing** - Show how easy it is to modify tasks
5. **Explain the value** - "Saves hours of manual task creation"

---

**Need more help?** Check the full README.md file!
