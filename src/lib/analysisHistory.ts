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

  const allAnalyses = getAllAnalyses();
  allAnalyses.push(newAnalysis);
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(allAnalyses));

  return newAnalysis;
}

export function getAllAnalyses(): Analysis[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ANALYSES_KEY);
  return data ? JSON.parse(data) : [];
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
