# JobShield - Complete Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This guide will get your complete fraud detection platform running with both the Next.js frontend and Python ML backend.

---

## Step 1: Install Frontend Dependencies

```bash
cd c:\Users\satya sai\OneDrive\Desktop\scam-detection-platform
npm install
```

**Expected output:** "added XXX packages"

---

## Step 2: Start the Next.js Development Server

```bash
npm run dev
```

**Expected output:**
```
✓ Ready in XXms

  ▲ Next.js 14.x
  - Local:        http://localhost:3000
  - Environments: .env.local
```

**Action:** Open http://localhost:3000 in your browser

---

## Step 3: Set Up Python ML Service (New Terminal)

### Option A: Using Python Virtual Environment (Recommended)

```bash
# Navigate to ML service folder
cd ml_service

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
```

### Option B: Direct Python Installation

```bash
cd ml_service
pip install -r requirements.txt
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```
                                        
---

## Step 4: Verify ML Service is Running

In a **third terminal**, run:

```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{"status": "healthy"}
```

---

## 🎯 Test the Complete System

### Test 1: Analyze a Suspicious Job (Frontend + Rule-Based)

1. Go to http://localhost:3000
2. Click **🔍 Analyze Job Posting**
3. Fill in the form with suspicious content:

```
Job Title: "Work From Home - Unlimited Income"
Company: "XYZ Solutions"
Description: "Send $500 for training materials. Earn ₹500,000/month from home!"
Email: "hire@gmail.com"
```

4. **Uncheck** "Use Advanced ML Analysis" (to test rule-based first)
5. Click **Analyze Job Posting**

**Expected result:**
- Risk Score: HIGH (80-100)
- Multiple red flags detected
- Risk level: CRITICAL

### Test 2: Analyze with ML Enhancement (Frontend + ML Service)

1. Go back to http://localhost:3000
2. Fill in the same suspicious job information
3. **Check** "Use Advanced ML Analysis" ✓
4. Click **Analyze Job Posting**

**Expected result:**
- Same job analyzed by both systems
- Dashboard shows: "🤖 ML-Powered Analysis"
- Additional tabs: "ML Factors" and "Recommendations"
- ML Confidence score displayed

### Test 3: Analyze a Legitimate Job

1. Try with legitimate job posting:

```
Job Title: "Senior Software Engineer"
Company: "Microsoft India"
Description: "We're looking for experienced software engineers to join our team in Bangalore. 
Required: 5+ years of experience, strong in Java/Python, system design knowledge.
Responsibilities: Design scalable systems, mentor junior developers, contribute to architecture.
Salary: ₹30-50 LPA (negotiable based on experience)"
Email: "careers@microsoft.com"
```

2. Check "Use Advanced ML Analysis"
3. Click **Analyze Job Posting**

**Expected result:**
- Risk Score: LOW (0-30)
- Few or no red flags
- ML Factors show low suspicious indicators
- Recommendations section shows positive indicators

---

## 📊 Dashboard Features

### Tab 1: Overview
- Risk score visualization
- Red flags categorized by severity
- Professional analysis report

### Tab 2: ML Factors (When ML service is running)
- 💳 **Payment Red Flags** - Detects money requests
- ⏰ **Urgency Patterns** - Artificial deadlines
- 💰 **Salary Anomaly** - Unrealistic compensation
- 📧 **Email Domain Issues** - Domain mismatches
- 🏢 **Company Legitimacy** - Suspicious company names
- 📝 **Writing Quality** - Professional structure analysis

### Tab 3: Recommendations
- Personalized safety advice
- Action items specific to fraud indicators
- Contact information if needed

---

## 🔧 Troubleshooting

### Issue: "Port 3000 already in use"

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

### Issue: "Port 8000 already in use"

```bash
# Find and kill ML service process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

```bash
# Make sure you're in the ML service folder
cd ml_service

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Issue: ML Service Not Responding

1. Check if it's running: `curl http://localhost:8000/health`
2. Ensure it started successfully (look for "Application startup complete")
3. Check Python version: `python --version` (needs 3.8+)
4. Try restarting: Kill the process and run `python main.py` again

### Issue: Analysis Takes Too Long

- First load might be slower as dependencies load
- Subsequent analyses should be 100-200ms
- If consistently slow, check system resources

---

## 📁 Project Structure

```
scam-detection-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── dashboard/page.tsx    # Results dashboard
│   │   ├── layout.tsx            # App layout with JobShield branding
│   │   └── api/
│   │       ├── jobs/
│   │       │   ├── analyze/...   # Rule-based analysis
│   │       │   └── analyze-ml/...# ML service integration
│   │       └── ...
│   ├── components/
│   │   ├── JobAnalyzerForm.tsx   # Main input form (with ML toggle)
│   │   ├── RiskScore.tsx         # Risk visualization
│   │   └── RedFlagsList.tsx      # Detected flags display
│   └── services/
│       └── fraudDetection.ts     # Rule-based detection engine
│
├── ml_service/
│   ├── main.py                   # FastAPI server
│   ├── fraud_detection_ml.py     # ML detection engine
│   ├── requirements.txt          # Python dependencies
│   └── .env (optional)
│
├── .env.local                    # Environment variables (frontend)
├── package.json                  # Node.js dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
└── README.md                   # Full documentation
```

