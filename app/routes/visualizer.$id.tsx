import { Button } from "components/ui/Button";
import { generate3DView } from "lib/ai.action";
import { createProject, getProjectById } from "lib/puter.action";
import { Box, Download, RefreshCcw, Share2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const VisualizerId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useOutletContext<AuthContext>();

  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // 🔙 Navigate back
  const handleBack = () => navigate("/");

  // 📥 Export image
  const handleExport = () => {
    if (!currentImage) return;

    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `roomify-${id || "design"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔗 Share image (copy link)
  const handleShare = async () => {
    if (!currentImage) return;

    try {
      await navigator.clipboard.writeText(currentImage);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy link");
    }
  };

  // 🤖 Generate AI Image
  const runGeneration = async (item: DesignItem) => {
    if (!id || !item.sourceImage) return;

    try {
      setIsProcessing(true);

      const result = await generate3DView({
        sourceImage: item.sourceImage,
      });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        const updatedItem = {
          ...item,
          renderedImage: result.renderedImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: item.ownerId ?? userId ?? null,
          isPublic: item.isPublic ?? false,
        };

        const saved = await createProject({
          item: updatedItem,
          visibility: "private",
        });

        if (saved) {
          setProject(saved);
          setCurrentImage(saved?.renderedImage ?? result.renderedImage);
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate 3D view. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 📦 Load Project
  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      if (!id) return;

      setIsProjectLoading(true);

      try {
        const fetchedProject = await getProjectById({ id });

        if (!controller.signal.aborted) {
          setProject(fetchedProject);
          setCurrentImage(fetchedProject?.renderedImage || null);
        }
      } catch (error) {
        console.error("Failed to load project:", error);
      } finally {
        if (!controller.signal.aborted) {
          setIsProjectLoading(false);
        }
      }
    };

    loadProject();

    return () => controller.abort();
  }, [id]);

  // ⚡ Auto Generate if no rendered image
  useEffect(() => {
    if (!project || isProjectLoading) return;

    if (!project.renderedImage && project.sourceImage) {
      runGeneration(project);
    } else {
      setCurrentImage(project.renderedImage || null);
    }
  }, [project, isProjectLoading]);

  // ⏳ Loading UI
  if (isProjectLoading) {
    return <div className="loader">Loading project...</div>;
  }

  return (
    <div className="visualizer">
      {/* 🔝 Topbar */}
      <nav className="topbar">
        <div className="brand">
          <Box className="logo" />
          <span className="name">Roomify</span>
        </div>

        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" /> Exit Editor
        </Button>
      </nav>

      {/* 📦 Main Content */}
      <section className="content">
        {/* 🎨 Render Panel */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className="note">Created by You</p>
            </div>

            <div className="panel-actions">
              <Button
                size="sm"
                onClick={handleExport}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>

              <Button size="sm" onClick={handleShare} className="share">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="AI Render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img
                    src={project.sourceImage}
                    alt="Original"
                    className="render-fallback"
                  />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">
                    Generating your 3D visualization
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔍 Compare Panel */}
        <div className="panel compare">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Comparison</p>
              <h3>Before and After</h3>
            </div>
            <div className="hint">Drag to compare</div>
          </div>

          <div className="compare-stage">
            {project?.sourceImage && currentImage ? (
              <ReactCompareSlider
                defaultValue={50}
                style={{ width: "100%", height: "auto" }}
                itemOne={
                  <ReactCompareSliderImage
                    src={project.sourceImage}
                    alt="before"
                    className="compare-img"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={currentImage}
                    alt="after"
                    className="compare-img"
                  />
                }
              />
            ) : (
              <div className="compare-fallback">
                {project?.sourceImage && (
                  <img
                    src={project.sourceImage}
                    alt="Before"
                    className="compare-img"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisualizerId;
