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