---

## 🎨 Branding & Customization

### Change Colors
Edit `/src/app/layout.tsx` - look for Tailwind classes like:
- `from-indigo-600 to-purple-600` - Change to your brand colors
- Supports: red, orange, yellow, green, blue, indigo, purple, pink

### Change Company Name
- Edit `layout.tsx` - replace "JobShield" with your brand
- Edit `page.tsx` - update logos and taglines
- Edit `copilot-instructions.md` - update project name

### Customize Detection Rules
- Edit `/src/services/fraudDetection.ts`
- Look for arrays like `SCAM_KEYWORDS`, `WARNING_KEYWORDS`
- Adjust thresholds in the scoring logic

### Customize ML Parameters
- Edit `/ml_service/fraud_detection_ml.py`
- Modify `CRITICAL_SCORE_THRESHOLD` for sensitivity
- Add new regex patterns to detection sections

---

## 📊 Integration Flow

```mermaid
graph TD
    A[User Input Form] -->|Submit| B{Use ML?}
    B -->|Yes| C[/api/jobs/analyze-ml]
    B -->|No| D[/api/jobs/analyze]
    C -->|HTTP POST| E[Python ML Service]
    E -->|JSON Response| C
    C -->|Combined Results| F[Dashboard]
    D -->|Results| F
    F -->|Display| G[Analysis Report]
    G -->|Tabs| H[Overview/ML-Factors/Recommendations]
```

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Test all three analysis scenarios (Legitimate, Suspicious, Edge cases)
- [ ] Verify ML service connectivity (health check)
- [ ] Test error handling (disconnect ML service, verify fallback)
- [ ] Load test with multiple simultaneous analyses
- [ ] Configure actual database connection (if needed)
- [ ] Set up proper error monitoring/logging
- [ ] Create admin dashboard for moderation
- [ ] Implement rate limiting for API endpoints

### Deployment Options

**Frontend (Next.js):**
- Vercel (Recommended - direct GitHub integration)
- AWS Amplify
- Netlify
- Self-hosted on AWS/DigitalOcean

**ML Service (Python):**
- Railway.app (Simple, recommended)
- Render
- AWS Lambda + API Gateway
- Self-hosted on same server as frontend

---

## 📞 Support & Links

- **GitHub Issues:** Report bugs or request features
- **ML Service Docs:** http://localhost:8000/docs (when running)
- **API Schema:** http://localhost:8000/openapi.json
- **Complete Setup Guide:** See `ML_SERVICE_SETUP.md`
- **Technical Roadmap:** See `TECHNICAL_ROADMAP.md`

---

## 🎓 Learning Resources

### Understanding the Detection Engine

1. **Rule-Based System** (`fraudDetection.ts`):
   - Keyword pattern matching
   - Salary benchmarking
   - Email domain validation
   - Company legitimacy checking

2. **ML System** (`fraud_detection_ml.py`):
   - Payment pattern regex
   - Urgency score calculation
   - Writing quality analysis
   - NLP-based feature extraction

### Extending the System

- Add new detection rules in `fraudDetection.ts`
- Add new ML features in `fraud_detection_ml.py`
- Connect PostgreSQL database in `db.ts`
- Implement custom authentication in `/api/auth/`

---

## 📝 Common Commands

```bash
# Start frontend
npm run dev

# Start ML service
cd ml_service && python main.py

# Check ML service health
curl http://localhost:8000/health

# Build for production
npm run build

# Run tests (when implemented)
npm run test

# Install new npm package
npm install package-name

# Install new Python package
pip install package-name
```

---

## ✅ What's Included

### ✓ Frontend
- Next.js 14 + React 18
- TypeScript for type safety
- Tailwind CSS for styling
- Professional UI components
- Form validation
- Session storage for analysis results

### ✓ Backend
- Node.js API routes
- Express-style routing
- RESTful endpoints
- Error handling
- Fallback mechanisms

### ✓ ML Service
- FastAPI server
- 7 dimension fraud detection
- NLP analysis
- Statistical scoring
- Pattern matching
- Personalized recommendations

### ✓ Branding
- "JobShield" professional identity
- Indigo-purple-pink color scheme
- Responsive design
- Mobile-friendly
- Accessibility-focused

---

## 🎉 Next Steps

1. ✅ **Complete Quick Setup** - You're here!
2. 🔍 **Test All Features** - Use the three test scenarios above
3. ⚙️ **Deploy ML Service** - Follow deployment section
4. 📦 **Deploy Frontend** - Choose hosting platform
5. 📊 **Monitor & Improve** - Track detection accuracy
6. 🎓 **Train ML Models** - Collect data and retrain (advanced)

---

**Congratulations!** Your fraud detection platform is ready. Start protecting job seekers today! 🛡️

For detailed information, see:
- [Complete README](README.md)
- [ML Service Setup Guide](ML_SERVICE_SETUP.md)
- [Technical Roadmap](TECHNICAL_ROADMAP.md)
