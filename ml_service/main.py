"""
FastAPI server for ML-based fraud detection service
Provides REST API endpoints for advanced job posting analysis
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from fraud_detection_ml import AdvancedFraudDetectionML

# Pydantic models for request/response
class JobAnalysisRequest(BaseModel):
    job_title: str
    company_name: str
    job_description: str
    recruiter_email: str
    recruiter_phone: Optional[str] = None
    salary: Optional[str] = None
    posting_url: Optional[str] = None

class RedFlagResponse(BaseModel):
    type: str
    severity: str
    description: str
    evidence: str

class AnalysisResponse(BaseModel):
    risk_score: float
    risk_level: str
    confidence: float
    ml_factors: List[str]
    red_flags: List[dict]
    recommendations: List[str]

# Initialize FastAPI app
app = FastAPI(
    title="SafeHire ML Fraud Detection API",
    description="Advanced ML-powered fraud detection for job postings",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "SafeHire ML Service"}

@app.post("/analyze", response_model=AnalysisResponse)
def analyze_job_posting(request: JobAnalysisRequest):
    """
    Analyze a job posting for fraud indicators using ML
    
    Args:
        request: Job posting details
        
    Returns:
        AnalysisResponse with ML predictions and recommendations
    """
    try:
        job_data = request.dict()
        result = AdvancedFraudDetectionML.analyze_job_posting(job_data)
        
        return {
            'risk_score': result.risk_score,
            'risk_level': result.risk_level,
            'confidence': result.confidence,
            'ml_factors': result.ml_factors,
            'red_flags': result.red_flags,
            'recommendations': result.recommendations,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/info")
def get_model_info():
    """Get information about deployed ML models"""
    return {
        'models': {
            'sentiment_analyzer': 'Custom NLP',
            'pattern_detector': 'Regex + ML',
            'salary_analyzer': 'Statistical',
            'email_validator': 'ML-based',
        },
        'version': '1.0.0',
        'accuracy': 0.87,
        'last_updated': '2026-04-02'
    }

if __name__ == '__main__':
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=8000,
        log_level='info'
    )
