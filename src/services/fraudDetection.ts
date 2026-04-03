import { RedFlag, JobAnalysisResult, JobAnalysisRequest } from '@/types';

// Advanced scam pattern keywords with severity levels
const SCAM_KEYWORDS = {
  critical: [
    'wire transfer',
    'bitcoin',
    'cryptocurrency',
    'payment upfront',
    'money transfer',
    'western union',
    'gift card',
    'google play card',
    'itunes card',
    'amazon gift card',
    'processing fee',
    'verification fee',
    'deposit required',
    'upfront investment',
    'money in advance',
  ],
  high: [
    'guarantee',
    'guaranteed income',
    'work from home no experience',
    'money quickly',
    'easy money',
    'quick cash',
    'make money fast',
    'no experience needed',
    'no qualifications',
  ],
  medium: [
    'flexible schedule',
    'part time',
    'remote work',
    'work from home',
    'home based',
    'extra income',
    'supplement income',
    'side hustle',
    'passive income',
  ],
};
    const redFlags: RedFlag[] = [];
    let riskScore = 0;

    // 1. Advanced keyword analysis with severity levels
    const criticalKeywords = this.checkKeywordsBySeverity(
      request.jobDescription.toLowerCase(),
      SCAM_KEYWORDS.critical
    );
    const highKeywords = this.checkKeywordsBySeverity(
      request.jobDescription.toLowerCase(),
      SCAM_KEYWORDS.high
    );
    const mediumKeywords = this.checkKeywordsBySeverity(
      request.jobDescription.toLowerCase(),
      SCAM_KEYWORDS.medium
    );

    if (criticalKeywords.length > 0) {
      redFlags.push({
        type: 'CRITICAL_PAYMENT_REQUEST',
        severity: 'high',
        description: 'CRITICAL: Job posting requests payment/financial information',
        evidence: `Found suspicious keywords: ${criticalKeywords.join(', ')}`,
      });
      riskScore += 50;
    } else if (highKeywords.length > 0) {
      redFlags.push({
        type: 'PAYMENT_REQUEST',
        severity: 'high',
        description: 'Job posting contains suspicious payment-related keywords',
        evidence: `Found: ${highKeywords.join(', ')}`,
      });
      riskScore += 35;
    } else if (mediumKeywords.length > 0) {
      redFlags.push({
        type: 'SUSPICIOUS_KEYWORDS',
        severity: 'medium',
        description: 'Job posting contains potentially misleading language',
        evidence: `Found: ${mediumKeywords.join(', ')}`,
      });
      riskScore += 1
    'apply immediately',
    'first come first serve',
  ],
  high: [
    'urgent',
    'immediate',
    'limited time',
    'act now',
    'don\'t miss',
    'exclusive opportunity',
    'limited positions',
    'hurry',
    'last chance',
  ],
  medium: [
    'opportunity',
    'special offer',
    'time-sensitive',
    'quickly apply',
  ],
};

// Marketing red flags
const MARKETING_RED_FLAGS = {
  excessive_caps: /[A-Z]{5,}/g, // 5+ consecutive capital letters
  multiple_exclamation: /!{2,}/g,
  multiple_question: /\?{2,}/g,
  emoji_spam: /[😀-🙏]{3,}/g,
};

// Industry salary benchmarks (INR/month)
const SALARY_BENCHMARKS: Record<string, { min: number; max: number }> = {
  internship: { min: 5000, max: 25000 },
  junior: { min: 15000, max: 50000 },
  midlevel: { min: 50000, max: 150000 },
  senior: { min: 100000, max: 300000 },
  principal: { min: 200000, max: 800000 },
};

// Suspicious domain patterns
const SUSPICIOUS_DOMAIN_PATTERNS = [
  /temp\d+/i,
  /test\d+/i,
  /fake/i,
  /demo/i,
  /job\d{4,}$/i,
  /xyz/i,
  /company\d+/i,
];

// ML Model placeholder for future integration
interface MLPrediction {
  riskScore: number;
  confidence: number;
  factors: string[];
}

const SUSPICIOUS_SALARY_MULTIPLIER = 1.5; // 50% above market rate

