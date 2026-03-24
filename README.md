<div align="center">

<img src="frontend/public/prism.svg" width="64" alt="SkillPrism logo" />

# SkillPrism

**Refract your potential. Land your role.**

Upload your CV · Paste a job offer · Get an AI-powered match score and personalized career gap analysis — in seconds.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3_70B-F55036?style=flat-square)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

---

</div>

## What is SkillPrism?

SkillPrism is a full-stack AI application that helps job seekers understand exactly how their profile matches a target job — and what to do about the gaps.

**The flow:**
1. **Upload CV** — PDF, DOCX, or TXT. Skills are extracted instantly using keyword-based NLP across 10 categories and 300+ technologies.
2. **Paste job offer** — Paste any job description from LinkedIn, Indeed, or anywhere.
3. **Get results** — Match score (0–100), skill-by-skill breakdown, radar chart, and a streamed AI gap analysis with a 30/60/90-day action plan.

---

## Features

| Feature | Details |
|---|---|
| **CV Parsing** | PDF, DOCX, TXT · Up to 5 MB |
| **Skill Extraction** | 300+ skills across 10 categories (Frontend, Backend, AI/ML, DevOps, Security…) |
| **Match Score** | 0–100 cosine-inspired scoring with label (Excellent / Strong / Good / Partial / Low) |
| **Gap Analysis** | Matched skills · Missing skills · Bonus skills · Radar chart by category |
| **AI Career Coach** | Real-time streamed analysis via Groq (Llama 3 70B) — action plan, resources, pro tips |
| **Keep-Alive Ping** | Frontend pings `/health` every 20s to prevent Render free-tier cold starts |
| **Dark UI** | Expert-level UI with Syne + DM Sans, animated score ring, gradient prism branding |

---

## Tech Stack

### Frontend — `frontend/`
| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + custom design system |
| State | Zustand |
| Charts | Recharts (Radar chart) |
| Markdown | react-markdown + remark-gfm |
| File upload | react-dropzone |
| HTTP | Axios |
| Streaming | Native `fetch` + Server-Sent Events |
| Hosting | Vercel |

### Backend — `backend/`
| Layer | Technology |
|---|---|
| Framework | FastAPI 0.111 + Uvicorn |
| PDF parsing | pdfplumber |
| DOCX parsing | python-docx |
| AI / LLM | Groq API (Llama 3 70B) |
| Streaming | FastAPI `StreamingResponse` (SSE) |
| Validation | Pydantic v2 |
| Settings | pydantic-settings + `.env` |
| Hosting | Render (free tier) |

---

## Project Structure

```
skillprism/
├── backend/
│   ├── app/
│   │   ├── main.py               ← FastAPI app + CORS
│   │   ├── config.py             ← Settings (env vars)
│   │   ├── models/
│   │   │   └── schemas.py        ← Pydantic request/response models
│   │   ├── routes/
│   │   │   ├── health.py         ← GET /health (keep-alive)
│   │   │   ├── cv.py             ← POST /api/cv/parse
│   │   │   └── jobs.py           ← POST /api/jobs/match + /api/jobs/analyze (SSE)
│   │   └── services/
│   │       ├── pdf_parser.py     ← PDF / DOCX / TXT text extraction
│   │       ├── skills_extractor.py ← 300+ skill keyword DB + NER
│   │       ├── job_matcher.py    ← Score calculation logic
│   │       └── groq_analyzer.py  ← Groq streaming + prompt engineering
│   ├── requirements.txt
│   ├── render.yaml               ← Render deployment config
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── prism.svg             ← Favicon
    ├── src/
    │   ├── lib/
    │   │   └── api.ts            ← Axios client + keep-alive + SSE streaming
    │   ├── store/
    │   │   └── useStore.ts       ← Zustand global state
    │   ├── components/
    │   │   ├── Navbar.tsx        ← Fixed top nav with step indicator
    │   │   ├── ScoreRing.tsx     ← Animated SVG score ring
    │   │   ├── SkillsBreakdown.tsx ← Radar chart + skill tags
    │   │   └── AIAnalysis.tsx    ← Streaming markdown renderer
    │   ├── pages/
    │   │   ├── CVUpload.tsx      ← Step 1: Drag-drop upload
    │   │   ├── JobInput.tsx      ← Step 2: Job description input
    │   │   └── Result.tsx        ← Step 3: Full results dashboard
    │   ├── App.tsx               ← Router + keep-alive init
    │   ├── main.tsx
    │   └── index.css             ← Tailwind + design system
    ├── index.html
    ├── tailwind.config.ts
    ├── vite.config.ts
    ├── vercel.json               ← SPA rewrites
    └── .env.example
```

