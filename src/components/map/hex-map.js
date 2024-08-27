import "./styles.css";
import { useState, useEffect, useRef } from "react";
import * as HC from "honeycomb-grid";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";

const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const hexTile = HC.defineHex({ dimensions: 1.1 });
const deg2rad = (deg) => deg * (Math.PI / 180);
const spiralGrid = new HC.Grid(hexTile, HC.spiral({ radius: 2 }));
let planeIntersectPoint = new THREE.Vector3();
const spiralGridArray = spiralGrid.toArray();

export default function HexMap() {
  return (
    <div className="Map">
      <div style={{ width: "90vw", height: "90vh" }}>
        <Scene />
      </div>
    </div>
  );
}

function Scene({ children, ...props }) {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <Canvas {...props}>
      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      <HexGrid setIsDragging={setIsDragging} />
      <Preload all />
      <OrbitControls
        enabled={!isDragging}
        mouseButtons={{
          RIGHT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.PAN
        }}
      />
    </Canvas>
  );
}

const HexGrid = (props) => {
  const [targetHex, setTargetHex] = useState(null);
  const [currentHex, setCurrentHex] = useState(null);
  const [moved, setMoved] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    if (moved) {
      setText(
        `Moved from: [${currentHex.q}, ${currentHex.r}], To: [${targetHex.q}, ${targetHex.r}]`
      );
      setMoved(false);
      setCurrentHex(null);
    }
  }, [moved, targetHex, currentHex]);

  const hexTileProps = {
    targetHex,
    currentHex,
    setTargetHex,
    setCurrentHex,
    setMoved
  };

  return (
    <group>
      {spiralGridArray.map((hex) => {
        const { q, r } = hex;
        return (
          <HexTile
            setIsDragging={props.setIsDragging}
            key={`${q}-${r}`}
            hex={hex}
            {...hexTileProps}
          />
        );
      })}
      <Text
        color="black"
        fontSize={1}
        rotation={[0, 0, 0]}
        position={[0, -4, 1]}
      >
        {text}
      </Text>
    </group>
  );
};

const HexTile = (props) => {
  const {
    hex,
    setIsDragging,
    setTargetHex,
    setCurrentHex,
    setMoved,
    targetHex,
    currentHex
  } = props;
  const { x: originX, y: originY } = hex.center;

  const mesh = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [value, setValue] = useState(0);
  useCursor(hovered);
  const [springAnimation, springApi] = useSpring(() => ({
    position: [originX, originY, 0]
  }));
  const dragBind = useDrag(
    (state) => {
      const { active, timeStamp, intentional } = state;
      setIsDragging(active);

      if (!active && !intentional) {
        setValue((state) => (state += 1));
        return;
      }
      if (!active && targetHex && currentHex && targetHex !== currentHex) {
        setMoved(true);
      }

      const event = state.event;
      if (active) {
        setCurrentHex(hex);
        event.ray.intersectPlane(floorPlane, planeIntersectPoint);
      }
      springApi.start({
        position: active
          ? [planeIntersectPoint.x, planeIntersectPoint.y, 0.5]
          : [originX, originY, 0]
      });

      return timeStamp;
    },
    { filterTaps: true }
  );

  const colorHandler = () => {
    if (hovered) {
      return "#FD8A8A";
    } else {
      return "#E8E8E8";
    }
  };
  return (
    <animated.mesh
      {...dragBind()}
      {...springAnimation}
      ref={mesh}
      onPointerOver={() => {
        setHovered(true);
        setTargetHex(hex);
      }}
      onPointerOut={() => {
        setHovered(false);
        setTargetHex(null);
      }}
      rotation={[deg2rad(90), 0, 0]}
      castShadow
    >
      <ValueDisplay hex={hex} value={value} />
      <cylinderGeometry args={[1, 1, 0.1, 6, 1]} />
      <meshPhysicalMaterial color={colorHandler()} />
    </animated.mesh>
  );
};

const ValueDisplay = (props) => {
  const { hex, value } = props;
  return (
    <>
      <Text
        color="#222831"
        fontSize={0.2}
        rotation={[-deg2rad(90), 0, 0]}
        position={[0, 0.051, -0.8]}
      >
        {`${hex.q},${hex.r}`}
      </Text>
      <Text
        color="#222831"
        fontSize={1}
        rotation={[-deg2rad(90), 0, 0]}
        position={[0, 0.051, 0]}
      >
        {`${value}`}
      </Text>
    </>
  );
};
