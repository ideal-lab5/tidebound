import React, { useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { FrontSide } from "three";
import useColor from "../hooks/useColor";
import useFBM from "../hooks/useFBM";
import appState from "../state/appState";
import BeveledHexagonGeometry from "./BeveledHexagonGeometry";
import { useSpring } from "@react-spring/three";

const tempV4 = new THREE.Object3D();

const Terrain = forwardRef(({ points, onClickHandler }, ref) => {
  const colors = appState((s) => s.colors);
  const generation = appState((s) => s.generation);

  const noise = useFBM(colors.Water.value);
  const color = useColor(colors.Water.value);
  const meshRef = useRef();
  const heights = useRef(new Map()); // Store heights

  // Generate terrain
  const generate = useCallback(
    (scale) => {
      if (meshRef.current) {
        const mesh = meshRef.current;

        points.forEach((point, i) => {
          tempV4.position.copy(point);
          tempV4.scale.setScalar(0.01);

          if (scale) {
            tempV4.scale.multiplyScalar(scale);
          }

          tempV4.updateMatrix();

          const p = tempV4.position.clone().multiplyScalar(generation.Scale);
          let n = noise(p) * generation.Height;
          const c = color(n);

          if (n <= colors.Water.value) n = colors.Water.value;

          tempV4.scale.z *= 40 * n;

          tempV4.updateMatrix();
          mesh.setMatrixAt(i, tempV4.matrix);
          mesh.setColorAt(i, c);

          // Store height for point
          heights.current.set(point.toArray().join(','), n);
        });
        mesh.instanceMatrix.needsUpdate = true;
        mesh.instanceColor.needsUpdate = true;
      }
    },
    [points, noise, color, colors, generation]
  );

  // Function to find the nearest hexagon center to a given (x, z) coordinate
  const findNearestHexCenter = (x, z) => {
    let nearestPoint = null;
    let minDist = Infinity;

    heights.current.forEach((value, key) => {
      const [px, , pz] = key.split(',').map(Number); // Extract x, z from the key
      const dist = (px - x) ** 2 + (pz - z) ** 2;
      if (dist < minDist) {
        minDist = dist;
        nearestPoint = key;
      }
    });

    return nearestPoint;
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getHeightAt(x, z) {
      const nearestHex = findNearestHexCenter(x, z);
      if (nearestHex) {
        return heights.current.get(nearestHex) || 0;
      }
      return 0;
    },
  }));

  const { scale } = useSpring({
    scale: 1,
    onChange: ({ value: { scale } }) => {
      generate(scale);
    },
  });

  useEffect(() => {
    scale.start({ from: 0, to: 1 });
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <group>
      <instancedMesh
        castShadow
        receiveShadow
        ref={meshRef}
        args={[null, null, points.length]}
      >
        <BeveledHexagonGeometry />
        <meshPhongMaterial
          shadowSide={FrontSide}
          side={FrontSide}
        />
      </instancedMesh>
    </group>
  );
});

export default Terrain;