---

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- A free [Groq API key](https://console.groq.com)

### 1. Clone & setup backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

```bash
# Start backend (runs on http://localhost:8000)
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### 2. Setup frontend

```bash
cd frontend
npm install

cp .env.example .env
# .env already points to http://localhost:8000 for local dev
```

```bash
# Start frontend (runs on http://localhost:5173)
npm run dev
```

---

## Deployment

### Backend → Render (free tier)

1. Push `backend/` to a GitHub repository
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo
4. Render detects `render.yaml` automatically. Confirm:
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | Your key from [console.groq.com](https://console.groq.com) |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `GROQ_MODEL` | `llama3-70b-8192` |

6. Deploy → copy your URL e.g. `https://skillprism-api.onrender.com`

> **Free tier sleep:** Render free services sleep after 30s of inactivity. SkillPrism's frontend automatically pings `/health` every **20 seconds** to prevent this. No cold starts for active users.

---

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variable:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://skillprism-api.onrender.com` |

4. Deploy → done ✓

`vercel.json` already handles SPA routing rewrites.

---

## API Reference

### `GET /health`
Keep-alive endpoint. Returns `200 OK` immediately.
```json
{ "status": "ok", "message": "SkillPrism API is alive 🔮" }
```

### `POST /api/cv/parse`
Upload a CV file. Returns extracted text + skills.

**Request:** `multipart/form-data` with `file` field (PDF / DOCX / TXT, max 5 MB)

**Response:**
```json
{
  "raw_text": "John Doe...",
  "skills": ["React", "Python", "Docker", "..."],
  "skills_by_category": {
    "Frontend": ["React", "TypeScript"],
    "Backend": ["Python", "FastAPI"]
  },
  "word_count": 542
}
```

### `POST /api/jobs/match`
Match a CV text against a job description.

**Request:**
```json
{
  "cv_text": "...",
  "job_description": "We're looking for a React developer..."
}
```

**Response:**
```json
{
  "score": 78,
  "label": "Strong Match",
  "color": "#34D399",
  "matched_skills": ["React", "TypeScript", "PostgreSQL"],
  "missing_skills": ["Kubernetes", "GraphQL"],
  "cv_skills": ["React", "Python", "..."],
  "job_skills": ["React", "TypeScript", "Kubernetes", "..."],
  "skills_by_category": { "Frontend": ["React"], "..." : [] }
}
```

### `POST /api/jobs/analyze`
Stream a gap analysis via **Server-Sent Events**.

**Request:**
```json
{
  "cv_skills": ["React", "Python"],
  "job_skills": ["React", "TypeScript", "Kubernetes"],
  "missing_skills": ["Kubernetes"],
  "matched_skills": ["React"],
  "job_description": "...",
  "score": 72
}
```

**Response stream** (`text/event-stream`):
```
data: {"text": "## Overall Assessment\n", "done": false}
data: {"text": "Your profile shows...", "done": false}
data: {"done": true}
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ | — | Get free at [console.groq.com](https://console.groq.com) |
| `ALLOWED_ORIGINS` | ✅ | `http://localhost:5173` | Comma-separated CORS origins |
| `GROQ_MODEL` | ❌ | `llama3-70b-8192` | Groq model ID |
| `MAX_FILE_SIZE_MB` | ❌ | `5` | Max CV upload size |

### Frontend (`frontend/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | ✅ | `http://localhost:8000` | Backend base URL |

---

## Skill Categories

SkillPrism detects **300+ skills** across 10 categories:

| Category | Examples |
|---|---|
| Frontend | React, Vue, Angular, Svelte, Next.js, Tailwind, TypeScript |
| Backend | FastAPI, Django, Node.js, NestJS, Spring Boot, Rails |
| Languages | Python, JavaScript, Go, Rust, Java, C++, Swift |
| Databases | PostgreSQL, MongoDB, Redis, Pinecone, Supabase |
| Cloud & DevOps | AWS, GCP, Docker, Kubernetes, GitHub Actions, Terraform |
| AI & Data | PyTorch, TensorFlow, LangChain, Pandas, spaCy, LLM, RAG |
| Mobile | React Native, Flutter, Swift, Kotlin |
| Security | OAuth2, JWT, OWASP, Penetration Testing, SOC2 |
| Tools & Methods | Git, Agile, Scrum, TDD, Jest, Cypress, Figma |
| Soft Skills | Leadership, Problem Solving, Mentoring, Communication |

---

## Architecture Decisions

### Why Groq?
Groq's free tier offers 14,400 requests/day with extremely low latency (~500ms first token). Combined with streaming SSE, it creates a snappy real-time experience without any cost.

### Why no vector database?
For this scope, keyword-based skill extraction is fast, deterministic, and requires no external services. Skills are canonical terms — semantic similarity isn't needed when you have a curated database of 300+ canonical names.

### Why Render free tier + keep-alive?
Render's free tier is perfect for portfolio projects. The 30s sleep is a known limitation — solved elegantly by the frontend pinging `/health` every 20 seconds. No user ever sees a cold start.

### Why Zustand over Redux?
3 global states (step, parsedCV, matchResult) don't need Redux overhead. Zustand is 1KB, zero boilerplate, and the entire store fits in one file.

---

## Contributing

Contributions are welcome! Ideas for improvement:

- [ ] Add support for LinkedIn profile URL parsing
- [ ] Multi-language CV support (FR, AR, ES)
- [ ] Save and compare multiple job matches
- [ ] Export report as PDF
- [ ] Skill improvement tracker over time

---

## License

MIT © 2026 SkillPrism

---

<div align="center">

Built with FastAPI · React · Groq · Tailwind · Vercel · Render

**[Live Demo](https://skillprism.vercel.app)** · **[API Docs](https://skillprism-api.onrender.com/docs)**

</div>
