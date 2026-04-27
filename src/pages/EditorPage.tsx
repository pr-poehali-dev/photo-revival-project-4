import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface Photo {
  id: string;
  name: string;
  url: string;
}

interface EditorPageProps {
  selectedPhoto: Photo | null;
  onNavigate: (page: string) => void;
  onProjectSave: (project: SavedProject) => void;
}

export interface SavedProject {
  id: string;
  name: string;
  photoUrl: string;
  settings: AnimSettings;
  createdAt: Date;
  status: "processing" | "done" | "queued";
}

interface AnimSettings {
  motionType: string;
  intensity: number;
  duration: number;
  fps: number;
  loopMode: string;
  faceTracking: boolean;
  hairFlow: boolean;
  blinkEffect: boolean;
  breathEffect: boolean;
}

const defaultSettings: AnimSettings = {
  motionType: "parallax",
  intensity: 50,
  duration: 4,
  fps: 30,
  loopMode: "loop",
  faceTracking: true,
  hairFlow: true,
  blinkEffect: true,
  breathEffect: false,
};

const motionTypes = [
  { id: "parallax", label: "Параллакс" },
  { id: "3d-tilt", label: "3D наклон" },
  { id: "zoom-in", label: "Зум-ин" },
  { id: "zoom-out", label: "Зум-аут" },
  { id: "sway", label: "Покачивание" },
  { id: "float", label: "Левитация" },
];

