// File: api/construction-projects.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ConstructionProject, Phase } from '../types/construction';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Toronto Open Data API
    const TORONTO_API = 'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search';
    const RESOURCE_ID = '6841cbef-5734-4900-87f0-a32b8e6f8e07';
    
    const response = await fetch(
      `${TORONTO_API}?resource_id=${RESOURCE_ID}&limit=50`
    );

    let projects: ConstructionProject[] = [];

    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.result?.records) {
        projects = data.result.records.map((permit: any, index: number) => 
          transformToProject(permit, index)
        ).filter((p: ConstructionProject) => p.latitude && p.longitude);
      }
    }

    // Fallback to demo data if API fails or returns no data
    if (projects.length === 0) {
      projects = getDemoProjects();
    }

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects: projects,
      source: projects.length > 10 ? 'Toronto Open Data' : 'Demo Data',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(200).json({
      success: true,
      count: 3,
      projects: getDemoProjects(),
      source: 'Demo Data (API Error)',
      lastUpdated: new Date().toISOString()
    });
  }
}

function transformToProject(permit: any, index: number): ConstructionProject {
  const projectTypes = ['New Build', 'Renovation', 'Demolition', 'Addition'];
  const projectType = permit.WORK_TYPE?.includes('NEW') ? 'New Build' : 
                      permit.WORK_TYPE?.includes('ALTER') ? 'Renovation' : 
                      projectTypes[index % 4];
  
  const phases = generatePhases(Math.floor(Math.random() * 100));
  const currentPhaseIndex = phases.findIndex(p => p.status === 'active');
  
  return {
    id: permit._id?.toString() || `project-${index}`,
    name: generateProjectName(projectType, permit.STREET_NAME),
    address: `${permit.STREET_NUM || ''} ${permit.STREET_NAME || ''} ${permit.STREET_TYPE || ''}`.trim() || 'Address not available',
    projectType: projectType as any,
    description: permit.DESCRIPTION || `${projectType} project in progress`,
    value: parseFloat(permit.CURRENT_VALUE) || Math.floor(Math.random() * 20000000) + 1000000,
    permitNumber: permit.PERMIT_NUM || `BP-2024-${String(index).padStart(5, '0')}`,
    permitDate: permit.ISSUED_DATE || new Date().toISOString().split('T')[0],
    status: 'ACTIVE PERMIT' as any,
    latitude: parseFloat(permit.LATITUDE) || 43.6532 + (Math.random() - 0.5) * 0.1,
    longitude: parseFloat(permit.LONGITUDE) || -79.3832 + (Math.random() - 0.5) * 0.1,
    contractor: permit.CONTRACTOR_NAME || generateContractorName(),
    estimatedCompletion: generateCompletionDate(),
    currentPhase: phases[currentPhaseIndex] || phases[0],
    phases: phases,
    images: generateImages(),
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    updates: generateUpdates(),
    followers: Math.floor(Math.random() * 500) + 10,
    isFollowing: false
  };
}

function generatePhases(overallProgress: number): Phase[] {
  const phaseDefinitions = [
    { name: 'PLANNING', label: 'Planning', threshold: 0 },
    { name: 'EXCAVATION', label: 'Excavation', threshold: 20 },
    { name: 'FOUNDATION', label: 'Foundation', threshold: 40 },
    { name: 'FRAMING', label: 'Framing', threshold: 60 },
    { name: 'FINISHING', label: 'Finishing', threshold: 80 }
  ];

  return phaseDefinitions.map((def, index) => {
    const nextThreshold = phaseDefinitions[index + 1]?.threshold || 100;
    let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
    let progress = 0;

    if (overallProgress >= nextThreshold) {
      status = 'completed';
      progress = 100;
    } else if (overallProgress >= def.threshold) {
      status = 'active';
      progress = Math.round(((overallProgress - def.threshold) / (nextThreshold - def.threshold)) * 100);
    }

    return {
      id: `phase-${index}`,
      name: def.name as any,
      label: def.label,
      progress,
      status
    };
  });
}

