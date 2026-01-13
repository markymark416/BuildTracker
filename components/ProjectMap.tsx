import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ConstructionProject, FilterType } from '../types/construction';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ProjectMapProps {
  selectedProject: ConstructionProject | null;
  onProjectSelect: (project: ConstructionProject) => void;
}

export const ProjectMap: React.FC<ProjectMapProps> = ({ selectedProject, onProjectSelect }) => {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [userLocation, setUserLocation] = useState<[number, number]>([43.6532, -79.3832]);
  const [hoveredProject, setHoveredProject] = useState<ConstructionProject | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        }
      );
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/construction-projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCustomMarker = (type: string, isSelected: boolean) => {
    const colors = {
      'New Build': '#3b82f6',
      'Renovation': '#f59e0b',
      'Demolition': '#ef4444',
      'Addition': '#8b5cf6'
    };
    const color = colors[type as keyof typeof colors] || '#3b82f6';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: ${isSelected ? '#fbbf24' : color};
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="font-size: ${isSelected ? '16px' : '14px'}">🏗️</span>
        </div>
      `,
      iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
      iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
    });
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'new-build') return project.projectType === 'New Build';
    if (filter === 'renovation') return project.projectType === 'Renovation';
    return true;
  });

  return (
    <div className="relative h-full w-full bg-slate-900">
      {/* Search and Filters */}
      <div className="absolute top-4 left-4 right-4 z-[1000] space-y-3">
        <div className="bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <span className="material-symbols-outlined text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search address or zip code"
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('near-me')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              filter === 'near-me' ? 'bg-primary text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">near_me</span>
            Near Me
          </button>
          <button
            onClick={() => setFilter('new-build')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              filter === 'new-build' ? 'bg-primary text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">apartment</span>
            New Build
          </button>
          <button
            onClick={() => setFilter('renovation')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              filter === 'renovation' ? 'bg-primary text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">home_repair_service</span>
            Renovation
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={10}
          keepBuffer={4}
          updateWhenIdle={false}
          updateWhenZooming={false}
          updateInterval={200}
        />

        {filteredProjects.map((project) => (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={createCustomMarker(project.projectType, selectedProject?.id === project.id)}
            eventHandlers={{
              click: () => onProjectSelect(project),
              mouseover: () => setHoveredProject(project),
              mouseout: () => setHoveredProject(null),
            }}
          />
        ))}
      </MapContainer>

      {/* Bottom Sheet Preview */}
      {(hoveredProject || selectedProject) && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex gap-3 p-3">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0 relative">
                {(hoveredProject || selectedProject)?.images[0] ? (
                  <img
                    src={(hoveredProject || selectedProject)!.images[0].url}
                    alt="Project"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🏗️
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="text-[8px] font-black bg-yellow-500 text-slate-900 px-2 py-0.5 rounded">
                    {(hoveredProject || selectedProject)?.projectType.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">
                      {(hoveredProject || selectedProject)?.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {(hoveredProject || selectedProject)?.address}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">0.2 mi</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] font-black bg-green-500/20 text-green-400 px-2 py-0.5 rounded uppercase">
                    In Real-Time
                  </span>
                  <span className="text-[9px] text-slate-500">Last update: 2h ago</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onProjectSelect((hoveredProject || selectedProject)!)}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">visibility</span>
              View Project Details
            </button>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[999] flex flex-col gap-2">
        <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-white shadow-lg transition-colors">
          <span className="material-symbols-outlined">add</span>
        </button>
        <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-white shadow-lg transition-colors">
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-white shadow-lg transition-colors">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-[1001]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white font-bold">Loading projects...</p>
          </div>
        </div>
      )}
    </div>
  );
};
