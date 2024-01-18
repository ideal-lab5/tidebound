import React, { useRef } from "react";

const FakeSphere = () => (
  <mesh>
    {/* <sphereGeometry attach="geometry" args={[0.7, 250, 500]} /> */}
    <meshBasicMaterial attach="material" color={0xfff1ef} />
  </mesh>
);

const Lights = () => {
  const ref1 = useRef();
  const ref2 = useRef();

  return (
    <group>
      <FakeSphere />
      <ambientLight ref={ref2} position={[0, 4, 0]} intensity={0.3} />

      <directionalLight intensity={.6} position={[0, 0, 100]} color={0xffffff} />

      <pointLight
        ref={ref1}
        intensity={1}
        position={[-6, 3, -6]}
        color={0xffcc77}
      >
        {ref1.current && <pointLightHelper args={[ref1.current]} />}
      </pointLight>

      <pointLight
        ref={ref2}
        intensity={1}
        position={[6, 3, 6]}
        color={0xffcc77}
      >
        {ref2.current && <pointLightHelper args={[ref2.current]} />}
      </pointLight>
    </group>
  );
};

export default Lights;
