import React, { useState } from "react";
import { useOutletContext } from "react-router";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isSignedIn } = useOutletContext<AuthContext>();

  return(
  <div className="upload">{
    !file ? (
      <div className={`dropzone ${isDragging ? 'isdragging' : ''}`}>
        <input />
        </div>
    ) :(
      <div>FILE</div>
    )
  }</div>;
)};

export default Upload;
