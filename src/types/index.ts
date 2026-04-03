// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  isVerified: boolean;
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

// Job Analysis Types
export interface JobAnalysisRequest {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  recruiterEmail: string;
  recruiterPhone?: string;
  salary?: string;
  postingUrl?: string;
}

export interface RedFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: string;
}

export interface JobAnalysisResult {
  id: string;
  jobTitle: string;
  companyName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  redFlags: RedFlag[];
  recruiterVerified: boolean;
  recruiterDetails: {
    emailValid: boolean;
    domainMatches: boolean;
    companyExists: boolean;
  };
  analysisDetails: string;
  createdAt: Date;
}

// Report Types
export interface ScamReport {
  id: string;
  userId: string;
  companyName: string;
  emailUsed: string;
  phoneNumber?: string;
  description: string;
  status: 'pending' | 'verified' | 'false_positive';
  upvotes: number;
  createdAt: Date;
}

export interface ReportRequest {
  companyName: string;
  emailUsed: string;
  phoneNumber?: string;
  description: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
