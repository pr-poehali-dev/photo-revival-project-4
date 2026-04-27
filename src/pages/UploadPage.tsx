import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

interface UploadedPhoto {
  id: string;
  name: string;
  url: string;
  size: string;
  selected: boolean;
}

interface UploadPageProps {
  onPhotoSelect: (photo: UploadedPhoto) => void;
  onNavigate: (page: string) => void;
}

export default function UploadPage({ onPhotoSelect, onNavigate }: UploadPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFiles = useCallback((files: FileList) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    Array.from(files).forEach((file) => {
      if (!allowed.includes(file.type)) return;
      const url = URL.createObjectURL(file);
      const photo: UploadedPhoto = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        url,
        size: formatSize(file.size),
        selected: false,
      };
      setPhotos((prev) => [photo, ...prev]);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleSelect = (photo: UploadedPhoto) => {
    setSelectedId(photo.id);
    setPhotos((prev) => prev.map((p) => ({ ...p, selected: p.id === photo.id })));
  };

  const handleEdit = () => {
    const photo = photos.find((p) => p.id === selectedId);
    if (photo) {
      onPhotoSelect(photo);
      onNavigate("editor");
    }
  };

  const handleRemove = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="p-6 animate-fade-in-up">
      {/* Hero banner */}
      {photos.length === 0 && (
        <div className="relative rounded-sm overflow-hidden mb-8 h-48 border border-[rgba(0,255,255,0.15)]">
          <img
            src="https://cdn.poehali.dev/projects/355dc8a0-938d-4232-bcb3-7d1d474fb4e4/files/85c60d08-cd6b-4084-8dea-a359625fd6d2.jpg"
            alt="AnimaFlow"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--dark-bg)] via-transparent to-[var(--dark-bg)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="font-orbitron text-2xl font-bold neon-text-cyan tracking-widest uppercase animate-glitch">
              AnimaFlow
            </h1>
            <p className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] mt-2 tracking-wider">
              НЕЙРОСЕТЕВОЕ ОЖИВЛЕНИЕ ФОТОГРАФИЙ // NEURAL PHOTO ANIMATION ENGINE
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(0,255,255,0.3)]" />
        <span className="font-mono-plex text-xs text-[var(--neon-cyan)] opacity-60 tracking-widest uppercase">
          // UPLOAD_MODULE
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(0,255,255,0.3)]" />
      </div>

      {/* Dropzone */}
      <div
        className={`dropzone rounded-sm p-12 text-center cursor-pointer mb-8 relative overflow-hidden ${isDragging ? "active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-[rgba(0,255,255,0.05)] z-0" />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border border-[var(--neon-cyan)] rounded-sm flex items-center justify-center animate-pulse-neon">
            <Icon name="Upload" size={28} className="text-[var(--neon-cyan)]" />
          </div>
          <div>
            <p className="font-orbitron text-[var(--neon-cyan)] text-sm tracking-wider mb-1">
              ПЕРЕТАЩИТЕ ФОТО СЮДА
            </p>
            <p className="font-mono-plex text-xs text-[rgba(0,255,255,0.4)]">
              или кликните для выбора файлов // JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </div>

      {/* Photos grid */}
      {photos.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] uppercase tracking-wider">
              ЗАГРУЖЕНО: {photos.length} файл(ов)
            </span>
            {selectedId && (
              <button
                onClick={handleEdit}
                className="neon-btn-solid px-5 py-2 font-orbitron text-xs tracking-wider rounded-sm flex items-center gap-2"
              >
                <Icon name="Wand2" size={14} />
                ОЖИВИТЬ ФОТО
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => handleSelect(photo)}
                className={`sci-panel rounded-sm overflow-hidden cursor-pointer relative group transition-all duration-200 ${
                  photo.id === selectedId ? "neon-border-cyan ring-1 ring-[var(--neon-cyan)]" : ""
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2">
                  <p className="font-mono-plex text-xs text-[rgba(0,255,255,0.7)] truncate">{photo.name}</p>
                  <p className="font-mono-plex text-xs text-[rgba(0,255,255,0.3)]">{photo.size}</p>
                </div>
                {photo.id === selectedId && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--neon-cyan)] rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} className="text-black" />
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(photo.id); }}
                  className="absolute top-2 left-2 w-5 h-5 bg-[rgba(0,0,0,0.7)] border border-[var(--neon-magenta)] rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="X" size={10} className="text-[var(--neon-magenta)]" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {photos.length === 0 && (
        <div className="text-center py-8">
          <p className="font-mono-plex text-xs text-[rgba(0,255,255,0.2)] uppercase tracking-widest">
            // NO_FILES_LOADED //
          </p>
        </div>
      )}
    </div>
  );
}