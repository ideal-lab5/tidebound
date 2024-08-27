import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls, Text } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useState, useEffect } from "react";
import Home from "./components/home/home.component";
import Game from "./components/game.component";

export default function App() {

    const [ready, set] = useState(false)
    const [showGame, setShowGame] = useState(false);
    // const [terrainRef, setTerrainRef] = useState(null);
    // const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });

    // // Function to update player position
    // const updatePlayerPosition = (position) => {
    //     setPlayerPosition({
    //         x: position.x.toFixed(2),
    //         y: position.y.toFixed(2),
    //         z: position.z.toFixed(2),
    //     });
    // };

    const handleShowGame = () => {
        setShowGame(true)
        set(true)
    }

    return (
        <>
            {!showGame ?
                <Home onEnterGame={handleShowGame} /> :
                <div className={`fullscreen bg ready`}>
                {/* <div className="fullscreen bg"> */}
                    <Game />
                </div>
            }
            {/* <KeyboardControls
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
                    <Physics gravity={[0, 0, 0]}>
                        <Ground setTerrainRef={setTerrainRef} />
                        <Player terrainRef={terrainRef} onPositionChange={updatePlayerPosition} />
                    </Physics>
                    <PointerLockControls />
                </Canvas>
            </KeyboardControls>
            <div style={{
                position: "absolute",
                top: 10,
                left: 10,
                color: "black",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                zIndex: 1000,
            }}>
                <h2>Controls:</h2>
                <ul>
                    <li><strong>W</strong> / <strong>Arrow Up</strong> - Move Forward</li>
                    <li><strong>S</strong> / <strong>Arrow Down</strong> - Move Backward</li>
                    <li><strong>A</strong> / <strong>Arrow Left</strong> - Move Left</li>
                    <li><strong>D</strong> / <strong>Arrow Right</strong> - Move Right</li>
                    <li><strong>Space</strong> - Ascend</li>
                    <li><strong>Shift</strong> - Descend</li>
                </ul>
                <h2>Position:</h2>
                <p>x: {playerPosition.x}</p>
                <p>y: {playerPosition.y}</p>
                <p>z: {playerPosition.z}</p>
            </div> */}
        </>
    );
}
