export interface ConstructionProject {
  id: string;
  name: string;
  address: string;
  projectType: 'New Build' | 'Renovation' | 'Demolition' | 'Addition';
  description: string;
  value: number;
  permitNumber: string;
  permitDate: string;
  status: 'ACTIVE PERMIT' | 'UNDER CONSTRUCTION' | 'COMPLETED' | 'ON HOLD';
  latitude: number;
  longitude: number;
  contractor: string;
  estimatedCompletion: string;
  
  // Phase tracking
  currentPhase: Phase;
  phases: Phase[];
  
  // Media
  images: ProjectImage[];
  beforeImage?: string;
  afterImage?: string;
  
  // User-generated content
  updates: UserUpdate[];
  followers: number;
  isFollowing?: boolean;
}

export interface Phase {
  id: string;
  name: 'PLANNING' | 'EXCAVATION' | 'FOUNDATION' | 'FRAMING' | 'FINISHING';
  label: string;
  progress: number; // 0-100
  status: 'completed' | 'active' | 'upcoming';
  startDate?: string;
  endDate?: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  type: 'progress' | 'before' | 'after';
}

export interface UserUpdate {
  id: string;
  username: string;
  avatar?: string;
  text: string;
  timestamp: string;
  likes: number;
  images?: string[];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type FilterType = 'all' | 'near-me' | 'new-build' | 'renovation';
