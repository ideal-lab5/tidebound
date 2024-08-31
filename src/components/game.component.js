import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls, Text } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "../Ground";
import { Player } from "../Player";
import { useState, useEffect, useContext } from "react";
import appState from "../state/appState";
import { EtfContext } from "../EtfContext";
import { IPFSAccessController } from "@orbitdb/core";

export default function Game(props) {
    const [terrainRef, setTerrainRef] = useState(null);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });

    const seed = appState((s) => s.generation.Seed);

    const { signer, libp2p } = useContext(EtfContext);

    // useEffect(() => {console.log(orbitDb)}, [orbitDb]);

    useEffect(() => {

        const setup = async () => {
            // subscribe to pubsub topic (seed)
            console.log('subscribing to ' + + seed)
            libp2p.services.pubsub.subscribe(seed.toString())

            libp2p.services.pubsub.addEventListener('message', event => {
                const topic = event.detail.topic
                const message = toString(event.detail.data)

                console.log(`Message received on topic '${topic}'`)
                console.log(event)
            })

        }

        if (libp2p) {
            setup()
        }

        // console.log(ctx);
    }, [libp2p]);


    // Function to update player position
    const updatePlayerPosition = (position) => {
        const x = position.x.toFixed(2);
        const y = position.y.toFixed(2);
        const z = position.z.toFixed(2);

        // gossip (x,y,z) to topic
        console.log('publishing to pubsub topic')
        // console.log(libp2p.getPeers().length)
        // check for peers

        const peerList = libp2p.services.pubsub.getSubscribers(seed.toString());
        if (peerList.length > 0) {
            libp2p.services.pubsub.publish(seed.toString(), { "x": x, "y": y, "z": z })
        }

        setPlayerPosition({
            x: position.x.toFixed(2),
            y: position.y.toFixed(2),
            z: position.z.toFixed(2),
        });
    };

    const handleOnExit = () => {
        props.onExit()
    }

    return (
        <>
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
                <button
                    onClick={handleOnExit}
                    style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
                >
                    Exit
                </button>
                <span>Press `esc` to control pointer</span>
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
            </div>
        </>
    );
}
