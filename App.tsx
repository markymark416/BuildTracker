import React, { useState, useEffect } from 'react';
import { ProjectMap } from './components/ProjectMap';
import { ProjectDetails } from './components/ProjectDetails';
import { ConstructionProject } from './types/construction';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ConstructionProject | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleProjectSelect = (project: ConstructionProject) => {
    setSelectedProject(project);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    if (isMobile) {
      setSelectedProject(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🏗️</span>
          </div>
          <h1 className="text-xl font-black text-white">BuildTracker</h1>
        </div>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-white">notifications</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Side by side */}
        {!isMobile ? (
          <>
            <div className="w-1/2 relative">
              <ProjectMap 
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
              />
            </div>
            <div className="w-1/2 bg-slate-800 overflow-y-auto">
              {selectedProject ? (
                <ProjectDetails 
                  project={selectedProject}
                  onClose={handleCloseDetails}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-6xl mb-4">location_searching</span>
                    <p className="font-bold">Select a project on the map</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Mobile: Swipeable views */
          <>
            <div className={`w-full transition-transform duration-300 ${showDetails ? '-translate-x-full' : 'translate-x-0'}`}>
              <ProjectMap 
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
              />
            </div>
            {showDetails && (
              <div className="absolute inset-0 bg-slate-800 z-40">
                <ProjectDetails 
                  project={selectedProject!}
                  onClose={handleCloseDetails}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
