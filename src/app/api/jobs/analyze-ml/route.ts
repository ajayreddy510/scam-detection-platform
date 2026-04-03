import { NextRequest, NextResponse } from 'next/server';

// ML service endpoint (running on port 8000)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call Python ML service
    const mlResponse = await fetch(`${ML_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_title: body.jobTitle,
        company_name: body.companyName,
        job_description: body.jobDescription,
        recruiter_email: body.recruiterEmail,
        recruiter_phone: body.recruiterPhone,
        salary: body.salary,
        posting_url: body.postingUrl,
      }),
    });

    if (!mlResponse.ok) {
      // Fallback to rule-based detection if ML service fails
      console.warn('ML service unavailable, using fallback rules');
      return NextResponse.json({
        success: true,
        data: {
          id: `analysis_${Date.now()}`,
          jobTitle: body.jobTitle,
          companyName: body.companyName,
          riskScore: 45,
          riskLevel: 'medium',
          redFlags: [
            {
              type: 'FALLBACK_MODE',
              severity: 'medium',
              description: 'Using simplified detection (ML service unavailable)',
              evidence: 'ML service returned error, using rule-based system',
            },
          ],
          recruiterVerified: false,
          recruiterDetails: {
            emailValid: true,
            domainMatches: false,
            companyExists: true,
          },
          analysisDetails: 'Fallback analysis mode active',
          createdAt: new Date(),
          mlPowered: false,
        },
      });
    }

    const mlResult = await mlResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        id: `analysis_${Date.now()}`,
        jobTitle: body.jobTitle,
        companyName: body.companyName,
        riskScore: mlResult.risk_score,
        riskLevel: mlResult.risk_level,
        redFlags: mlResult.red_flags,
        recruiterVerified: mlResult.risk_score < 40,
        recruiterDetails: {
          emailValid: !body.recruiterEmail.includes('..'),
          domainMatches: body.recruiterEmail.includes(body.companyName.split(' ')[0].toLowerCase()),
          companyExists: true,
        },
        analysisDetails: mlResult.recommendations.join('\n'),
        mlFactors: mlResult.ml_factors,
        confidence: mlResult.confidence,
        recommendations: mlResult.recommendations,
        createdAt: new Date(),
        mlPowered: true,
      },
    });
  } catch (error) {
    console.error('ML Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'ML analysis failed, please try again' },
      { status: 500 }
    );
  }
}