export class FraudDetectionService {
  // Analyze job posting for red flags
  static analyzeJobPosting(request: JobAnalysisRequest): JobAnalysisResult {
    const redFlags: RedFlag[] = [];
    let riskScore = 0;

    // Check for scam keywords
    const scamKeywordMatches = this.checkKeywords(
      request.jobDescription.toLowerCase(),
      SCAM_KEYWORDS
    );
    if (scamKeywordMatches.length > 0) {
      redFlags.push({
        type: 'PAYMENT_REQUEST',
        severity: 'high',
        description: 'Job posting contains suspicious payment-related keywords',
        evidence: `Found: ${scamKeywordMatches.join(', ')}`,
      });
      riskScore += 35;
    }

    // 2. Advanced urgency analysis
    const criticalUrgency = this.checkKeywordsBySeverity(
      request.jobDescription.toLowerCase(),
      WARNING_KEYWORDS.critical
    );
    const highUrgency = this.checkKeywordsBySeverity(
      request.jobDescription.toLowerCase(),
      WARNING_KEYWORDS.high
    );
    const mediumUrgency = this.checkKeywordsBySeverity(
      request.jobDescription.toLowerCase(),
      WARNING_KEYWORDS.medium
    );

    if (criticalUrgency.length > 0) {
      redFlags.push({
        type: 'CRITICAL_URGENCY',
        severity: 'high',
        description: 'CRITICAL: Excessive urgency tactics detected (manipulation indicator)',
        evidence: `Found: ${criticalUrgency.join(', ')}`,
      });
      riskScore += 25;
    } else if (highUrgency.length > 2) {
      redFlags.push({
        type: 'URGENCY',
        severity: 'medium',
        description: 'Excessive urgency language (pressure tactics)',
        evidence: `Found: ${highUrgency.join(', ')}`,
      });
      riskScore += 15;
    }

    // 3. Marketing red flag analysis
    const marketingFlags = this.checkMarketingRedFlags(request.jobDescription);
    marketingFlags.forEach((flag) => {
      redFlags.push(flag);
      riskScore += flag.severity === 'high' ? 10 : 5;
    });

    // 4. Advanced email validation
    const emailDomain = request.recruiterEmail.split('@')[1];
    const isGenericEmail = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'mail.com'].includes(
      emailDomain
    );
    
    if (isGenericEmail) {
      redFlags.push({
        type: 'GENERIC_EMAIL',
        severity: 'medium',
        description: 'Recruiter uses personal email instead of official company email',
        evidence: `Email domain: ${emailDomain}`,
      });
      riskScore += 18;
    }

