import { generate3DView } from "lib/ai.action";
import React, { useRef, useState } from "react";
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
    } catch (error) {}
  };

  return (
    <section>
      <h1>{name || "Untitled Project"}</h1>
      <div className="visualizer">
        {initialImage && (
          <div className="image-container">
            <h2>Source Image</h2>
            <img src={initialImage} alt="source" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Visualizer;
