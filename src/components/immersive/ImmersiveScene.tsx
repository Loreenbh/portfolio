"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ImmersiveScene.module.css";

export default function ImmersiveScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const frame = frameRef.current;
    const home = document.querySelector("#home");

    if (!section || !frame || !home) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // Le fond poursuit sa transition vers l'ivoire
        .fromTo(
          home,
          {
            backgroundColor: "#5b5147",
          },
          {
            backgroundColor: "#eae3d8",
            ease: "none",
            duration: 35,
          },
          0,
        )

        // Le rectangle apparaît ensuite et grandit
        .fromTo(
          frame,
          {
            width: "62vw",
            height: "62vh",
            borderRadius: "3%",
            opacity: 0,
          },
          {
            width: "100vw",
            height: "100svh",
            borderRadius: "0%",
            opacity: 1,
            ease: "none",
            duration: 65,
          },
          35,
        );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.sceneSection}
      id="immersive-scene"
    >
      <div className={styles.sceneStage}>
        <div ref={frameRef} className={styles.sceneFrame}>
          <div className={styles.sceneContent}>
            {/* La scène 3D sera intégrée ici */}
          </div>
        </div>
      </div>
    </section>
  );
}
