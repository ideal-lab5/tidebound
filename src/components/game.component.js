import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls, Text } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "../Ground";
import { Player } from "../Player";
import { useState, useEffect, useContext } from "react";
import appState from "../state/appState";
import { EtfContext } from "../EtfContext";
import { IPFSAccessController } from "@orbitdb/core";

export default function Game() {
    const [terrainRef, setTerrainRef] = useState(null);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });

    const seed = appState((s) => s.generation.Seed);

    const { signer, orbitDb } = useContext(EtfContext);

    // useEffect(() => {console.log(orbitDb)}, [orbitDb]);

    useEffect(() => {

        // const setup = async () => {
        //     const db = await orbitDb.open(
        //         seed.toString(), 
        //         // { 
        //         //     AccessController: IPFSAccessController({ write: ['*'] })
        //         // }
        //     );

        //     // // Listen for updates from peers
        //     // db.events.on("update", async entry => {
        //     //     console.log(entry)
        //     //     const all = await db.all()
        //     //     console.log(all)
        //     // })

        //     // Add an entry
        //     db.add("world " + signer.address).then(hash => console.log(hash));

        //     // // Query
        //     // for await (const record of db.iterator()) {
        //     //     console.log(record)
        //     // }
        // }

        if (orbitDb) {
            // console.log(ctx)
            // setup()
            initOrbitDB(seed).then(db => db.add("hello  " + signer.address).then(hash => console.log(hash)))
            // Add an entry
        }

        // console.log(ctx);
    }, [orbitDb]);

    async function initOrbitDB(seed) {
        // // Initialize Helia
        // const helia = await initHelia();

        // // Create an instance of OrbitDB with Helia's IPFS
        // const orbitdb = await OrbitDB.createInstance(helia.ipfs);

        // Open or create a database using the provided seed
        // const db = await orbitdb.keyvalue(seed);

        // Load existing data from the database
        // await db.load();

        const db = await orbitDb.open(
            seed.toString(),
            { 
                AccessController: IPFSAccessController({ write: ['*'] })
            }
        );

        // // Log replication events
        // db.events.on('replicated', (address) => {
        //     console.log(`Database replicated at: ${address}`);
        // });

        // // Log database updates
        // db.events.on('write', (address, entry) => {
        //     console.log(`Database updated: ${entry.payload.value}`);
        // });

        return db;
    }


    // Function to update player position
    const updatePlayerPosition = (position) => {
        setPlayerPosition({
            x: position.x.toFixed(2),
            y: position.y.toFixed(2),
            z: position.z.toFixed(2),
        });
    };

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
