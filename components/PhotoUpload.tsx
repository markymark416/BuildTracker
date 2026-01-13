import React, { useState, useRef } from 'react';

interface PhotoUploadProps {
  projectId: string;
  onUploadComplete: (photoUrl: string) => void;
  onClose: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ projectId, onUploadComplete, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setUseCamera(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Could not access camera. Please use file upload instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setPreview(canvas.toDataURL());
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    // In a real app, you'd upload to Vercel Blob Storage or similar
    // For now, we'll simulate an upload and use a placeholder
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, you'd do:
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // formData.append('projectId', projectId);
      // formData.append('caption', caption);
      // const response = await fetch('/api/upload-photo', { method: 'POST', body: formData });
      // const data = await response.json();
      // onUploadComplete(data.url);
      
      // For demo, use the preview URL
      onUploadComplete(preview || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop');
      alert('Photo uploaded successfully! (Demo mode - in production this would save to storage)');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[2000] flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Upload Progress Photo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Camera/Upload Toggle */}
          {!preview && (
            <div className="flex gap-3">
              <button
                onClick={startCamera}
                className="flex-1 py-4 bg-primary/20 text-primary border-2 border-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/30 transition-colors"
              >
                <span className="material-symbols-outlined">photo_camera</span>
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-4 bg-slate-800 text-white border-2 border-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined">upload_file</span>
                Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Camera View */}
          {useCamera && (
            <div className="relative rounded-xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video object-cover"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform"
                />
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-slate-800/80 text-white rounded-full font-bold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full aspect-video object-cover"
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Caption (optional)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's happening at this project?"
                  className="w-full bg-slate-800 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-slate-500 mt-1">{caption.length}/200</p>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">upload</span>
                    Upload Photo
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tips */}
          {!preview && !useCamera && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="font-bold text-white text-sm mb-2">📸 Photo Tips</h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Show clear construction progress</li>
                <li>• Take photos from the same angle for consistency</li>
                <li>• Include landmarks or context</li>
                <li>• Photos help the community track progress!</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
