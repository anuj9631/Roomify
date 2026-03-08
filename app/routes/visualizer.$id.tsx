import React from "react";
import { useLocation } from "react-router";

const Visualizer = () => {
  const location = useLocation();
  const { initialImage, name } = location.state || {};

  return <div>Visualizer id</div>;
};

export default Visualizer;
