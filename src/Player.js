import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import Axe from "./Axe";

const SPEED = 1;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

export function Player({ lerp = THREE.MathUtils.lerp, terrainRef }) {
  const axe = useRef();
  const ref = useRef();
  const rapier = useRapier();
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    const { forward, backward, left, right, jump } = get();
    const velocity = ref.current.linvel();

    // Update camera
    state.camera.position.set(...ref.current.translation());

    // Update axe
    axe.current.children[0].rotation.x = lerp(
      axe.current.children[0].rotation.x,
      Math.sin((velocity.length() > 1) * state.clock.elapsedTime * 10) / 6,
      0.1
    );
    axe.current.rotation.copy(state.camera.rotation);
    axe.current.position
      .copy(state.camera.position)
      .add(state.camera.getWorldDirection(rotation).multiplyScalar(1));

    // Movement
    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);

    direction.subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);

    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

    // Height adjustment
    if (terrainRef && terrainRef.current) {
      const playerPosition = ref.current.translation();
      const playerX = playerPosition.x;
      const playerZ = playerPosition.z;

      // Assuming getHeightAt is available on terrainRef
      const height = terrainRef.current.getHeightAt(playerX, playerZ);
      ref.current.setTranslation({ ...playerPosition, y: height });
      console.log(`Player height updated to: ${height}`);
    }

    // Jumping
    const world = rapier.world.raw();
    const ray = world.castRay(new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }));
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
    if (jump && grounded) ref.current.setLinvel({ x: 0, y: 1.5, z: 0 });
  });

  return (
    <>
      <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={[0, 10, 0]} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
      <group ref={axe} onPointerMissed={() => (axe.current.children[0].rotation.x = -0.5)}>
        <Axe position={[0.15, -0.25, 0.5]} />
      </group>
    </>
  );
}
