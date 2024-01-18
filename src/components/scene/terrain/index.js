import React, { useRef, useState, useLayoutEffect } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { noise } from "./perlin";

const Terrain = (props) => {
  const mesh = useRef();
  const [terrainMaterial, setTerrainMaterial] = useState();

  const terrainGeometry = new THREE.PlaneGeometry(25, 25, 75, 75);

  useLayoutEffect(() => {
    noise.seed(props.seed);
    let pos = terrainGeometry.getAttribute("position");
    let pa = pos.array;
    const hVerts = terrainGeometry.parameters.heightSegments + 1;
    const wVerts = terrainGeometry.parameters.widthSegments + 1;
  
    // Define a function to map height to color in the rainbow
    const mapHeightToRainbowColor = (height) => {
      // Modify this function to adjust the color mapping as needed
      const hue = (1 - height) / (height + 1); // Map height to hue (0 to 1)
      const rgb = new THREE.Color().setHSL(hue, 1, 0.45).toArray(); // Convert hue to RGB
      return rgb;
    };
  
    for (let j = 0; j < hVerts; j++) {
      for (let i = 0; i < wVerts; i++) {
        const ex = 1.25;
        const height = (noise.simplex2(i / 100, j / 100) +
          noise.simplex2((i + 200) / 50, j / 50) * Math.pow(ex, 1) +
          noise.simplex2((i + 400) / 25, j / 25) * Math.pow(ex, 2) +
          noise.simplex2((i + 600) / 12.5, j / 12.5) * Math.pow(ex, 4) +
          +(noise.simplex2((i + 800) / 6.25, j / 6.25) * Math.pow(ex, 8)))/2;
  
        pa[3 * (j * wVerts + i) + 2] = height;
  
        // Map height to rainbow color and set it to the material color
        const color = mapHeightToRainbowColor(height);
        if (terrainMaterial) {
            terrainMaterial.color.setRGB(color[0], color[1], color[2]);
        }
      }
    }
  
    pos.needsUpdate = true;
  }, [terrainGeometry]);
  

  // Raf loop
  useFrame(() => {
    mesh.current.rotation.z += 0.001;
  });

  return (
    <mesh
      ref={mesh}
      rotation={[-Math.PI / 2.5, 0, 0]}
      geometry={terrainGeometry}
      material={terrainMaterial}
    >
      <meshPhongMaterial
        attach="material"
        specular={"white"}
        shininess={3}
        flatShading
        // wireframe
        ref={setTerrainMaterial}
      />
    </mesh>
  );
};

export default Terrain;