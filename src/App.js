import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls, Text } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { useState, useEffect, useContext } from "react";
import Home from "./components/home/home.component";
import Game from "./components/game.component";
import { EtfContext } from "./EtfContext";

export default function App() {

    const [ready, set] = useState(false)
    const [showGame, setShowGame] = useState(false);

    // const ctx = useContext(EtfContext);

    // useEffect(() => {console.log(ctx)}, [ctx]);

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
