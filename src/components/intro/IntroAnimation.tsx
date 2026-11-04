
"use client";

import { useRef } from "react";
import {
  Canvas,
  ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import * as THREE from "three";

function TemporaryObject() {
  const objectRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const { camera, gl, raycaster, pointer } = useThree();

  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const activePointerId = useRef<number | null>(null);

  const targetPosition = useRef(new THREE.Vector3());
  const dragOffset = useRef(new THREE.Vector3());

  const dragPlane = useRef(
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
  );

  const intersection = useRef(new THREE.Vector3());
  const framePosition = useRef(new THREE.Vector3());

  const time = useRef(0);
  const velocity = useRef(new THREE.Vector3());

  const restColor = useRef(new THREE.Color("#b8aa96"));
  const hoverColor = useRef(new THREE.Color("#e0c7a3"));
  const restEmissive = useRef(new THREE.Color("#000000"));
  const hoverEmissive = useRef(new THREE.Color("#8c6840"));

  useFrame((_, delta) => {
    if (!objectRef.current) return;

    const object = objectRef.current;
    const dt = Math.min(delta, 0.05);

    time.current += dt;
    framePosition.current.copy(object.position);

    if (isDragging.current) {
      // Suivi fluide de la souris
      object.position.x = THREE.MathUtils.damp(
        object.position.x,
        targetPosition.current.x,
        14,
        dt,
      );

      object.position.y = THREE.MathUtils.damp(
        object.position.y,
        targetPosition.current.y,
        14,
        dt,
      );

      // Calcul de la vitesse réelle pendant le déplacement
      const currentVelocity = object.position
        .clone()
        .sub(framePosition.current)
        .divideScalar(Math.max(dt, 0.001));

      velocity.current.lerp(currentVelocity, 0.35);
    } else {
      // Inertie après le relâchement
      object.position.addScaledVector(velocity.current, dt);

      velocity.current.multiplyScalar(Math.exp(-2.8 * dt));

      // Lévitation naturelle
      object.position.x +=
        (Math.sin(time.current * 0.55) -
          Math.sin((time.current - dt) * 0.55)) * 0.035;

      object.position.y +=
        (Math.sin(time.current * 0.8) -
          Math.sin((time.current - dt) * 0.8)) * 0.09;
    }

    // Rotation permanente
    object.rotation.y += dt * 0.13;
    object.rotation.x += dt * 0.035;
    object.rotation.z = Math.sin(time.current * 0.45) * 0.025;

    // Transformation de la matière au survol
    if (materialRef.current) {
      const material = materialRef.current;

      const colorTarget = isHovered.current
        ? hoverColor.current
        : restColor.current;

      const emissiveTarget = isHovered.current
        ? hoverEmissive.current
        : restEmissive.current;

      material.color.lerp(colorTarget, 1 - Math.exp(-5 * dt));
      material.emissive.lerp(emissiveTarget, 1 - Math.exp(-4 * dt));

      material.roughness = THREE.MathUtils.damp(
        material.roughness,
        isHovered.current ? 0.28 : 0.72,
        4,
        dt,
      );

      material.metalness = THREE.MathUtils.damp(
        material.metalness,
        isHovered.current ? 0.3 : 0,
        4,
        dt,
      );

      material.clearcoat = THREE.MathUtils.damp(
        material.clearcoat,
        isHovered.current ? 0.65 : 0.05,
        4,
        dt,
      );

      material.emissiveIntensity = THREE.MathUtils.damp(
        material.emissiveIntensity,
        isHovered.current ? 0.3 : 0,
        4,
        dt,
      );
    }

    // Légère réaction de taille au survol
    const targetScale = isHovered.current ? 1.035 : 1;

    object.scale.setScalar(
      THREE.MathUtils.damp(object.scale.x, targetScale, 5, dt),
    );
  });

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();

    if (!objectRef.current) return;

    isDragging.current = true;
    activePointerId.current = event.pointerId;

    velocity.current.set(0, 0, 0);
    targetPosition.current.copy(objectRef.current.position);

    // Conserve le point exact où l'utilisateur a saisi l'objet
    raycaster.setFromCamera(pointer, camera);

    if (raycaster.ray.intersectPlane(
      dragPlane.current,
      intersection.current,
    )) {
      dragOffset.current
        .copy(objectRef.current.position)
        .sub(intersection.current);
    }

    gl.domElement.setPointerCapture(event.pointerId);
    document.body.style.cursor = "grabbing";
  }

  function handlePointerMove() {
    if (!isDragging.current) return;

    raycaster.setFromCamera(pointer, camera);

    if (
      raycaster.ray.intersectPlane(
        dragPlane.current,
        intersection.current,
      )
    ) {
      targetPosition.current
        .copy(intersection.current)
        .add(dragOffset.current);
    }
  }

  function handlePointerUp() {
    if (!isDragging.current) return;

    if (
      activePointerId.current !== null &&
      gl.domElement.hasPointerCapture(activePointerId.current)
    ) {
      gl.domElement.releasePointerCapture(activePointerId.current);
    }

    isDragging.current = false;
    activePointerId.current = null;

    document.body.style.cursor = "auto";
  }

  return (
    <mesh
      ref={objectRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerOver={() => {
        isHovered.current = true;
        if (!isDragging.current) document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        isHovered.current = false;
        if (!isDragging.current) document.body.style.cursor = "auto";
      }}
    >
      <icosahedronGeometry args={[1, 2]} />

      <meshPhysicalMaterial
        ref={materialRef}
        color="#b8aa96"
        roughness={0.72}
        metalness={0}
        clearcoat={0.05}
      />
    </mesh>
  );
}

export default function IntroObject() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 3, 4]} intensity={2.2} />
      <TemporaryObject />
    </Canvas>
  );
}
