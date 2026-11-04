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

        // Hasard
        float random(vec2 p) {
          return fract(
            sin(dot(p, vec2(127.1, 311.7))) * 43758.5453
          );
        }

        // Bruit naturel
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);

          f = f * f * (3.0 - 2.0 * f);

          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));

          return mix(
            mix(a, b, f.x),
            mix(c, d, f.x),
            f.y
          );
        }

        // Bruit à plusieurs échelles
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;

          for (int i = 0; i < 4; i++) {
            value += noise(p) * amplitude;
            p *= 2.0;
            amplitude *= 0.5;
          }

          return value;
        }

        // Cellules rocheuses irrégulières
        vec3 voronoi(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);

          float minDist = 10.0;
          float secondDist = 10.0;
          float cellValue = 0.0;

          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec2 neighbor = vec2(float(x), float(y));
              vec2 cell = i + neighbor;

              vec2 offset = vec2(
                random(cell),
                random(cell + vec2(17.0, 31.0))
              );

              offset = 0.2 + offset * 0.6;

              vec2 point = neighbor + offset - f;
              float d = length(point);

              if (d < minDist) {
                secondDist = minDist;
                minDist = d;
                cellValue = random(cell + 42.0);
              } else if (d < secondDist) {
                secondDist = d;
              }
            }
          }

          return vec3(minDist, secondDist, cellValue);
        }

        // Hauteur de la roche
        float getHeight(vec2 uv) {
          float aspect = uResolution.x / uResolution.y;
          vec2 p = uv * vec2(aspect, 1.0);

          // Déformation des cellules
          vec2 distortion = vec2(
            fbm(p * 3.0),
            fbm(p * 3.0 + 12.4)
          );

          p += (distortion - 0.5) * 0.65;

          // Grandes plaques rocheuses
          vec3 cells = voronoi(p * 8.0);
          float facets = cells.z * 0.35;

          // Petites irrégularités de surface
          float roughness = fbm(p * 35.0) * 0.045;
          float height = facets + roughness;

          // Influence du curseur
          vec2 mouse = uv - uMouse;
          mouse.x *= aspect;

          float distanceToMouse = length(mouse);
          float influence = exp(
            -distanceToMouse * distanceToMouse * 16.0
          );

          height += influence * 0.09;

          return height;
        }

        void main() {
          vec2 uv = vUv;
          float aspect = uResolution.x / uResolution.y;

          // Calcul des hauteurs voisines
          float stepSize = 0.0015;

          float left = getHeight(uv - vec2(stepSize, 0.0));
          float right = getHeight(uv + vec2(stepSize, 0.0));
          float bottom = getHeight(uv - vec2(0.0, stepSize));
          float top = getHeight(uv + vec2(0.0, stepSize));

          // Normale virtuelle
          vec3 normal = normalize(vec3(
            (left - right) * 38.0,
            (bottom - top) * 38.0,
            1.0
          ));

          // Lumière latérale
          vec3 lightDirection = normalize(
            vec3(-0.65, 0.75, 0.65)
          );

          float diffuse = max(
            dot(normal, lightDirection),
            0.0
          );

          // Relief et contraste
          float lighting = 0.25 + diffuse * 1.15;

          // Recalcul des cellules pour les fissures
          vec2 p = uv * vec2(aspect, 1.0);

          vec2 distortion = vec2(
            fbm(p * 3.0),
            fbm(p * 3.0 + 12.4)
          );

          p += (distortion - 0.5) * 0.65;

          vec3 cells = voronoi(p * 8.0);

          float cracks = 1.0 - smoothstep(
            0.015,
            0.09,
            cells.y - cells.x
          );

          // Couleur minérale sombre
          vec3 baseColor = vec3(0.105, 0.09, 0.078);
          vec3 color = baseColor * lighting;

          // Arêtes éclairées
          float highlights = pow(diffuse, 3.0);

          color += vec3(0.16, 0.13, 0.10) *
            highlights * 0.35;

          // Fissures sombres
          color *= 1.0 - cracks * 0.55;

          // Petites variations de matière
          float grain = noise(uv * uResolution * 0.12);
          color += vec3(0.025, 0.021, 0.017) * grain;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    // Adaptation à la taille du conteneur
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    window.addEventListener("resize", resize);

    // Interaction avec la souris
    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      uniforms.uMouse.value.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      );
    };

    window.addEventListener("mousemove", onMouseMove);

    resize();

    // Animation
    const clock = new THREE.Clock();
    let animationFrame = 0;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animate();

    // Nettoyage
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
