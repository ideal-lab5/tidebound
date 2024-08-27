import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import grass from "./assets/grass.jpg";
import Terrain from "./geometry/ScatterHexagonMesh";
import Trees from "./geometry/Trees";
import Grass from "./geometry/Grass";
import Clouds from "./geometry/Clouds";
import useHexagonScatter from "./hooks/useHexagonScatter";
import { useRef, useEffect } from "react";
import appState from "./state/appState";

export function Ground({ setTerrainRef, ...props }) {
    const points = useHexagonScatter(25);
    const general =  appState((s) => s.general);

    const texture = useTexture(grass);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    // Create a ref for the Terrain component
    const terrainRef = useRef();

    // Pass the ref to the parent component
    useEffect(() => {
        if (terrainRef) {
            console.log('setting terrain ref')
            setTerrainRef(terrainRef);
        }
    }, [setTerrainRef]);

    return (
        <RigidBody {...props} type="fixed" colliders={false}>
            <group rotation-x={-Math.PI / 2}>
                {general.Trees && <Trees points={points} />}
                {general.Grass && <Grass points={points} />}
                {general.Clouds && <Clouds />}
                {/* <Terrain points={points} /> */}
                <Terrain ref={terrainRef} points={points} />
            </group>
            <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>
    );
}
