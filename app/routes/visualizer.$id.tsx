import { Button } from "components/ui/Button";
import { generate3DView } from "lib/ai.action";
import { Box, X } from "lucide-react";
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
    </div>
  );
};

export default Visualizer;