export default function EditorPage({ selectedPhoto, onNavigate, onProjectSave }: EditorPageProps) {
  const [settings, setSettings] = useState<AnimSettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewMode) {
      const classes: Record<string, string> = {
        parallax: "animate-parallax-preview",
        "3d-tilt": "animate-tilt-preview",
        "zoom-in": "animate-zoom-in-preview",
        "zoom-out": "animate-zoom-out-preview",
        sway: "animate-sway-preview",
        float: "animate-float-preview",
      };
      setAnimClass(classes[settings.motionType] || "");
    } else {
      setAnimClass("");
    }
  }, [previewMode, settings.motionType]);

  const handleProcess = () => {
    if (!selectedPhoto) return;
    setIsProcessing(true);
    setTimeout(() => {
      const project: SavedProject = {
        id: `proj-${Date.now()}`,
        name: selectedPhoto.name.replace(/\.[^.]+$/, ""),
        photoUrl: selectedPhoto.url,
        settings,
        createdAt: new Date(),
        status: "processing",
      };
      onProjectSave(project);
      setIsProcessing(false);
      onNavigate("history");
    }, 2000);
  };

  const sliderStyle = (val: number, max: number) => ({
    background: `linear-gradient(90deg, var(--neon-cyan) ${(val / max) * 100}%, rgba(0,255,255,0.1) ${(val / max) * 100}%)`,
  });

  if (!selectedPhoto) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in-up">
        <div className="w-20 h-20 border border-[rgba(0,255,255,0.3)] rounded-sm flex items-center justify-center">
          <Icon name="ImageOff" size={32} className="text-[rgba(0,255,255,0.3)]" />
        </div>
        <p className="font-mono-plex text-sm text-[rgba(0,255,255,0.4)] uppercase tracking-wider text-center">
          // ФОТО НЕ ВЫБРАНО //<br />
          <span className="text-[rgba(0,255,255,0.2)]">Сначала загрузите фото в разделе «Загрузка»</span>
        </p>
        <button
          onClick={() => onNavigate("upload")}
          className="neon-btn-cyan px-6 py-2 font-orbitron text-xs tracking-wider rounded-sm"
        >
          ЗАГРУЗИТЬ ФОТО
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(0,255,255,0.3)]" />
        <span className="font-mono-plex text-xs text-[var(--neon-cyan)] opacity-60 tracking-widest uppercase">
          // EDITOR_MODULE
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(0,255,255,0.3)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview panel */}
        <div className="sci-panel rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-plex text-xs text-[rgba(0,255,255,0.6)] uppercase tracking-wider">
              PREVIEW // {settings.motionType.toUpperCase()}
            </span>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1 font-mono-plex text-xs rounded-sm border transition-all ${
                previewMode
                  ? "border-[var(--neon-magenta)] text-[var(--neon-magenta)] bg-[rgba(255,0,255,0.1)]"
                  : "border-[var(--neon-cyan)] text-[var(--neon-cyan)]"
              }`}
            >
              {previewMode ? (
                <span className="flex items-center gap-1"><Icon name="Square" size={10} /> СТОП</span>
              ) : (
                <span className="flex items-center gap-1"><Icon name="Play" size={10} /> ПРЕВЬЮ</span>
              )}
            </button>
          </div>

          <div
            ref={previewRef}
            className="relative overflow-hidden rounded-sm aspect-square bg-[var(--dark-bg)]"
            style={{ perspective: "800px" }}
          >
            <img
              src={selectedPhoto.url}
              alt="preview"
              className={`w-full h-full object-cover transition-all duration-500 ${
                previewMode ? getPreviewStyle(settings.motionType) : ""
              }`}
              style={previewMode ? getInlineStyle(settings.motionType, settings.intensity) : {}}
            />
            {previewMode && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--neon-magenta)] animate-pulse-neon" />
                  <span className="font-mono-plex text-xs text-[var(--neon-magenta)]">LIVE</span>
                </div>
              </div>
            )}
            {!previewMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Play" size={40} className="text-[rgba(0,255,255,0.2)] mx-auto mb-2" />
                  <p className="font-mono-plex text-xs text-[rgba(0,255,255,0.3)]">Нажмите ПРЕВЬЮ</p>
                </div>
              </div>
            )}
          </div>

          {/* Render specs */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "FPS", value: settings.fps },
              { label: "DUR", value: `${settings.duration}s` },
              { label: "INT", value: `${settings.intensity}%` },
            ].map((spec) => (
              <div key={spec.label} className="border border-[rgba(0,255,255,0.15)] rounded-sm p-2 text-center">
                <div className="font-mono-plex text-xs text-[rgba(0,255,255,0.4)]">{spec.label}</div>
                <div className="font-orbitron text-sm text-[var(--neon-cyan)]">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls panel */}
        <div className="sci-panel rounded-sm p-4 flex flex-col gap-4">
          <span className="font-mono-plex text-xs text-[rgba(0,255,255,0.6)] uppercase tracking-wider">
            ПАРАМЕТРЫ АНИМАЦИИ
          </span>

          {/* Motion type */}
          <div>
            <label className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] uppercase tracking-wider mb-2 block">
              ТИП ДВИЖЕНИЯ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {motionTypes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSettings((s) => ({ ...s, motionType: m.id }))}
                  className={`py-2 px-2 font-mono-plex text-xs rounded-sm border transition-all ${
                    settings.motionType === m.id
                      ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,255,255,0.1)]"
                      : "border-[rgba(0,255,255,0.15)] text-[rgba(0,255,255,0.4)] hover:border-[rgba(0,255,255,0.4)]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div>
            <label className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] uppercase tracking-wider mb-2 flex justify-between">
              <span>ИНТЕНСИВНОСТЬ</span>
              <span className="text-[var(--neon-cyan)]">{settings.intensity}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={settings.intensity}
              onChange={(e) => setSettings((s) => ({ ...s, intensity: +e.target.value }))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={sliderStyle(settings.intensity, 100)}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] uppercase tracking-wider mb-2 flex justify-between">
              <span>ДЛИТЕЛЬНОСТЬ</span>
              <span className="text-[var(--neon-cyan)]">{settings.duration}s</span>
            </label>
            <input
              type="range"
              min={1}
              max={15}
              value={settings.duration}
              onChange={(e) => setSettings((s) => ({ ...s, duration: +e.target.value }))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={sliderStyle(settings.duration, 15)}
            />
          </div>

          {/* FPS */}
          <div>
            <label className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] uppercase tracking-wider mb-2 block">
              КАЧЕСТВО FPS
            </label>
            <div className="flex gap-2">
              {[24, 30, 60].map((fps) => (
                <button
                  key={fps}
                  onClick={() => setSettings((s) => ({ ...s, fps }))}
                  className={`flex-1 py-2 font-orbitron text-xs rounded-sm border transition-all ${
                    settings.fps === fps
                      ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,255,255,0.1)]"
                      : "border-[rgba(0,255,255,0.15)] text-[rgba(0,255,255,0.4)]"
                  }`}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>

          {/* Effects toggles */}
          <div>
            <label className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] uppercase tracking-wider mb-2 block">
              ЭФФЕКТЫ
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "faceTracking", label: "Лицо" },
                { key: "hairFlow", label: "Волосы" },
                { key: "blinkEffect", label: "Моргание" },
                { key: "breathEffect", label: "Дыхание" },
              ].map((effect) => (
                <button
                  key={effect.key}
                  onClick={() =>
                    setSettings((s) => ({
                      ...s,
                      [effect.key]: !s[effect.key as keyof AnimSettings],
                    }))
                  }
                  className={`py-2 px-3 font-mono-plex text-xs rounded-sm border flex items-center gap-2 transition-all ${
                    settings[effect.key as keyof AnimSettings]
                      ? "border-[var(--neon-green)] text-[var(--neon-green)] bg-[rgba(0,255,136,0.1)]"
                      : "border-[rgba(0,255,255,0.15)] text-[rgba(0,255,255,0.3)]"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      settings[effect.key as keyof AnimSettings]
                        ? "bg-[var(--neon-green)]"
                        : "bg-[rgba(0,255,255,0.2)]"
                    }`}
                  />
                  {effect.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loop mode */}
          <div>
            <label className="font-mono-plex text-xs text-[rgba(0,255,255,0.5)] uppercase tracking-wider mb-2 block">
              ПЕТЛЯ
            </label>
            <div className="flex gap-2">
              {[
                { id: "loop", label: "Зацикл." },
                { id: "pingpong", label: "Туда-обратно" },
                { id: "once", label: "Один раз" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSettings((s) => ({ ...s, loopMode: mode.id }))}
                  className={`flex-1 py-2 font-mono-plex text-xs rounded-sm border transition-all ${
                    settings.loopMode === mode.id
                      ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,255,255,0.1)]"
                      : "border-[rgba(0,255,255,0.15)] text-[rgba(0,255,255,0.4)]"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Process button */}
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="neon-btn-solid py-3 font-orbitron text-sm tracking-widest rounded-sm flex items-center justify-center gap-3 mt-auto disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border border-[var(--neon-cyan)] border-t-transparent rounded-full animate-rotate-slow" />
                ОБРАБОТКА...
              </>
            ) : (
              <>
                <Icon name="Zap" size={16} />
                ЗАПУСТИТЬ ОЖИВЛЕНИЕ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function getPreviewStyle(motionType: string): string {
  const styles: Record<string, string> = {
    parallax: "scale-110",
    "3d-tilt": "",
    "zoom-in": "scale-125",
    "zoom-out": "scale-95",
    sway: "",
    float: "",
  };
  return styles[motionType] || "";
}

function getInlineStyle(motionType: string, intensity: number): React.CSSProperties {
  const factor = intensity / 100;
  const styles: Record<string, React.CSSProperties> = {
    parallax: {
      animation: `parallax-preview ${3 / factor}s ease-in-out infinite alternate`,
      transform: `scale(${1 + 0.1 * factor})`,
    },
    "3d-tilt": {
      animation: `tilt-preview ${4 / factor}s ease-in-out infinite alternate`,
    },
    "zoom-in": {
      animation: `zoom-preview ${3 / factor}s ease-in-out infinite alternate`,
    },
    "zoom-out": {
      animation: `zoom-out-preview ${3 / factor}s ease-in-out infinite alternate`,
    },
    sway: {
      animation: `sway-preview ${2 / factor}s ease-in-out infinite alternate`,
    },
    float: {
      animation: `float-preview ${3 / factor}s ease-in-out infinite alternate`,
    },
  };
  return styles[motionType] || {};
}
