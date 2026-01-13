// File: api/construction-projects.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Return rich demo data for Toronto
  const projects = [
    {
      id: '1',
      name: 'The Meridian Residences',
      address: '123 King St W, Toronto',
      projectType: 'New Build',
      description: '12-storey luxury residential condo with retail on ground floor',
      value: 15000000,
      permitNumber: 'BP-2023-39413',
      permitDate: '2023-06-15',
      status: 'ACTIVE PERMIT',
      latitude: 43.6426,
      longitude: -79.3871,
      contractor: 'Elite Builders Inc',
      estimatedCompletion: '2026-10-15',
      currentPhase: {
        id: 'phase-3',
        name: 'FOUNDATION',
        label: 'Foundation',
        progress: 65,
        status: 'active'
      },
      phases: [
        { id: 'phase-1', name: 'PLANNING', label: 'Planning', progress: 100, status: 'completed' },
        { id: 'phase-2', name: 'EXCAVATION', label: 'Excavation', progress: 100, status: 'completed' },
        { id: 'phase-3', name: 'FOUNDATION', label: 'Foundation', progress: 65, status: 'active' },
        { id: 'phase-4', name: 'FRAMING', label: 'Framing', progress: 0, status: 'upcoming' },
        { id: 'phase-5', name: 'FINISHING', label: 'Finishing', progress: 0, status: 'upcoming' }
      ],
      images: [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
          caption: 'Foundation work in progress',
          uploadedBy: 'Construction Watch',
          uploadedAt: '2025-01-10T14:30:00Z',
          type: 'progress'
        },
        {
          id: 'img-2',
          url: 'https://images.unsplash.com/photo-1590496793907-4af9d1f8c5db?w=800&h=600&fit=crop',
          caption: 'Concrete pouring',
          uploadedBy: 'Local Neighbor',
          uploadedAt: '2025-01-08T09:15:00Z',
          type: 'progress'
        }
      ],
      beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      updates: [
        {
          id: 'update-1',
          username: 'Local Neighbor',
          text: 'Foundation is complete! Framing crew arrives Monday. Great progress this week.',
          timestamp: '2025-01-12T18:00:00Z',
          likes: 24
        },
        {
          id: 'update-2',
          username: 'Construction Watch',
          text: 'Concrete dried faster than expected. Should be ahead of schedule.',
          timestamp: '2025-01-10T12:30:00Z',
          likes: 15
        }
      ],
      followers: 142,
      isFollowing: false
    },
    {
      id: '2',
      name: 'Queen Street Heritage Restoration',
      address: '456 Queen St E, Toronto',
      projectType: 'Renovation',
      description: 'Historic commercial building facade restoration and interior modernization',
      value: 2500000,
      permitNumber: 'BP-2024-12856',
      permitDate: '2024-08-20',
      status: 'ACTIVE PERMIT',
      latitude: 43.6571,
      longitude: -79.3633,
      contractor: 'Heritage Restorations Ltd',
      estimatedCompletion: '2026-03-20',
      currentPhase: {
        id: 'phase-5',
        name: 'FINISHING',
        label: 'Finishing',
        progress: 85,
        status: 'active'
      },
      phases: [
        { id: 'phase-1', name: 'PLANNING', label: 'Planning', progress: 100, status: 'completed' },
        { id: 'phase-2', name: 'EXCAVATION', label: 'Excavation', progress: 100, status: 'completed' },
        { id: 'phase-3', name: 'FOUNDATION', label: 'Foundation', progress: 100, status: 'completed' },
        { id: 'phase-4', name: 'FRAMING', label: 'Framing', progress: 100, status: 'completed' },
        { id: 'phase-5', name: 'FINISHING', label: 'Finishing', progress: 85, status: 'active' }
      ],
      images: [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
          caption: 'Exterior restoration',
          uploadedBy: 'Heritage Lover',
          uploadedAt: '2025-01-11T16:00:00Z',
          type: 'progress'
        }
      ],
      beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      updates: [
        {
          id: 'update-1',
          username: 'Heritage Lover',
          text: 'Beautiful restoration work! The original brickwork is being preserved perfectly.',
          timestamp: '2025-01-11T16:00:00Z',
          likes: 38
        }
      ],
      followers: 89,
      isFollowing: false
    },
    {
      id: '3',
      name: 'Yonge Street Mixed-Use Development',
      address: '789 Yonge St, Toronto',
      projectType: 'New Build',
      description: '5-storey mixed-use development with commercial ground floor and residential above',
      value: 8000000,
      permitNumber: 'BP-2024-15234',
      permitDate: '2024-09-01',
      status: 'ACTIVE PERMIT',
      latitude: 43.6634,
      longitude: -79.3808,
      contractor: 'Urban Builders Corp',
      estimatedCompletion: '2026-12-01',
      currentPhase: {
        id: 'phase-2',
        name: 'EXCAVATION',
        label: 'Excavation',
        progress: 45,
        status: 'active'
      },
      phases: [
        { id: 'phase-1', name: 'PLANNING', label: 'Planning', progress: 100, status: 'completed' },
        { id: 'phase-2', name: 'EXCAVATION', label: 'Excavation', progress: 45, status: 'active' },
        { id: 'phase-3', name: 'FOUNDATION', label: 'Foundation', progress: 0, status: 'upcoming' },
        { id: 'phase-4', name: 'FRAMING', label: 'Framing', progress: 0, status: 'upcoming' },
        { id: 'phase-5', name: 'FINISHING', label: 'Finishing', progress: 0, status: 'upcoming' }
      ],
      images: [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop',
          caption: 'Excavation underway',
          uploadedBy: 'Community Member',
          uploadedAt: '2025-01-09T11:00:00Z',
          type: 'progress'
        }
      ],
      beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      updates: [
        {
          id: 'update-1',
          username: 'Community Member',
          text: 'Excavation progressing well. Hitting bedrock next week.',
          timestamp: '2025-01-09T11:00:00Z',
          likes: 12
        }
      ],
      followers: 67,
      isFollowing: false
    },
    {
      id: '4',
      name: 'Distillery District Lofts',
      address: '15 Trinity St, Toronto',
      projectType: 'Renovation',
      description: 'Historic warehouse conversion to luxury loft condos',
      value: 12000000,
      permitNumber: 'BP-2023-45678',
      permitDate: '2023-11-10',
      status: 'ACTIVE PERMIT',
      latitude: 43.6503,
      longitude: -79.3598,
      contractor: 'Loft Conversions Inc',
      estimatedCompletion: '2026-06-30',
      currentPhase: {
        id: 'phase-4',
        name: 'FRAMING',
        label: 'Framing',
        progress: 55,
        status: 'active'
      },
      phases: [
        { id: 'phase-1', name: 'PLANNING', label: 'Planning', progress: 100, status: 'completed' },
        { id: 'phase-2', name: 'EXCAVATION', label: 'Excavation', progress: 100, status: 'completed' },
        { id: 'phase-3', name: 'FOUNDATION', label: 'Foundation', progress: 100, status: 'completed' },
        { id: 'phase-4', name: 'FRAMING', label: 'Framing', progress: 55, status: 'active' },
        { id: 'phase-5', name: 'FINISHING', label: 'Finishing', progress: 0, status: 'upcoming' }
      ],
      images: [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
          caption: 'Interior framing',
          uploadedBy: 'Architecture Fan',
          uploadedAt: '2025-01-13T10:00:00Z',
          type: 'progress'
        }
      ],
      beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      updates: [
        {
          id: 'update-1',
          username: 'Architecture Fan',
          text: 'Love how they preserved the original brick walls! This will be stunning.',
          timestamp: '2025-01-13T10:00:00Z',
          likes: 56
        }
      ],
      followers: 234,
      isFollowing: false
    },
    {
      id: '5',
      name: 'Harbourfront Towers',
      address: '88 Queens Quay W, Toronto',
      projectType: 'New Build',
      description: 'Twin 40-storey luxury waterfront residential towers',
      value: 75000000,
      permitNumber: 'BP-2023-28901',
      permitDate: '2023-04-01',
      status: 'ACTIVE PERMIT',
      latitude: 43.6387,
      longitude: -79.3816,
      contractor: 'Skyline Construction Group',
      estimatedCompletion: '2027-08-15',
      currentPhase: {
        id: 'phase-4',
        name: 'FRAMING',
        label: 'Framing',
        progress: 30,
        status: 'active'
      },
      phases: [
        { id: 'phase-1', name: 'PLANNING', label: 'Planning', progress: 100, status: 'completed' },
        { id: 'phase-2', name: 'EXCAVATION', label: 'Excavation', progress: 100, status: 'completed' },
        { id: 'phase-3', name: 'FOUNDATION', label: 'Foundation', progress: 100, status: 'completed' },
        { id: 'phase-4', name: 'FRAMING', label: 'Framing', progress: 30, status: 'active' },
        { id: 'phase-5', name: 'FINISHING', label: 'Finishing', progress: 0, status: 'upcoming' }
      ],
      images: [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
          caption: 'Tower construction progress',
          uploadedBy: 'Waterfront Resident',
          uploadedAt: '2025-01-12T15:00:00Z',
          type: 'progress'
        }
      ],
      beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      updates: [
        {
          id: 'update-1',
          username: 'Waterfront Resident',
          text: 'Construction is moving fast! Already at floor 12 on Tower A.',
          timestamp: '2025-01-12T15:00:00Z',
          likes: 45
        }
      ],
      followers: 312,
      isFollowing: false
    }
  ];

  return res.status(200).json({
    success: true,
    count: projects.length,
    projects: projects,
    source: 'Demo Data - Toronto',
    lastUpdated: new Date().toISOString()
  });
}
