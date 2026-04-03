import { NextRequest, NextResponse } from 'next/server';
import { FraudDetectionService } from '@/services/fraudDetection';
import { JobAnalysisRequest } from '@/types';

// Store analysis results in memory (would use database in production)
const analysisResults: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const jobRequest: JobAnalysisRequest = {
      jobTitle: body.jobTitle,
      companyName: body.companyName,
      jobDescription: body.jobDescription,
      recruiterEmail: body.recruiterEmail,
      recruiterPhone: body.recruiterPhone,
      salary: body.salary,
      postingUrl: body.postingUrl,
    };

    // Simulate processing delay
    if (process.env.DEMO_MODE === 'true') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const result = FraudDetectionService.analyzeJobPosting(jobRequest);
    analysisResults.push(result);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Job analysis failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') || '10';
    const results = analysisResults.slice(-parseInt(limit));
    
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
