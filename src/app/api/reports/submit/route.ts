import { NextRequest, NextResponse } from 'next/server';

// Store reports in memory (would use database in production)
const scamReports: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const report = {
      id: `report_${Date.now()}`,
      companyName: body.companyName,
      emailUsed: body.emailUsed,
      phoneNumber: body.phoneNumber || '(Not provided)',
      description: body.description,
      status: 'pending',
      upvotes: 0,
      createdAt: new Date(),
    };

    scamReports.push(report);

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');
    
    let results = scamReports;
    if (status) {
      results = scamReports.filter(r => r.status === status);
    }

    return NextResponse.json({
      success: true,
      data: results.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
