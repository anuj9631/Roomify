import React, { useState } from "react";
import { useOutletContext } from "react-router";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isSignedIn } = useOutletContext<AuthContext>();

  return (
    <div className="upload">
      {!file ? (
        <div className={`dropzone ${isDragging ? "is-dragging" : ""}`}>
          <input
            type="file"
            className="drop-input"
            accept=".jpg,.jpeg, .png"
            disabled={!isSignedIn}
          />
        </div>
      ) : (
        <div>FILE</div>
      )}
      <h1></h1>
    </div>
  );
};

export default Upload;
