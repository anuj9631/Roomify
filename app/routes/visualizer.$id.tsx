import { Button } from "components/ui/Button";
import { generate3DView } from "lib/ai.action";
import { Box, Download, Share2, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const Visualizer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialImage, intialRender, name } = location.state || {};

  const hasIntialGenerated = useRef(false);

  const [isprocessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    intialRender || null,
  );
  const handleBack = () => navigate("/");

  const runGeneration = async () => {
    if (!initialImage) return;
    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: initialImage });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);
        /// update database
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!initialImage || hasIntialGenerated.current) return;
    if (intialRender) {
      setCurrentImage(intialRender);
      hasIntialGenerated.current = true;
    }
    hasIntialGenerated.current = true;
    runGeneration();
  }, [initialImage, intialRender]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <div className="brand">
          <Box className="logo" />
          <span className="name">Roomify</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" />
          Exit Editor
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{"Untitled Project"}</h2>
              <p className="note">Created by You</p>
            </div>
            <div className="panel-actions">
              <Button
                size="sm"
                onClick={() => {}}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-4" /> Export
              </Button>

              <Button size="sm" onClick={() => {}} className="share">
                <Share2 className="w-4 h-4 mr-4" /> Share
              </Button>
            </div>
          </div>

          <div className={`render-area ${isprocessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="AI Render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {initialImage && (
                  <img
                    src={initialImage}
                    alt="original"
                    className="render-fallback"
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

export default Visualizer;
