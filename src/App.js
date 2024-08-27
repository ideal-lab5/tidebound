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
                    <Game />
                </div>
            }
        </>
    );
}
