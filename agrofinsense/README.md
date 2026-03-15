# AgroFinSense 🌾📈🏛️

**Agriculture + Fintech + GovTech Intelligence Platform for Tamil Nadu.**

AgroFinSense is a comprehensive platform designed to empower farmers, streamline agricultural finance, and provide actionable insights for government officials. It levers AI to offer crop recommendations, price forecasting, credit appraisals, and policy analytics.

## 🏗️ Architecture

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Zustand (State Management), React Query, Recharts, Leaflet.
- **Backend**: FastAPI (Python), Uvicorn, SQLAlchemy (ORM).
- **AI/ML Core**: Local Ollama (gemma3:4b for Tamil advisory, llama3.2:3b for reasoning), XGBoost, Scikit-learn, PyTorch.
- **Database**: PostgreSQL (with PostGIS for spatial data), MongoDB (NoSQL document storage), Redis (Caching & Message broker).
- **Background Tasks**: Celery for asynchronous operations.
- **External Integrations**: Agmarknet (live prices) and NASA POWER (weather data).

## 📁 Project Structure

```text
agrofinsense/
├── backend/                      # FastAPI Backend Application
│   ├── db/                       # Database models, schemas, and seed scripts
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── schema.sql            # Raw SQL schemas
│   │   └── seed_warehouses.py    # Database seeding utility
│   ├── integrations/             # External API and service integrations
│   │   ├── agmarknet.py          # Market price integration
│   │   ├── bhashini.py           # Translation services
│   │   ├── nasa_weather.py       # Weather data integration
│   │   ├── ollama_ai.py          # Local LLM integration
│   │   └── vistaar.py
│   ├── ml/                       # Machine Learning models & engines
│   │   ├── budget_engine.py      # Financial calculations
│   │   ├── crop_matcher.py       # Crop recommendation logic
│   │   ├── price_model.py        # Price forecasting model
│   │   ├── storage_planner.py    # Warehouse storage optimization
│   │   └── yield_model.py        # Crop yield prediction
│   ├── ocr/                      # Optical Character Recognition logic
│   ├── routers/                  # API Endpoints
│   │   ├── farmer.py             # Farmer dashboard routes
│   │   ├── govtech.py            # Government analytics routes
│   │   ├── market.py             # Market prices routes
│   │   ├── scheme.py             # Government schemes routes
│   │   └── ws.py                 # WebSocket endpoints
│   ├── main.py                   # FastAPI application entry point
│   ├── tasks.py                  # Celery background tasks definition
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Example environment variables
│
├── frontend/                     # React + Vite Frontend Application
│   ├── src/                      # Source code
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Application views/pages
│   │   ├── api.ts                # Axios API client setup
│   │   ├── store.ts              # Zustand state management
│   │   ├── App.tsx               # Main application component
│   │   └── main.tsx              # React entry point
│   ├── package.json              # Node dependencies and scripts
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── vite.config.ts            # Vite bundler configuration
│
└── docker-compose.yml            # Docker configuration for backing services (DBs, Redis)
```

## 🚀 Getting Started

Follow these instructions to set up and run the system locally.

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **Docker & Docker Compose**
- **Ollama** (Must be installed locally with models pulled)

### 1. Verify Local AI Models (Ollama)

Ensure Ollama is installed and running with the required models.

```bash
# Check if required models are available
ollama list   

# Required models:
# - gemma3:4b
# - llama3.2:3b

# Start the Ollama server (must be running before starting the backend)
ollama serve  
```

### 2. Infrastructure Setup (Docker)

Start the required databases (PostgreSQL, MongoDB) and Redis using Docker Compose.

```bash
# From the project root
docker-compose up -d
```

### 3. Backend Setup

Set up the Python environment, configure variables, and run the FastAPI server.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment Setup
cp .env.example .env
# Edit .env and fill in required values (e.g., AGMARKNET_KEY)
```

**Database Initialization & Seeding:**

```bash
# Create database tables
python -c "from db.models import init_db; init_db()"

# Seed the database with initial demo data and warehouses
python db/seed_warehouses.py
```

**Start the API Server:**

```bash
# Run the FastAPI development server
uvicorn main:app --reload --port 8000
```

**Start the Background Task Worker (Celery):**
Open a *new terminal window*, activate the virtual environment, and run:

```bash
cd backend
celery -A tasks worker -B --loglevel=info
```

### 4. Frontend Setup

Set up the React frontend and run the development server.

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

### 5. Access the Application

Once everything is running, access the services at:

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Backend Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Testing & Verification

Check if the AI integration and backend systems are functioning correctly by hitting the health endpoint:

```http
GET http://localhost:8000/health
```

Expected Response:
```json
{
  "status": "healthy",
  "db": true,
  "redis": true,
  "ollama": {
    "ollama_running": true,
    "gemma3_4b_available": true,
    "llama3_2_3b_available": true
  },
  "timestamp": "2026-03-15T10:00:00.000000"
}
```

## 👥 Demo Accounts

The database seeding script (`seed_warehouses.py`) creates the following demo accounts:

| Role     | Phone        | District  | Language |
| -------- | ------------ | --------- | -------- |
| Farmer   | 9876543210   | Erode     | Tamil    |
| Officer  | 9988776655   | Thanjavur | English  |
