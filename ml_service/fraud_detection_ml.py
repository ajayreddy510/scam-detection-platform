"""
Advanced Fraud Detection ML Service
Uses machine learning models for deep analysis of job postings
"""

import json
import re
from typing import Dict, List, Tuple, Any
import numpy as np
from dataclasses import dataclass, asdict

# ML Model placeholders (would use trained models in production)
from enum import Enum

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

@dataclass
class RedFlag:
    type: str
    severity: str
    description: str
    evidence: str

@dataclass
class MLAnalysisResult:
    risk_score: float
    risk_level: str
    confidence: float
    ml_factors: List[str]
    red_flags: List[Dict]
    recommendations: List[str]

class AdvancedFraudDetectionML:
    """Advanced ML-based fraud detection model"""
    
    # Enhanced keyword patterns with regex
    CRITICAL_SCAM_PATTERNS = {
        'payment': [
            r'(?:wire|bank)\s*transfer',
            r'payment\s*(?:upfront|in\s*advance)',
            r'processing\s*fee',
            r'verification\s*fee',
            r'(?:money\s*)?transfer',
            r'bitcoin|ethereum|crypto(?:currency)?',
            r'gift\s*card',
        ],
        'urgency': [
            r'(?:very\s*)?urgent\s*action',
            r'(?:respond\s*)?immediately',
            r'(?:apply\s*)?now(?:\s*or)?(?:\s*lose)?',
            r'(?:first\s*)?come\s*(?:first\s*)?serve',
        ],
        'legitimacy': [
            r'guarantee(?:d)?\s*(?:income|profit)',
            r'(?:make\s*)?money\s*(?:fast|quick)',
            r'(?:work\s*)?from\s*home\s*(?:no\s*)?experience',
            r'easy\s*money',
        ],
    }

    # Salary percentile data (simplified)
    ROLE_BENCHMARKS = {
        'intern': (8000, 20000),
        'junior': (20000, 60000),
        'mid': (60000, 150000),
        'senior': (150000, 400000),
        'lead': (250000, 600000),
        'principal': (400000, 1000000),
    }

    @staticmethod
    def analyze_job_posting(job_data: Dict[str, Any]) -> MLAnalysisResult:
        """
        Advanced ML analysis of job posting
        
        Args:
            job_data: Dictionary containing job details
            
        Returns:
            MLAnalysisResult with comprehensive fraud analysis
        """
        
        ml_factors = []
        red_flags = []
        risk_score = 0.0
        confidence = 0.85
        
        # 1. Deep text analysis using ML patterns
        desc = job_data.get('job_description', '').lower()
        
        # Payment pattern detection
        payment_matches = AdvancedFraudDetectionML._find_pattern_matches(
            desc, AdvancedFraudDetectionML.CRITICAL_SCAM_PATTERNS['payment']
        )
        if payment_matches:
            risk_score += 40 * (len(payment_matches) / 3)  # Normalize
            ml_factors.append(f"Payment indicators detected: {payment_matches}")
            red_flags.append({
                'type': 'ML_PAYMENT_DETECTION',
                'severity': 'high',
                'description': 'ML detected potential payment scams',
                'evidence': f"Patterns: {', '.join(payment_matches[:2])}"
            })
        
        # Urgency pattern detection
        urgency_matches = AdvancedFraudDetectionML._find_pattern_matches(
            desc, AdvancedFraudDetectionML.CRITICAL_SCAM_PATTERNS['urgency']
        )
        if len(urgency_matches) > 2:
            risk_score += 15
            ml_factors.append(f"Excessive urgency: {len(urgency_matches)} patterns")
        
        # 2. Sentiment Analysis (simplified - would use transformers in production)
        sentiment_score = AdvancedFraudDetectionML._analyze_sentiment(desc)
        if sentiment_score > 0.7:  # Very positive sentiment
            risk_score += 10
            ml_factors.append("Unusually positive sentiment bias")
        
        # 3. Salary Analysis with ML
        salary_risk, salary_factors = AdvancedFraudDetectionML._analyze_salary_ml(
            job_data.get('salary', ''),
            job_data.get('job_title', '')
        )
        risk_score += salary_risk
        if salary_factors:
            ml_factors.extend(salary_factors)
        
        # 4. Email domain analysis
        email = job_data.get('recruiter_email', '').lower()
        email_risk, email_factors = AdvancedFraudDetectionML._analyze_email_ml(email)
        risk_score += email_risk
        if email_factors:
            ml_factors.extend(email_factors)
        
        # 5. Company name verification
        company = job_data.get('company_name', '').lower()
        company_risk, company_factors = AdvancedFraudDetectionML._analyze_company_ml(company)
        risk_score += company_risk
        if company_factors:
            ml_factors.extend(company_factors)
        
        # 6. Writing quality analysis (NLP feature)
        writing_quality = AdvancedFraudDetectionML._analyze_writing_quality(desc)
        if writing_quality < 0.6:
            risk_score += 8
            ml_factors.append(f"Poor writing quality score: {writing_quality:.2f}")
        
        # 7. Readability and structure analysis
        readability = AdvancedFraudDetectionML._calculate_readability(desc, job_data)
        if readability < 0.5:
            risk_score += 5
            ml_factors.append("Poor job posting structure")
        
        # Normalize risk score
        risk_score = min(100, max(0, risk_score))
        
        # Adjust confidence based on factors
        if len(ml_factors) >= 5:
            confidence = 0.92  # Higher confidence with more factors
        elif len(ml_factors) <= 1:
            confidence = 0.78
        
        # Determine risk level
        risk_level = 'high' if risk_score > 70 else 'medium' if risk_score > 40 else 'low'
        
        # Generate recommendations
        recommendations = AdvancedFraudDetectionML._generate_recommendations(
            risk_score, red_flags
        )
        
        return MLAnalysisResult(
            risk_score=round(risk_score, 1),
            risk_level=risk_level,
            confidence=round(confidence, 2),
            ml_factors=ml_factors,
            red_flags=red_flags,
            recommendations=recommendations
        )
    
    @staticmethod
    def _find_pattern_matches(text: str, patterns: List[str]) -> List[str]:
        """Find regex pattern matches in text"""
        matches = []
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                matches.append(pattern.split('|')[0][:30])  # First 30 chars
        return matches
    
    @staticmethod
    def _analyze_sentiment(text: str) -> float:
        """
        Simple sentiment analysis (0-1 scale)
        In production, would use transformers model
        """
        positive_words = [
            'easy', 'simple', 'quick', 'fast', 'guaranteed', 'unlimited',
            'flexible', 'free', 'bonus', 'amazing', 'opportunity', 'incredible'
        ]
        negative_words = [
            'difficult', 'complex', 'challenging', 'requirement', 'competitive'
        ]
        
        pos_count = sum(1 for word in positive_words if word in text)
        neg_count = sum(1 for word in negative_words if word in text)
        
        total = pos_count + neg_count
        if total == 0:
            return 0.5
        
        return pos_count / total
    
    @staticmethod
    def _analyze_salary_ml(salary: str, job_title: str) -> Tuple[float, List[str]]:
        """ML-based salary analysis"""
        factors = []
        risk = 0.0
        
        if not salary:
            return risk, factors
        
        # Extract salary amount
        match = re.search(r'(\d+)(?:,(\d+))?(?:\.(\d+))?', salary)
        if not match:
            return risk, factors
        
        salary_amt = int(match.group(1)) * (1000 if match.group(1).__len__() <= 3 else 1)
        
        # Determine role level
        role_level = 'mid'
        title_lower = job_title.lower()
        if any(word in title_lower for word in ['intern', 'fresher', 'entry']):
            role_level = 'intern'
        elif any(word in title_lower for word in ['junior', 'associate']):
            role_level = 'junior'
        elif any(word in title_lower for word in ['senior', 'principal']):
            role_level = 'senior'
        
        benchmark_min, benchmark_max = AdvancedFraudDetectionML.ROLE_BENCHMARKS.get(
            role_level, (60000, 150000)
        )
        
        # Detect anomaly
        if salary_amt > benchmark_max * 1.5:
            risk += 25
            factors.append(f"Salary {salary_amt} exceeds market rate by {((salary_amt/benchmark_max)-1)*100:.0f}%")
        elif salary_amt < benchmark_min * 0.5:
            risk += 10
            factors.append("Salary significantly below market rate")
        
        return risk, factors
    
    @staticmethod
    def _analyze_email_ml(email: str) -> Tuple[float, List[str]]:
        """ML-based email analysis"""
        factors = []
        risk = 0.0
        
        domain = email.split('@')[-1] if '@' in email else ''
        
        # Check domain reputation
        suspicious_domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
        if domain in suspicious_domains:
            risk += 15
            factors.append(f"Personal email domain used: {domain}")
        
        # Check for domain patterns suggesting fake
        if re.search(r'temp\d+|test\d+|fake|demo|job\d{4,}', domain):
            risk += 20
            factors.append("Domain matches suspicious patterns")
        
        return risk, factors
    
    @staticmethod
    def _analyze_company_ml(company: str) -> Tuple[float, List[str]]:
        """ML-based company legitimacy analysis"""
        factors = []
        risk = 0.0
        
        # Check for generic company names
        generic_patterns = [
            r'^(company|corporation|enterprise|firm|business|group|solutions)\s*\d*$',
            r'^(xyz|abc|test|demo|job|work)',
            r'(unlimited|global|golden|millionaire|success)',
        ]
        
        for pattern in generic_patterns:
            if re.search(pattern, company, re.IGNORECASE):
                risk += 15
                factors.append("Company name appears generic or fake")
                break
        
        if len(company) < 3:
            risk += 10
            factors.append("Company name too short")
        
        return risk, factors
    
    @staticmethod
    def _analyze_writing_quality(text: str) -> float:
        """
        Analyze writing quality (0-1 scale)
        Uses NLP metrics
        """
        if not text:
            return 0.0
        
        # Sentence count and average length
        sentences = re.split(r'[.!?]', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if not sentences:
            return 0.0
        
        avg_length = np.mean([len(s.split()) for s in sentences])
        
        # Check for common issues
        issues = 0
        if re.search(r'\s{2,}', text):
            issues += 1  # Multiple spaces
        if re.search(r'[!?]{2,}', text):
            issues += 1  # Multiple punctuation
        if re.search(r'[A-Z]{5,}', text):
            issues += 1  # Excessive caps
        
        quality = 1.0 - (issues * 0.15)
        quality = max(0, quality)
        
        return quality
    
    @staticmethod
    def _calculate_readability(text: str, job_data: Dict) -> float:
        """Calculate readability and structure score"""
        score = 0.7
        
        # Check for job description structure elements
        structure_keywords = [
            'responsibility', 'requirement', 'skill', 'experience',
            'qualification', 'duty', 'task', 'benefit', 'salary'
        ]
        
        found = sum(1 for kw in structure_keywords if kw in text.lower())
        score += (found / len(structure_keywords)) * 0.3
        
        # Length check
        if len(text) < 100:
            score -= 0.2
        elif len(text) > 2000:
            score += 0.1
        
        return min(1.0, max(0, score))
    
    @staticmethod
    def _generate_recommendations(risk_score: float, red_flags: List[Dict]) -> List[str]:
        """Generate personalized recommendations based on analysis"""
        recommendations = []
        
        if risk_score > 70:
            recommendations.append("🚨 CRITICAL: Do NOT proceed with this application")
            recommendations.append("Contact the company through official website/phone")
            recommendations.append("Report this posting to the job portal")
        elif risk_score > 40:
            recommendations.append("⚠️ Proceed with extreme caution")
            recommendations.append("Verify all company details independently")
            recommendations.append("Never share personal/financial info until verified")
        else:
            recommendations.append("✅ Posting appears legitimate")
            recommendations.append("Still verify company independently as standard practice")
        
        # Add specific recommendations based on red flags
        if any(f['type'] == 'PAYMENT_REQUEST' for f in red_flags):
            recommendations.append("DO NOT make any payments upfront")
        
        if any(f['type'] == 'GENERIC_EMAIL' for f in red_flags):
            recommendations.append("Verify recruiter through official company channels")
        
        recommendations.append("Report suspicious postings to help other job seekers")
        
        return recommendations

# API endpoint handler
def handle_analysis_request(job_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle ML analysis request"""
    result = AdvancedFraudDetectionML.analyze_job_posting(job_data)
    
    return {
        'success': True,
        'data': {
            'risk_score': result.risk_score,
            'risk_level': result.risk_level,
            'confidence': result.confidence,
            'ml_factors': result.ml_factors,
            'red_flags': result.red_flags,
            'recommendations': result.recommendations,
        }
    }

if __name__ == '__main__':
    # Example usage
    test_data = {
        'job_title': 'Work from Home - Make Money Fast',
        'company_name': 'XYZ Tech Solutions',
        'job_description': 'Urgent! Limited positions. Wire transfer required upfront. Guaranteed income of ₹100,000/month!',
        'recruiter_email': 'jobs@gmail.com',
        'salary': '₹100,000/month'
    }
    
    result = AdvancedFraudDetectionML.analyze_job_posting(test_data)
    print(json.dumps({
        'risk_score': result.risk_score,
        'risk_level': result.risk_level,
        'confidence': result.confidence,
        'ml_factors': result.ml_factors,
        'recommendations': result.recommendations,
    }, indent=2))
