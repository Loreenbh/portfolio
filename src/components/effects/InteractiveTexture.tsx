"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveTexture() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-2, -2) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix *
            modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;

        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          float aspect = uResolution.x / uResolution.y;

          vec2 mouse = uv - uMouse;
          mouse.x *= aspect;

          float distanceToMouse = length(mouse);
          float relief = exp(-distanceToMouse * distanceToMouse * 18.0);

          float noise = sin(uv.x * 35.0 + uTime * 0.2)
                      * cos(uv.y * 28.0 - uTime * 0.15);

          float texture = noise * 0.035 + relief * 0.22;
          vec3 baseColor = vec3(0.13, 0.11, 0.095);
          vec3 light = vec3(0.48, 0.39, 0.29) * texture;

          gl_FragColor = vec4(baseColor + light, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      uniforms.uMouse.value.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      );
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    resize();

    const clock = new THREE.Clock();
    let animationFrame = 0;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="homeInteractiveTexture" />;
}
