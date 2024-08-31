import { useState } from "react";
import Home from "./components/home/home.component";
import Game from "./components/game.component";

export default function App() {

    const [ready, set] = useState(false)
    const [showGame, setShowGame] = useState(false);

    // const ctx = useContext(EtfContext);

    // useEffect(() => {console.log(ctx)}, [ctx]);

    const handleShowGame = () => {
        setShowGame(true)
        set(true)
    }

    const handleOnExit = () => {
        setShowGame(false);
    }

    return (
        <>
            {!showGame ?
                <Home onEnterGame={handleShowGame} /> :
                <div className={`fullscreen bg ready`}>
                    <Game onExit={handleOnExit} />
                </div>
            }
        </>
    );
}
