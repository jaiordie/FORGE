export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PLUMBER' | 'DISPATCHER' | 'HOMEOWNER' | 'ADMIN';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface PlumberProfile {
  xp: number;
  level: number;
  forgeScore: number;
  isActive: boolean;
}

export interface Earnings {
  today: number;
  week: number;
  month: number;
  total: number;
}

export interface JobCounts {
  available: number;
  inProgress: number;
  completed: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface DashboardData {
  profile: PlumberProfile;
  earnings: Earnings;
  jobs: JobCounts;
  badges: Badge[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  jobType: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'REQUESTED' | 'QUOTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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
    selectedTier?: 'GOOD' | 'BETTER' | 'BEST';
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  }>;
  requestedAt: string;
  scheduledAt?: string;
  completedAt?: string;
}

export interface QuoteRequest {
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

export interface JobRequest {
  title: string;
  description: string;
  jobType: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  address: string;
  latitude?: number;
  longitude?: number;
}