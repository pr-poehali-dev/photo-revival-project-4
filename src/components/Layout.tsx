import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "upload", label: "Загрузка фото", icon: "Upload" },
  { id: "editor", label: "Редактор", icon: "Wand2" },
  { id: "history", label: "История", icon: "Clock" },
  { id: "gallery", label: "Галерея", icon: "Play" },
];

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--dark-bg)" }}>
      <header className="sci-panel border-b border-t-0 border-l-0 border-r-0 px-6 py-3 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] rounded-sm rotate-45 animate-pulse-neon" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-[var(--neon-cyan)] rounded-sm opacity-80" />
            </div>
          </div>
          <span className="font-orbitron text-lg font-bold neon-text-cyan tracking-widest uppercase">
            AnimaFlow
          </span>
          <span className="font-mono-plex text-xs text-[var(--neon-cyan)] opacity-40 ml-1 animate-blink">▮</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item px-4 py-2 font-mono-plex text-xs uppercase tracking-wider flex items-center gap-2 rounded-sm ${
                activePage === item.id ? "active text-[var(--neon-cyan)]" : "text-[rgba(180,255,255,0.5)] hover:text-[var(--neon-cyan)]"
              }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 font-mono-plex text-xs text-[var(--neon-cyan)] opacity-50">
          <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse-neon" />
          ONLINE
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>

      <footer className="sci-panel border-t border-b-0 border-l-0 border-r-0 px-6 py-2 flex items-center justify-between">
        <span className="font-mono-plex text-xs text-[rgba(0,255,255,0.3)]">
          SYS_VER 2.4.1 // ANIMAFLOW NEURAL ENGINE
        </span>
        <span className="font-mono-plex text-xs text-[rgba(0,255,255,0.3)]">
          GPU: READY // MEM: 8.2GB // STATUS: IDLE
        </span>
      </footer>
    </div>
  );
}