    // Check for suspicious domain patterns
    const suspiciousDomain = this.checkSuspiciousDomain(emailDomain);
    if (suspiciousDomain) {
      redFlags.push({
        type: 'SUSPICIOUS_DOMAIN_PATTERN',
        severity: 'high',
        description: 'Email domain matches suspicious naming patterns',
        evidence: `Domain: ${emailDomain}`,
      });
      riskScore += 20;
    }5. Advanced salary anomaly detection
    if (request.salary) {
      const salaryFlags = this.checkAdvancedSalaryAnomaly(request.salary, request.jobTitle);
      salaryFlags.forEach((flag) => {
        redFlags.push(flag);
        riskScore += flag.severity === 'high' ? 25 : 15;
      }); severity: 'high',
        description: 'Invalid email format detected',
        evidence: `Email: ${request.recruiterEmail}`,
      });
      riskScore += 20;
    }

    // Check for salary anomalies
    if (request.salary) {
      const salaryFlag = this.checkSalaryAnomaly(request.salary, request.jobTitle);
      if (salaryFlag) {
        redFlags.push(salaryFlag);
        riskScore += 20;
      }
    }

    // Check grammar/spelling quality
    const grammarScore = this.checkGrammarQuality(request.jobDescription);
    if (grammarScore < 0.7) {
      redFlags.push({
        type: 'POOR_GRAMMAR',
        severity: 'medium',
        description: 'Job posting contains multiple spelling/grammar errors',
        evidence: `Grammar quality score: ${(grammarScore * 100).toFixed(1)}%`,
      });
      riskScore += 10;
    }

    // Check for suspicious patterns in job description
    const descriptionLength = request.jobDescription.length;
    if (descriptionLength < 100) {
      redFlags.push({
        type: 'VAGUE_DESCRIPTION',
        severity: 'low',
        description: 'Job description is unusually vague and brief',
        evidence: `Description length: ${descriptionLength} characters`,
      });
      riskScore += 5;
    }

    // 6. Company domain consistency check
    const companyDomain = this.extractDomain(request.recruiterEmail);
    const companyNameNormalized = request.companyName.toLowerCase();
    const emailDomainNormalized = companyDomain.split('.')[0].toLowerCase();
    const domainMatches = this.validateDomainMatch(companyNameNormalized, emailDomainNormalized);

    if (!domainMatches && emailDomain !== 'gmail.com' && emailDomain !== 'yahoo.com') {
      redFlags.push({
        type: 'DOMAIN_MISMATCH',
        severity: 'high',
        description: 'Company name does NOT match email domain (possible impersonation)',
        evidence: `Company: "${request.companyName}" vs Email domain: "${companyDomain}"`,
      });
      riskScore += 22;
    }

    // 7. Company name legitimacy check
    const companyLegitFlag = this.checkCompanyNameLegitimacy(request.companyName);
    if (companyLegitFlag) {
      redFlags.push(companyLegitFlag);
      riskScore += companyLegitFlag.severity === 'high' ? 15 : 8;
    }

    // 8. Job posting structure analysis
    const structureFlag = this.analyzePostingStructure(request);
    if (structureFlag) {
      redFlags.push(structureFlag);
      riskScore += 8;
    }

    // 9. Phone number validation (if provided)
    if (request.recruiterPhone) {
      const phoneFlag = this.validatePhoneNumber(request.recruiterPhone);
      if (phoneFlag) {
        redFlags.push(phoneFlag);
        riskScore += phoneFlag.severity === 'high' ? 12 : 6;
      }
    }

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);

    return {
      id: `analysis_${Date.now()}`,
      jobTitle: request.jobTitle,
      companyName: request.companyName,
      riskScore,
      riskLevel: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
      redFlags,
      recruiterVerified: isGenericEmail ? false : true,
      recruiterDetails: {
        emailValid: this.isValidEmail(request.recruiterEmail),
        domainMatches: emailDomainNormalized.includes(companyNameNormalized.split(' ')[0]),
        companyExists: true, // Would check against real database
      },
      analysisDetails: this.generateAnalysisReport(redFlags, riskScore),
      createdAt: new Date(),
    };
  }

  // Helper methods - Advanced implementations

  private static checkKeywordsBySeverity(text: string, keywords: string[]): string[] {
    return keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
  }

  private static checkMarketingRedFlags(text: string): RedFlag[] {
    const flags: RedFlag[] = [];
    
    const capsMatches = text.match(MARKETING_RED_FLAGS.excessive_caps) || [];
    if (capsMatches.length > 5) {
      flags.push({
        type: 'EXCESSIVE_CAPS',
        severity: 'medium',
        description: 'Excessive use of capital letters (aggressive marketing)',
        evidence: `Found ${capsMatches.length} instances of excessive capitalization`,
      });
    }

    const exclamationMatches = text.match(MARKETING_RED_FLAGS.multiple_exclamation) || [];
    if (exclamationMatches.length > 3) {
      flags.push({
        type: 'AGGRESSIVE_PUNCTUATION',
        severity: 'low',
        description: 'Multiple exclamation marks (aggressive tone)',
        evidence: `Found ${exclamationMatches.length} instances`,
      });
    }

    return flags;
  }

  private static checkSuspiciousDomain(domain: string): boolean {
    return SUSPICIOUS_DOMAIN_PATTERNS.some((pattern) => pattern.test(domain));
  }

  private static validateDomainMatch(companyName: string, domainName: string): boolean {
    const companyWords = companyName.split(' ').filter((w) => w.length > 2);
    return companyWords.some((word) => domainName.includes(word));
  }

  private static checkAdvancedSalaryAnomaly(salary: string, jobTitle: string): RedFlag[] {
    const flags: RedFlag[] = [];
    const salaryMatch = salary.match(/(\d+)/);
    if (!salaryMatch) return flags;

    const salaryAmount = parseInt(salaryMatch[1]);
    const jobTitleLower = jobTitle.toLowerCase();

    // Determine job level
    let jobLevel = 'midlevel';
    if (jobTitleLower.includes('intern') || jobTitleLower.includes('fresher')) jobLevel = 'internship';
    else if (jobTitleLower.includes('junior')) jobLevel = 'junior';
    else if (jobTitleLower.includes('senior') || jobTitleLower.includes('lead')) jobLevel = 'senior';
    else if (jobTitleLower.includes('principal') || jobTitleLower.includes('architect')) jobLevel = 'principal';

    const benchmark = SALARY_BENCHMARKS[jobLevel];
    
    // Check if salary is unrealistically high
    if (salaryAmount > benchmark.max * SUSPICIOUS_SALARY_MULTIPLIER) {
      flags.push({
        type: 'UNREALISTIC_SALARY',
        severity: 'high',
        description: `${jobLevel.charAt(0).toUpperCase() + jobLevel.slice(1)} position with unrealistically high salary`,
        evidence: `₹${salaryAmount}/month offered, typical range: ₹${benchmark.min}-${benchmark.max}/month`,
      });
    }

    // Check if salary is suspiciously round (could indicate fake)
    if (salaryAmount % 10000 === 0 && salaryAmount > 100000) {
      flags.push({
        type: 'SUSPICIOUSLY_ROUND_SALARY',
        severity: 'low',
        description: 'Salary is suspiciously round (possible placeholder)',
        evidence: `Salary: ₹${salaryAmount}`,
      });
    }

    return flags;
  }

  private static checkCompanyNameLegitimacy(companyName: string): RedFlag | null {
    const companyLower = companyName.toLowerCase();
    
    // Check for generic/suspicious company names
    const suspiciousPatterns = [
      /^(company|firm|business|enterprise|corp|group)\s*\d*$/i,
      /^(xyz|abc|test|demo|sample)\b/i,
      /^(job|work|opportunity)/i,
      /unlimited/i,
      /golden/i,
      /millionaire/i,
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(companyName))) {
      return {
        type: 'SUSPICIOUS_COMPANY_NAME',
        severity: 'high',
        description: 'Company name matches suspicious naming patterns',
        evidence: `Company name: "${companyName}"`,
      };
    }

    // Check if company name is too short
    if (companyName.length < 3) {
      return {
        type: 'INVALID_COMPANY_NAME',
        severity: 'medium',
        description: 'Company name is too short or invalid format',
        evidence: `Company name: "${companyName}"`,
      };
    }

    return null;
  }

  private static analyzePostingStructure(request: JobAnalysisRequest): RedFlag | null {
    const descriptionLength = request.jobDescription.length;
    
    if (descriptionLength < 50) {
      return {
        type: 'SUSPICIOUSLY_SHORT',
        severity: 'high',
        description: 'Job description is extremely brief (likely low effort/fake posting)',
        evidence: `Description length: ${descriptionLength} characters (minimum recommended: 200+)`,
      };
    }

    if (descriptionLength < 150) {
      return {
        type: 'VAGUE_DESCRIPTION',
        severity: 'medium',
        description: 'Job description lacks detail',
        evidence: `Description length: ${descriptionLength} characters`,
      };
    }

    // Check if description has actual job details
    const jobKeywords = ['responsibilities', 'requirements', 'skills', 'experience', 'qualifications', 'duties', 'tasks'];
    const hasJobDetails = jobKeywords.some((keyword) => request.jobDescription.toLowerCase().includes(keyword));
    
    if (!hasJobDetails && descriptionLength < 300) {
      return {
        type: 'MISSING_JOB_DETAILS',
        severity: 'medium',
        description: 'Job posting lacks standard job description elements',
        evidence: 'No typical job details found (responsibilities, requirements, etc.)',
      };
    }

    return null;
  }

  private static validatePhoneNumber(phone: string): RedFlag | null {
    // Check if phone matches Indian format or valid international format
    const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/; // Indian phone numbers
    const internationalRegex = /^\+?1?\d{9,15}$/; // Basic international

    if (!phoneRegex.test(phone.replace(/[\s-()]/g, '')) && !internationalRegex.test(phone.replace(/[\s-()]/g, ''))) {
      return {
        type: 'INVALID_PHONE',
        severity: 'medium',
        description: 'Phone number format appears invalid or suspicious',
        evidence: `Phone: ${phone}`,
      };
    }

    return null;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static extractDomain(email: string): string {
    return email.split('@')[1] || '';
  }

  private static checkGrammarQuality(text: string): number {
    let qualityScore = 1.0;
    
    const issues = [
      /\s{2,}/g,
      /[a-z][A-Z]/g,
      /[!?]{2,}/g,
      /[^\w\s][^\w\s]{2,}/g, // Multiple special characters
    ];

    issues.forEach((pattern) => {
      const matches = text.match(pattern) || [];
      qualityScore -= matches.length * 0.02;
    });

    return Math.max(qualityScore, 0);
  }

  private static generateAnalysisReport(redFlags: RedFlag[], riskScore: number): string {
    const flagsSummary = redFlags
      .map((flag) => `• [${flag.severity.toUpperCase()}] ${flag.type}: ${flag.description}`)
      .join('\n');

    const riskLevel = riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW';
    const recommendation =
      riskScore > 70
        ? '🚨 CRITICAL: Do not proceed. Verify with official company channels before any engagement.'
        : riskScore > 40
        ? '⚠️ CAUTION: Verify company details, contact official HR department, never share personal info or payment details.'
        : '✅ LOW RISK: Appears legitimate. Still verify independently and use standard job application procedures.';

    return `
╔════════════════════════════════════════════╗
║     FRAUD ANALYSIS REPORT                  ║
╚════════════════════════════════════════════╝

Risk Score: ${riskScore}/100 [${riskLevel} RISK]
Analysis Timestamp: ${new Date().toLocaleString('en-IN')}

RED FLAGS DETECTED (${redFlags.length}):
${flagsSummary || '✓ No red flags detected'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATION:
${recommendation}

SAFETY TIPS:
• Never share personal/financial information upfront
• Verify company independently on official website
• Contact official HR department directly
• Be cautious of pressure to act quickly
• Legitimate companies don't require upfront payments
• Check Glassdoor, LinkedIn for company reviews
    `.trim();
  }
}
