import Icon from "@/components/ui/icon";
import type { SavedProject } from "./EditorPage";

interface HistoryPageProps {
  projects: SavedProject[];
  onNavigate: (page: string) => void;
}

const statusConfig = {
  queued: { label: "В ОЧЕРЕДИ", color: "var(--neon-orange)", icon: "Clock" },
  processing: { label: "ОБРАБОТКА", color: "var(--neon-cyan)", icon: "Loader" },
  done: { label: "ГОТОВО", color: "var(--neon-green)", icon: "CheckCircle" },
};

const demoProjects: SavedProject[] = [
  {
    id: "demo-1",
    name: "portrait_2024",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    settings: { motionType: "parallax", intensity: 60, duration: 4, fps: 30, loopMode: "loop", faceTracking: true, hairFlow: true, blinkEffect: true, breathEffect: false },
    createdAt: new Date(Date.now() - 3600000),
    status: "done",
  },
  {
    id: "demo-2",
    name: "family_photo",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    settings: { motionType: "3d-tilt", intensity: 45, duration: 5, fps: 60, loopMode: "pingpong", faceTracking: true, hairFlow: false, blinkEffect: true, breathEffect: true },
    createdAt: new Date(Date.now() - 86400000),
    status: "done",
  },
  {
    id: "demo-3",
    name: "vacation_selfie",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    settings: { motionType: "float", intensity: 70, duration: 6, fps: 30, loopMode: "loop", faceTracking: false, hairFlow: true, blinkEffect: false, breathEffect: false },
    createdAt: new Date(Date.now() - 172800000),
    status: "processing",
  },
];

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  return `${days} дн. назад`;
}

export default function HistoryPage({ projects, onNavigate }: HistoryPageProps) {
  const allProjects = [...projects, ...demoProjects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-6 animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(0,255,255,0.3)]" />
        <span className="font-mono-plex text-xs text-[var(--neon-cyan)] opacity-60 tracking-widest uppercase">
          // HISTORY_MODULE
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(0,255,255,0.3)]" />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "ВСЕГО", value: allProjects.length, color: "var(--neon-cyan)" },
          { label: "ГОТОВО", value: allProjects.filter((p) => p.status === "done").length, color: "var(--neon-green)" },
          { label: "В РАБОТЕ", value: allProjects.filter((p) => p.status === "processing").length, color: "var(--neon-orange)" },
        ].map((stat) => (
          <div key={stat.label} className="sci-panel rounded-sm p-4 text-center">
            <div className="font-orbitron text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="font-mono-plex text-xs text-[rgba(0,255,255,0.4)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Project list */}
      <div className="space-y-3">
        {allProjects.map((project) => {
          const status = statusConfig[project.status];
          return (
            <div key={project.id} className="sci-panel rounded-sm p-4 flex items-center gap-4 group hover:border-[rgba(0,255,255,0.4)] transition-all">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 border border-[rgba(0,255,255,0.15)]">
                <img
                  src={project.photoUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-orbitron text-sm text-[var(--neon-cyan)] truncate">{project.name}</span>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xs font-mono-plex flex-shrink-0"
                    style={{ borderColor: status.color, color: status.color }}
                  >
                    <Icon name={status.icon} size={10} className={project.status === "processing" ? "animate-rotate-slow" : ""} />
                    {status.label}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono-plex text-[rgba(0,255,255,0.35)]">
                  <span>{project.settings.motionType.toUpperCase()}</span>
                  <span>//</span>
                  <span>{project.settings.fps} FPS</span>
                  <span>//</span>
                  <span>{project.settings.duration}s</span>
                  <span>//</span>
                  <span>{formatDate(new Date(project.createdAt))}</span>
                </div>
                {/* Effects badges */}
                <div className="flex gap-1 mt-2">
                  {project.settings.faceTracking && <span className="px-1.5 py-0.5 border border-[rgba(0,255,255,0.2)] font-mono-plex text-xs text-[rgba(0,255,255,0.4)] rounded-sm">FACE</span>}
                  {project.settings.hairFlow && <span className="px-1.5 py-0.5 border border-[rgba(0,255,255,0.2)] font-mono-plex text-xs text-[rgba(0,255,255,0.4)] rounded-sm">HAIR</span>}
                  {project.settings.blinkEffect && <span className="px-1.5 py-0.5 border border-[rgba(0,255,255,0.2)] font-mono-plex text-xs text-[rgba(0,255,255,0.4)] rounded-sm">BLINK</span>}
                  {project.settings.breathEffect && <span className="px-1.5 py-0.5 border border-[rgba(0,255,255,0.2)] font-mono-plex text-xs text-[rgba(0,255,255,0.4)] rounded-sm">BREATH</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {project.status === "done" && (
                  <>
                    <button
                      onClick={() => onNavigate("gallery")}
                      className="neon-btn-cyan px-3 py-1.5 font-mono-plex text-xs rounded-sm flex items-center gap-1"
                    >
                      <Icon name="Play" size={12} />
                      СМОТРЕТЬ
                    </button>
                    <button className="border border-[rgba(0,255,255,0.2)] text-[rgba(0,255,255,0.5)] px-3 py-1.5 font-mono-plex text-xs rounded-sm flex items-center gap-1 hover:border-[var(--neon-cyan)] transition-all">
                      <Icon name="Download" size={12} />
                    </button>
                  </>
                )}
                {project.status === "processing" && (
                  <div className="flex items-center gap-2 font-mono-plex text-xs text-[var(--neon-cyan)]">
                    <div className="w-3 h-3 border border-[var(--neon-cyan)] border-t-transparent rounded-full animate-rotate-slow" />
                    РЕНДЕР...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allProjects.length === 0 && (
        <div className="text-center py-16">
          <Icon name="FolderOpen" size={40} className="text-[rgba(0,255,255,0.15)] mx-auto mb-3" />
          <p className="font-mono-plex text-xs text-[rgba(0,255,255,0.2)] uppercase tracking-widest">
            // ИСТОРИЯ ПУСТА //
          </p>
        </div>
      )}
    </div>
  );
}
