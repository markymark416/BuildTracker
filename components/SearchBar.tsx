import React, { useState, useEffect, useRef } from 'react';
import { ConstructionProject } from '../types/construction';

interface SearchBarProps {
  projects: ConstructionProject[];
  onSelectProject: (project: ConstructionProject) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ projects, onSelectProject }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ConstructionProject[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.address.toLowerCase().includes(searchTerm) ||
      project.projectType.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm)
    );

    setResults(filtered.slice(0, 5)); // Show max 5 results
    setShowResults(true);
  }, [query, projects]);

  const handleSelect = (project: ConstructionProject) => {
    onSelectProject(project);
    setQuery('');
    setShowResults(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-yellow-500/30 text-yellow-300">{part}</span>
        : part
    );
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
        <span className="material-symbols-outlined text-slate-400">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Search address, project name, or zip code"
          className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800 rounded-xl shadow-2xl overflow-hidden z-[1001] border border-slate-700">
          {results.map((project) => (
            <button
              key={project.id}
              onClick={() => handleSelect(project)}
              className="w-full px-4 py-3 hover:bg-slate-700 transition-colors text-left flex items-start gap-3 border-b border-slate-700 last:border-b-0"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                {project.images[0] ? (
                  <img
                    src={project.images[0].url}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🏗️
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white truncate">
                  {highlightMatch(project.name, query)}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {highlightMatch(project.address, query)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase">
                    {project.projectType}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {project.currentPhase.progress}% complete
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-lg">
                arrow_forward
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800 rounded-xl shadow-2xl p-6 text-center border border-slate-700">
          <span className="material-symbols-outlined text-slate-600 text-4xl mb-2 block">
            search_off
          </span>
          <p className="text-sm text-slate-400">No projects found matching "{query}"</p>
          <p className="text-xs text-slate-500 mt-1">Try searching by address or project name</p>
        </div>
      )}
    </div>
  );
};
