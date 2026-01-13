import React, { useState, useEffect } from 'react';
import { ConstructionProject } from '../types/construction';

interface FavoritesProps {
  projects: ConstructionProject[];
  onSelectProject: (project: ConstructionProject) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ projects, onSelectProject }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('buildtracker_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      
      localStorage.setItem('buildtracker_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (projectId: string) => favorites.includes(projectId);

  const favoriteProjects = projects.filter(p => favorites.includes(p.id));

  return (
    <>
      {/* Favorites Button */}
      <button
        onClick={() => setShowFavorites(true)}
        className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
      >
        <span className="material-symbols-outlined text-white">bookmark</span>
        {favorites.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
            {favorites.length}
          </span>
        )}
      </button>

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500">bookmark</span>
                <h2 className="text-xl font-black text-white">Saved Projects</h2>
                <span className="text-sm text-slate-500">({favorites.length})</span>
              </div>
              <button
                onClick={() => setShowFavorites(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>

            {/* Favorites List */}
            <div className="flex-1 overflow-y-auto p-4">
              {favoriteProjects.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <span className="material-symbols-outlined text-6xl mb-4 block text-slate-700">
                    bookmark_border
                  </span>
                  <p className="text-lg font-bold mb-2">No saved projects yet</p>
                  <p className="text-sm">
                    Click the bookmark icon on any project to save it here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-slate-800 rounded-xl overflow-hidden hover:bg-slate-750 transition-colors"
                    >
                      <div className="flex gap-3 p-3">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                          {project.images[0] ? (
                            <img
                              src={project.images[0].url}
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              🏗️
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm mb-1 truncate">
                            {project.name}
                          </h3>
                          <p className="text-xs text-slate-400 truncate mb-2">
                            {project.address}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">
                              {project.projectType}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {project.currentPhase.progress}% complete
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                onSelectProject(project);
                                setShowFavorites(false);
                              }}
                              className="flex-1 py-2 px-3 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => toggleFavorite(project.id)}
                              className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                            >
                              <span className="material-symbols-outlined text-yellow-500 text-lg">
                                bookmark
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Favorite Button Component (use in project detail views)
interface FavoriteButtonProps {
  projectId: string;
  size?: 'sm' | 'md' | 'lg';
  onToggle?: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  projectId, 
  size = 'md',
  onToggle 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('buildtracker_favorites');
    if (saved) {
      const favorites = JSON.parse(saved);
      setIsFavorite(favorites.includes(projectId));
    }
  }, [projectId]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem('buildtracker_favorites');
    const favorites = saved ? JSON.parse(saved) : [];
    
    const updated = favorites.includes(projectId)
      ? favorites.filter((id: string) => id !== projectId)
      : [...favorites, projectId];
    
    localStorage.setItem('buildtracker_favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    onToggle?.();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`${sizeClasses[size]} bg-slate-800/70 backdrop-blur hover:bg-slate-700/70 rounded-full flex items-center justify-center transition-all hover:scale-110`}
    >
      <span className={`material-symbols-outlined ${isFavorite ? 'text-yellow-500' : 'text-white'}`}>
        {isFavorite ? 'bookmark' : 'bookmark_border'}
      </span>
    </button>
  );
};
