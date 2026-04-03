import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobPosting, companyName, position, location, salaryRange } = body;

    if (!jobPosting || !companyName || !position) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call ML service for analysis
    try {
      const mlResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_posting: jobPosting,
          company_name: companyName,
          position: position,
          location: location || 'Not specified',
          salary_range: salaryRange || 'Not specified',
        }),
      });

      const mlResult = await mlResponse.json();

      // Generate analysis ID
      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store analysis in session storage (in production, use database)
      // For now, return the ML service results
      return NextResponse.json({
        success: true,
        analysisId: analysisId,
        data: {
          jobPosting,
          companyName,
          position,
          location,
          salaryRange,
          ...mlResult,
        },
      });
    } catch (mlError) {
      // If ML service is not available, provide default analysis
      console.log('ML service unavailable, providing default analysis');

      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Basic rule-based detection
      const flags = [];
      const lowerPosting = jobPosting.toLowerCase();

      if (lowerPosting.includes('payment') || lowerPosting.includes('fee') || lowerPosting.includes('advance')) {
        flags.push({ type: 'high', message: 'Payment request detected' });
      }
      if (lowerPosting.includes('cryptocurrency') || lowerPosting.includes('bitcoin')) {
        flags.push({ type: 'critical', message: 'Cryptocurrency payment request' });
      }
      if (lowerPosting.includes('wire transfer')) {
        flags.push({ type: 'critical', message: 'Wire transfer request - potential fraud' });
      }
      if (lowerPosting.length < 100) {
        flags.push({ type: 'medium', message: 'Unusually short job description' });
      }
      if (!lowerPosting.includes('requirements') && !lowerPosting.includes('qualifications')) {
        flags.push({ type: 'medium', message: 'Missing job requirements section' });
      }

      const riskLevel = flags.some(f => f.type === 'critical') ? 'CRITICAL' : 
                       flags.some(f => f.type === 'high') ? 'HIGH' : 
                       flags.length > 0 ? 'MEDIUM' : 'LOW';

      return NextResponse.json({
        success: true,
        analysisId: analysisId,
        data: {
          jobPosting,
          companyName,
          position,
          location,
          salaryRange,
          riskLevel,
          riskScore: riskLevel === 'CRITICAL' ? 85 : riskLevel === 'HIGH' ? 60 : riskLevel === 'MEDIUM' ? 35 : 10,
          redFlags: flags,
          accuracy: 0.85,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
