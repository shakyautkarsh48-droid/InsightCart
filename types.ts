
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface Suggestion {
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Rating {
  userId: string;
  score: number;
}

export interface SavedProduct {
  id: string;
  userId: string;
  name: string;
  link?: string;
  description: string;
  category: string;
  timestamp: number;
}

export interface ProductInput {
  name: string;
  productLink?: string;
  description: string;
  category: string;
  price: string;
  targetAudience: string;
  country: string;
  platform: string;
}

export interface Mistake {
  rank: number;
  title: string;
  whyItMatters: string;
  conversionImpact: string;
  severity: 'Critical' | 'High' | 'Moderate';
}

export interface Strategy {
  category: 'Pricing' | 'Features/Bundles' | 'Repositioning' | 'Trust';
  whatToChange: string;
  whyItWorks: string;
  impact: 'Low' | 'Medium' | 'High';
}

export interface SalesChannel {
  rank: number;
  platform: string;
  contentFormat: string;
  creatorType: string;
  conversionLogic: string;
}

export interface GTMPlan {
  launchAngle: string;
  timeline: {
    days1to7: string;
    days8to21: string;
    days22to30: string;
  };
  adHooks: string[];
  outreachAngle: string;
  funnelStages: { stage: string; action: string }[];
}

export interface Competitor {
  name: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  positioning: string;
}

export interface Normalization {
  coreProblem: string;
  buyerPersona: string;
  valueProp: string;
  pricePositioning: string;
  initialRiskFlags: string[];
}

export interface AnalysisResult {
  id: string;
  userId: string;
  userName?: string;
  timestamp: number;
  productName: string;
  selectedMode: 'LINK-BASED ANALYSIS' | 'MANUAL DATA ANALYSIS';
  dataConfidence: 'High' | 'Medium' | 'Low';
  normalization: Normalization;
  failureRiskScore: number;
  topMistakes: Mistake[];
  optimizationStrategies: Strategy[];
  salesStrategy: SalesChannel[];
  gtmPlan: GTMPlan;
  competitiveAnalysis: Competitor[];
  summary: string;
  isPublic?: boolean;
  ratings?: Rating[];
  suggestions?: Suggestion[];
}

export interface TrendingAggregate {
  topCategories: { name: string; growth: string }[];
  winningPriceBands: { band: string; successRate: string }[];
  platformPerformance: { name: string; score: string }[];
  commonWinningPatterns: string[];
  commonFailurePatterns: string[];
}

export type ViewState = 'auth' | 'home' | 'form' | 'loading' | 'result' | 'history' | 'saved-products' | 'compare-two' | 'trending';
