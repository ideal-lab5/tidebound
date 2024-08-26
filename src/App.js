import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useState } from "react";

export default function App() {
    const [terrainRef, setTerrainRef] = useState(null);

    return (
        <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
                { name: "jump", keys: ["Space"] },
            ]}
        >
            <Canvas shadows camera={{ fov: 45 }}>
                <Sky sunPosition={[100, 20, 100]} />
                <ambientLight intensity={0.3} />
                <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
                <Physics gravity={[0, -30, 0]}>
                    <Ground setTerrainRef={setTerrainRef} />
                    <Player hexMesh={terrainRef} />
                </Physics>
                <PointerLockControls />
            </Canvas>
        </KeyboardControls>
    );
}