function generateProjectName(type: string, streetName: string): string {
  const names = {
    'New Build': ['The', 'Meridian', 'Skyline', 'Horizon', 'Summit', 'Vista'],
    'Renovation': ['Heritage', 'Classic', 'Restored', 'Renewed'],
    'Addition': ['Extended', 'Expanded'],
    'Demolition': ['Former']
  };
  
  const prefix = names[type as keyof typeof names]?.[Math.floor(Math.random() * names[type as keyof typeof names].length)] || 'The';
  const suffix = streetName ? `${streetName} Residences` : 'Heights Development';
  
  return `${prefix} ${suffix}`;
}

function generateContractorName(): string {
  const names = ['Elite Builders Inc', 'Summit Construction', 'Urban Development Corp', 
                 'Heritage Builders Ltd', 'Apex Construc tion', 'Premier Build Co'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateCompletionDate(): string {
  const months = Math.floor(Math.random() * 18) + 6;
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

function generateImages() {
  const constructionImages = [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1590496793907-4af9d1f8c5db?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop'
  ];

  return constructionImages.slice(0, 2 + Math.floor(Math.random() * 2)).map((url, i) => ({
    id: `img-${i}`,
    url,
    caption: `Progress update ${i + 1}`,
    uploadedBy: 'Local Neighbor',
    uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'progress' as any
  }));
}

function generateUpdates() {
  const updates = [
    "Foundation is complete! Framing crew arrives Monday.",
    "They're making great progress. Concrete dried faster than expected.",
    "Slight delay due to weather, but should be back on track next week."
  ];

  return updates.slice(0, 1 + Math.floor(Math.random() * 2)).map((text, i) => ({
    id: `update-${i}`,
    username: ['Local Neighbor', 'Construction Watch', 'Community Member'][i % 3],
    text,
    timestamp: new Date(Date.now() - (i + 1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 50) + 5
  }));
}

function getDemoProjects(): ConstructionProject[] {
  return [
    transformToProject({
      _id: 'demo-1',
      STREET_NUM: '123',
      STREET_NAME: 'King',
      STREET_TYPE: 'St W',
      WORK_TYPE: 'NEW CONSTRUCTION',
      DESCRIPTION: '12-storey residential condo building',
      CURRENT_VALUE: '15000000',
      PERMIT_NUM: 'BP-2024-00123',
      ISSUED_DATE: '2024-06-15',
      STATUS: 'UNDER CONSTRUCTION',
      LATITUDE: '43.6426',
      LONGITUDE: '-79.3871',
      CONTRACTOR_NAME: 'Elite Builders Inc'
    }, 0),
    transformToProject({
      _id: 'demo-2',
      STREET_NUM: '456',
      STREET_NAME: 'Queen',
      STREET_TYPE: 'St E',
      WORK_TYPE: 'ALTERATION',
      DESCRIPTION: 'Commercial facade restoration',
      CURRENT_VALUE: '2500000',
      PERMIT_NUM: 'BP-2024-00456',
      ISSUED_DATE: '2024-08-20',
      STATUS: 'UNDER CONSTRUCTION',
      LATITUDE: '43.6571',
      LONGITUDE: '-79.3633',
      CONTRACTOR_NAME: 'Heritage Restorations'
    }, 1),
    transformToProject({
      _id: 'demo-3',
      STREET_NUM: '789',
      STREET_NAME: 'Yonge',
      STREET_TYPE: 'St',
      WORK_TYPE: 'NEW CONSTRUCTION',
      DESCRIPTION: '5-storey mixed-use development',
      CURRENT_VALUE: '8000000',
      PERMIT_NUM: 'BP-2024-00789',
      ISSUED_DATE: '2024-09-01',
      STATUS: 'UNDER CONSTRUCTION',
      LATITUDE: '43.6634',
      LONGITUDE: '-79.3808',
      CONTRACTOR_NAME: 'Urban Builders Corp'
    }, 2)
  ];
}
