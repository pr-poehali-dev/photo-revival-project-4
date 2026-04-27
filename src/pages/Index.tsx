import { useState } from "react";
import Layout from "@/components/Layout";
import UploadPage from "./UploadPage";
import EditorPage, { type SavedProject } from "./EditorPage";
import HistoryPage from "./HistoryPage";
import GalleryPage from "./GalleryPage";

interface Photo {
  id: string;
  name: string;
  url: string;
}

export default function Index() {
  const [activePage, setActivePage] = useState("upload");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [projects, setProjects] = useState<SavedProject[]>([]);

  const handleProjectSave = (project: SavedProject) => {
    setProjects((prev) => [project, ...prev]);
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: "done" as const } : p))
      );
    }, 5000);
  };

  const renderPage = () => {
    switch (activePage) {
      case "upload":
        return (
          <UploadPage
            onPhotoSelect={setSelectedPhoto}
            onNavigate={setActivePage}
          />
        );
      case "editor":
        return (
          <EditorPage
            selectedPhoto={selectedPhoto}
            onNavigate={setActivePage}
            onProjectSave={handleProjectSave}
          />
        );
      case "history":
        return <HistoryPage projects={projects} onNavigate={setActivePage} />;
      case "gallery":
        return <GalleryPage />;
      default:
        return null;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}
