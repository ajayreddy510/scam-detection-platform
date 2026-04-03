export interface Analysis {
  id: string;
  userId: string;
  userName: string;
  jobPosting: string;
  companyName: string;
  location: string;
  salaryRange: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  analysis: string;
  timestamp: number;
  date: string;
}

const ANALYSES_KEY = 'safehire_analyses';

const isClient = () => typeof window !== 'undefined';

export function saveAnalysis(
  userId: string,
  userName: string,
  jobPosting: string,
  companyName: string,
  location: string,
  salaryRange: string,
  riskScore: number,
  analysis: string
): Analysis {
  const newAnalysis: Analysis = {
    id: `analysis_${Date.now()}`,
    userId,
    userName,
    jobPosting,
    companyName,
    location,
    salaryRange,
    riskScore,
    riskLevel: riskScore < 30 ? 'LOW' : riskScore < 70 ? 'MEDIUM' : 'HIGH',
    analysis,
    timestamp: Date.now(),
    date: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  try {
    if (!isClient()) throw new Error('Not on client side');
    
    const allAnalyses = getAllAnalyses();
    allAnalyses.push(newAnalysis);
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(allAnalyses));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }

  return newAnalysis;
}

export function getAllAnalyses(): Analysis[] {
  try {
    if (!isClient()) return [];
    const data = localStorage.getItem(ANALYSES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting analyses:', error);
    try {
      if (isClient()) localStorage.removeItem(ANALYSES_KEY);
    } catch (clearError) {
      console.error('Error clearing corrupted analysis data:', clearError);
    }
    return [];
  }
}

export function getUserAnalyses(userId: string): Analysis[] {
  const allAnalyses = getAllAnalyses();
  return allAnalyses
    .filter((a) => a.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function getAnalysisStats(analyses: Analysis[]) {
  return {
    total: analyses.length,
    lowRisk: analyses.filter((a) => a.riskLevel === 'LOW').length,
    mediumRisk: analyses.filter((a) => a.riskLevel === 'MEDIUM').length,
    highRisk: analyses.filter((a) => a.riskLevel === 'HIGH').length,
    avgScore: analyses.length > 0
      ? (analyses.reduce((sum, a) => sum + a.riskScore, 0) / analyses.length).toFixed(1)
      : '0',
    lastAnalysis: analyses.length > 0 ? analyses[0].date : 'Never',
  };
}

// Debug and verification functions
export function debugAnalysisData() {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(ANALYSES_KEY);
  console.log('📊 Analysis Data in localStorage:', {
    key: ANALYSES_KEY,
    exists: !!data,
    size: data?.length,
    data: data ? JSON.parse(data) : [],
  });
  return data ? JSON.parse(data) : [];
}

export function verifyAnalysisData() {
  const allAnalyses = getAllAnalyses();
  console.log('✅ Total analyses:', allAnalyses.length);
  console.log('📋 Analysis breakdown by user:');
  const byUser = allAnalyses.reduce<Record<string, number>>((acc, a) => {
    acc[a.userId] = (acc[a.userId] || 0) + 1;
    return acc;
  }, {});
  Object.entries(byUser).forEach(([userId, count]) => {
    console.log(`  - ${userId}: ${count} analysis(es)`);
  });
  return allAnalyses;
}
