import React, { useState } from 'react';
import { ConstructionProject } from '../types/construction';
import { PhotoUpload } from './PhotoUpload';
import { Comments } from './Comments';
import { FavoriteButton } from './Favorites';

interface ProjectDetailsProps {
  project: ConstructionProject;
  onClose: () => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [beforeAfterSlider, setBeforeAfterSlider] = useState(50);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(project.isFollowing || false);

  const getPhaseColor = (status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'active') return 'bg-yellow-500';
    return 'bg-slate-600';
  };

  const getPhaseTextColor = (status: string) => {
    if (status === 'completed') return 'text-green-400';
    if (status === 'active') return 'text-yellow-400';
    return 'text-slate-500';
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // In production, save to backend
    alert(isFollowing ? 'Unfollowed project' : 'Following project! You\'ll get notifications for updates.');
  };

  const handlePhotoUpload = (photoUrl: string) => {
    // In production, add to project.images
    console.log('Photo uploaded:', photoUrl);
  };

  const handleAddComment = (text: string) => {
    // In production, save to backend
    console.log('New comment:', text);
    alert('Comment posted! (Demo mode)');
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-bold text-sm">Project Details</h2>
        <div className="flex items-center gap-2">
          <FavoriteButton projectId={project.id} size="sm" />
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 bg-slate-800">
        {!showBeforeAfter ? (
          <img
            src={project.images[activeImageIndex]?.url || 'https://via.placeholder.com/800x400?text=Construction+Site'}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={project.afterImage || 'https://via.placeholder.com/800x400?text=After'}
              alt="After"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - beforeAfterSlider}% 0 0)` }}
            >
              <img
                src={project.beforeImage || 'https://via.placeholder.com/800x400?text=Before'}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={beforeAfterSlider}
              onChange={(e) => setBeforeAfterSlider(Number(e.target.value))}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
                BEFORE
              </span>
            </div>
            <div className="absolute bottom-4 right-4">
              <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
                AFTER
              </span>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold">
            {project.status}
          </span>
        </div>

        <button
          className="absolute top-4 right-4 w-10 h-10 bg-slate-800/70 backdrop-blur rounded-full flex items-center justify-center hover:bg-slate-700/70 transition-colors"
          onClick={() => setShowBeforeAfter(!showBeforeAfter)}
        >
          <span className="material-symbols-outlined text-white">compare</span>
        </button>

        {!showBeforeAfter && project.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {project.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeImageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Title & Address */}
        <div>
          <h1 className="text-2xl font-black mb-1">{project.name}</h1>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">location_on</span>
            {project.address}
          </p>
        </div>

        {/* Current Phase Progress */}
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold">CURRENT PHASE</h3>
            <span className="text-primary text-lg font-black">
              {project.currentPhase.progress}% Complete
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            {project.phases.map((phase, index) => (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full ${getPhaseColor(phase.status)} flex items-center justify-center text-xs font-bold ${
                      phase.status === 'active' ? 'ring-4 ring-yellow-500/30' : ''
                    }`}
                  >
                    {phase.status === 'completed' ? (
                      <span className="material-symbols-outlined text-white text-lg">check</span>
                    ) : phase.status === 'active' ? (
                      <span className="text-white">{phase.progress}%</span>
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold mt-1 ${getPhaseTextColor(phase.status)} uppercase`}>
                    {phase.label}
                  </span>
                </div>
                {index < project.phases.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${phase.status === 'completed' ? 'bg-green-500' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Official Data */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-blue-400">verified</span>
            <h3 className="text-sm font-bold">Official Data</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">PERMIT NUMBER</p>
              <p className="font-bold text-sm">{project.permitNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">EST. VALUE</p>
              <p className="font-bold text-sm">${(project.value / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">CONTRACTOR</p>
              <p className="font-bold text-sm">{project.contractor}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">TARGET DATE</p>
              <p className="font-bold text-sm">
                {new Date(project.estimatedCompletion).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={handleFollow}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border ${
              isFollowing 
                ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' 
                : 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
            }`}
          >
            <span className="material-symbols-outlined">
              {isFollowing ? 'notifications_active' : 'notifications'}
            </span>
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button 
            onClick={() => setShowPhotoUpload(true)}
            className="flex-1 py-3 bg-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">add_photo_alternate</span>
            Post Update
          </button>
        </div>

        {/* Recent Photos */}
        {project.images.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3">Recent Progress Photos</h3>
            <div className="grid grid-cols-2 gap-2">
              {project.images.slice(0, 4).map((image, index) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg overflow-hidden bg-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={image.url} alt={image.caption} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Toggle */}
        <div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            Community Comments ({project.updates.length})
            <span className="material-symbols-outlined">
              {showComments ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <Comments
            projectId={project.id}
            comments={project.updates.map(u => ({
              id: u.id,
              username: u.username,
              text: u.text,
              timestamp: u.timestamp,
              likes: u.likes
            }))}
            onAddComment={handleAddComment}
          />
        )}
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <PhotoUpload
          projectId={project.id}
          onUploadComplete={handlePhotoUpload}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}
    </div>
  );
};
