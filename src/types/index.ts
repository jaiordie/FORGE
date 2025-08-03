import { UserRole, JobStatus, JobUrgency, QuoteStatus, QuoteTier } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  jobType: string;
  urgency: JobUrgency;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateQuoteRequest {
  goodTitle: string;
  goodDescription: string;
  goodPrice: number;
  betterTitle: string;
  betterDescription: string;
  betterPrice: number;
  bestTitle: string;
  bestDescription: string;
  bestPrice: number;
}

export interface UpdateJobStatusRequest {
  status: JobStatus;
  scheduledAt?: string;
  completedAt?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface PlumberDashboardData {
  profile: {
    xp: number;
    level: number;
    forgeScore: number;
    isActive: boolean;
  };
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  jobs: {
    available: number;
    inProgress: number;
    completed: number;
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  }>;
}

export interface JobWithDetails {
  id: string;
  title: string;
  description: string;
  jobType: string;
  urgency: JobUrgency;
  status: JobStatus;
  address: string;
  latitude?: number;
  longitude?: number;
  createdBy: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  photos: Array<{
    id: string;
    url: string;
    caption?: string;
  }>;
  quotes: Array<{
    id: string;
    goodTitle: string;
    goodDescription: string;
    goodPrice: number;
    betterTitle: string;
    betterDescription: string;
    betterPrice: number;
    bestTitle: string;
    bestDescription: string;
    bestPrice: number;
    selectedTier?: QuoteTier;
    status: QuoteStatus;
  }>;
  requestedAt: Date;
  scheduledAt?: Date;
  completedAt?: Date;
}