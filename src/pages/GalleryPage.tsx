import { useState } from "react";
import Icon from "@/components/ui/icon";

interface GalleryItem {
  id: string;
  title: string;
  thumb: string;
  duration: string;
  motionType: string;
  fps: number;
  date: string;
  views: number;
}

const demoItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Portrait_2024",
    thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    duration: "4s",
    motionType: "Параллакс",
    fps: 30,
    date: "27.04.2026",
    views: 142,
  },
  {
    id: "g2",
    title: "Family_Photo",
    thumb: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    duration: "5s",
    motionType: "3D наклон",
    fps: 60,
    date: "26.04.2026",
    views: 89,
  },
  {
    id: "g3",
    title: "Classic_Portrait",
    thumb: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    duration: "6s",
    motionType: "Левитация",
    fps: 30,
    date: "25.04.2026",
    views: 210,
  },
  {
    id: "g4",
    title: "Studio_Shot",
    thumb: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&q=80",
    duration: "3s",
    motionType: "Зум-ин",
    fps: 60,
    date: "24.04.2026",
    views: 67,
  },
  {
    id: "g5",
    title: "Outdoor_Adventure",
    thumb: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    duration: "8s",
    motionType: "Покачивание",
    fps: 30,
    date: "23.04.2026",
    views: 334,
  },
  {
    id: "g6",
    title: "Vintage_Photo",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    duration: "5s",
    motionType: "Параллакс",
    fps: 24,
    date: "22.04.2026",
    views: 178,
  },
];

type FilterMode = "all" | "recent" | "popular";

export default function GalleryPage() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = [...demoItems].sort((a, b) => {
    if (filter === "popular") return b.views - a.views;
    if (filter === "recent") return b.id.localeCompare(a.id);
    return 0;
  });

  return (
    <div className="p-6 animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(0,255,255,0.3)]" />
        <span className="font-mono-plex text-xs text-[var(--neon-cyan)] opacity-60 tracking-widest uppercase">
          // GALLERY_MODULE
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(0,255,255,0.3)]" />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {([
          { id: "all", label: "ВСЕ", icon: "Grid3X3" },
          { id: "recent", label: "НОВЫЕ", icon: "Clock" },
          { id: "popular", label: "ПОПУЛЯРНЫЕ", icon: "TrendingUp" },
        ] as { id: FilterMode; label: string; icon: string }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 font-mono-plex text-xs rounded-sm border flex items-center gap-2 transition-all ${
              filter === tab.id
                ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,255,255,0.1)]"
                : "border-[rgba(0,255,255,0.15)] text-[rgba(0,255,255,0.4)] hover:border-[rgba(0,255,255,0.4)]"
            }`}
          >
            <Icon name={tab.icon} size={12} />
            {tab.label}
          </button>
        ))}
        <span className="ml-auto font-mono-plex text-xs text-[rgba(0,255,255,0.3)]">
          {filtered.length} видео
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="sci-panel rounded-sm overflow-hidden cursor-pointer group hover:border-[rgba(0,255,255,0.5)] transition-all duration-300"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedItem(item)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.thumb}
                alt={item.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  hoveredId === item.id ? "scale-110" : "scale-100"
                }`}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-transparent to-transparent" />
              
              {/* Play button */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                hoveredId === item.id ? "opacity-100" : "opacity-0"
              }`}>
                <div className="w-12 h-12 border-2 border-[var(--neon-cyan)] rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
                  <Icon name="Play" size={20} className="text-[var(--neon-cyan)] ml-1" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[rgba(0,0,0,0.7)] border border-[rgba(0,255,255,0.3)] rounded-sm">
                <span className="font-mono-plex text-xs text-[var(--neon-cyan)]">{item.duration}</span>
              </div>

              {/* Live animation indicator */}
              {hoveredId === item.id && (
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--neon-magenta)] animate-pulse-neon" />
                  <span className="font-mono-plex text-xs text-[var(--neon-magenta)]">ANIMATED</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-orbitron text-sm text-[var(--neon-cyan)] truncate">{item.title}</span>
                <div className="flex items-center gap-1 text-[rgba(0,255,255,0.4)] font-mono-plex text-xs flex-shrink-0">
                  <Icon name="Eye" size={10} />
                  {item.views}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono-plex text-[rgba(0,255,255,0.3)]">
                <span>{item.motionType}</span>
                <span>//</span>
                <span>{item.fps} FPS</span>
                <span className="ml-auto">{item.date}</span>
              </div>
            </div>

            {/* Bottom actions */}
            <div className={`px-3 pb-3 flex gap-2 transition-all duration-300 ${
              hoveredId === item.id ? "opacity-100 max-h-12" : "opacity-0 max-h-0 overflow-hidden"
            }`}>
              <button className="flex-1 neon-btn-cyan py-1.5 font-mono-plex text-xs rounded-sm flex items-center justify-center gap-1">
                <Icon name="Download" size={11} />
                MP4
              </button>
              <button className="flex-1 border border-[rgba(0,255,255,0.2)] text-[rgba(0,255,255,0.5)] py-1.5 font-mono-plex text-xs rounded-sm flex items-center justify-center gap-1 hover:border-[var(--neon-cyan)] transition-all">
                <Icon name="Share2" size={11} />
                Поделиться
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.9)]"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="sci-panel rounded-sm w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <img
                src={selectedItem.thumb}
                alt={selectedItem.title}
                className="w-full h-full object-cover animate-pulse-neon"
                style={{ animation: "zoom-preview 4s ease-in-out infinite alternate" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-[var(--neon-cyan)] rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
                  <Icon name="Play" size={28} className="text-[var(--neon-cyan)] ml-1" />
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 border border-[var(--neon-magenta)] rounded-sm flex items-center justify-center text-[var(--neon-magenta)] hover:bg-[rgba(255,0,255,0.1)] transition-all"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-orbitron text-[var(--neon-cyan)]">{selectedItem.title}</span>
                <div className="flex gap-2">
                  <button className="neon-btn-solid px-4 py-2 font-mono-plex text-xs rounded-sm flex items-center gap-2">
                    <Icon name="Download" size={13} />
                    СКАЧАТЬ MP4
                  </button>
                  <button className="neon-btn-magenta px-4 py-2 font-mono-plex text-xs rounded-sm flex items-center gap-2">
                    <Icon name="Share2" size={13} />
                    ПОДЕЛИТЬСЯ
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs font-mono-plex text-[rgba(0,255,255,0.35)]">
                <span>ДВИЖЕНИЕ: {selectedItem.motionType}</span>
                <span>FPS: {selectedItem.fps}</span>
                <span>ДЛИНА: {selectedItem.duration}</span>
                <span className="ml-auto flex items-center gap-1"><Icon name="Eye" size={11} /> {selectedItem.views} просмотров</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
