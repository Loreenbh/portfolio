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
    const home = document.querySelector<HTMLElement>("#home");
    const title = document.querySelector<HTMLElement>(
      "[data-transition-title]",
    );
    const titleFirst = document.querySelector<HTMLElement>(
      ".titleFirst",
    );
    const details = document.querySelector<HTMLElement>(
      "[data-transition-details]",
    );
    const disciplines = document.querySelector<HTMLElement>(
      "[data-transition-disciplines]",
    );

    if (
      !section ||
      !frame ||
      !home ||
      !title ||
      !details ||
      !disciplines
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 600px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isMobile, reduceMotion } = context.conditions!;

        if (reduceMotion) {
          gsap.set(frame, { autoAlpha: 0 });
          return;
        }

        const startTop = isMobile ? "76svh" : "74svh";
        const startWidth = isMobile ? "88vw" : "72vw";
        const startHeight = isMobile ? "24svh" : "26svh";

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: title,
            start: isMobile ? "bottom 82%" : "bottom 78%",
            endTrigger: section,
            end: "bottom bottom",
            scrub: isMobile ? 0.65 : 0.8,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            frame,
            {
              top: startTop,
              width: startWidth,
              height: startHeight,
              borderRadius: "2%",
              opacity: 0,
            },
            {
              top: "0svh",
              width: "100vw",
              height: "100svh",
              borderRadius: "0%",
              opacity: 1,
              ease: "none",
              duration: 100,
            },
            0,
          )
          .fromTo(
            home,
            {
              backgroundColor: "#211c19",
            },
            {
              backgroundColor: "#eae3d8",
              ease: "none",
              duration: 100,
            },
            0,
          )
          .fromTo(
            details,
            {
              color: "#eae3d8",
              borderColor: "rgba(234, 227, 216, 0.15)",
            },
            {
              color: "#211c19",
              borderColor: "rgba(33, 28, 25, 0.28)",
              ease: "none",
              duration: 55,
            },
            35,
          )
          .fromTo(
            disciplines,
            {
              color: "#eae3d8",
            },
            {
              color: "#211c19",
              ease: "none",
              duration: 55,
            },
            35,
          );

        if (titleFirst) {
          timeline.fromTo(
            titleFirst,
            {
              color: "#eae3d8",
            },
            {
              color: "#211c19",
              ease: "none",
              duration: 35,
            },
            65,
          );
        }
      },
      section,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.sceneSection}
      id="immersive-scene"
      aria-label="Transition vers la scène immersive"
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
