export type IssueCategory =
  | 'Roads & Potholes'
  | 'Water & Leakage'
  | 'Streetlights'
  | 'Sanitation & Waste'
  | 'Parks & Public Spaces'
  | 'Other';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueStatus = 'Reported' | 'Verified' | 'In Progress' | 'Resolved';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  latitude: number;
  longitude: number;
  address: string;
  imageUrl?: string;
  reporterName: string;
  reporterId: string;
  upvotes: number;
  upvotedBy: string[]; // List of user IDs
  flags: number;
  flaggedBy: string[]; // List of user IDs
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  acousticHz?: number; // Diagnostic sound Hertz frequency
  acousticDb?: number; // Diagnostic sound Decibel loudness
  pledges: VolunteerPledge[]; // Micro-volunteer/resource commits
  aiResponse?: {
    summary: string;
    suggestedAction: string;
    targetDaysToResolve: number;
    dispatchedTo: string;
    alternativeImpact: string;
  };
  comments: Comment[];
}

export interface VolunteerPledge {
  id: string;
  userId: string;
  issueId: string;
  name: string;
  resourceType: 'Labor (Hours)' | 'Traffic Cones' | 'Shovels & Rakes' | 'Spray Paint' | 'Sacks & Bins';
  quantity: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  issueId: string;
  username: string;
  userRole: 'citizen' | 'official' | 'ai-assistant';
  text: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  reportsCreated: number;
  verificationsCompleted: number;
  resolvedContributed: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  icon: string; // lucide icon name
  color: string; // Tailwind color class
}

export interface CityStats {
  totalIssuesCount: number;
  resolvedIssuesCount: number;
  inProgressIssuesCount: number;
  reportedIssuesCount: number;
  averageResolutionTimeDays: number; // in days
  pointsDistributed: number;
  co2SavedKg: number; // calculated from waste/water reports fixed
  safetyScore: number; // 0-100 rating
}

export interface PresavedLocation {
  name: string;
  latitude: number;
  longitude: number;
  issueCount: number;
}

// Vendor Ecosystem Interfaces
export interface VendorItem {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  slaDays: number;
  baseCharge: number;
  contact: string;
  available: boolean;
}

// Financial Records
export interface FinanceRecord {
  id: string;
  date: string;
  type: 'Maintenance Fee' | 'Repair Payout' | 'Security Fund' | 'Utility Tanker' | 'Event Spending';
  description: string;
  amount: number;
  category: 'income' | 'expense';
  vendorId?: string;
  invoiceUrl?: string;
}

// Resident Engagement
export interface SkillExchangeItem {
  id: string;
  residentName: string;
  flatNum: string;
  skillName: string;
  description: string;
  availableDays: string;
}

export interface MarketItem {
  id: string;
  title: string;
  price: number;
  description: string;
  sellerFlat: string;
  category: 'Rent' | 'Furniture' | 'Electronics' | 'Service' | 'Other';
  imageUrl?: string;
}

export interface HelperItem {
  id: string;
  name: string;
  role: 'Cook' | 'Maid' | 'Driver' | 'Nanny' | 'Gardener';
  rating: number;
  flatsWorking: string[];
  monthlySalaryEstimate: number;
  recommendationQuote: string;
}

// Remote Owners Remote State
export interface TenantRecord {
  id: string;
  flatNum: string;
  ownerName: string;
  ownerContact: string;
  tenantName: string;
  rentAmount: number;
  rentPaidStatus: 'Paid' | 'Pending';
  onboardingStep: 'Verified ID' | 'Agreement Pending' | 'Completed';
  lastVisitorLog: string;
  utilityUsageUnits: number;
}

