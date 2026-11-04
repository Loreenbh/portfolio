"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Intro.module.css";
import IntroAnimation from "./IntroAnimation";

export default function Intro() {
  const introRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = introRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 600px)",
        isDesktop: "(min-width: 601px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isMobile, isDesktop, reduceMotion } = context.conditions!;

        const titleFirst = `.${styles.titleFirst}`;
        const titleSecond = `.${styles.titleSecond}`;
        const details = `.${styles.introDetails}`;
        const disciplines = `.${styles.introDisciplines}`;
        const scrollHint = `.${styles.introScroll}`;
        const scene = `.${styles.introAnimation}`;

        if (reduceMotion || isMobile) {
          gsap.set([titleFirst, titleSecond, details, disciplines, scene], {
            opacity: 1,
            y: 0,
            scale: 1,
          });

          gsap.set(scrollHint, { opacity: 0.55 });
          return;
        }

        if (isDesktop) {
          gsap.set([titleFirst, titleSecond], {
            opacity: 0.36,
            y: 16,
          });

          gsap.set([details, disciplines], {
            opacity: 0.15,
            y: 16,
          });

          gsap.set(scene, {
            opacity: 0.72,
            scale: 0.96,
            y: 0,
          });

          gsap.set(scrollHint, { opacity: 0.55 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(scene, {
              opacity: 1,
              scale: 1,
              duration: 16,
              ease: "none",
            })
            .to(
              titleFirst,
              {
                opacity: 1,
                y: 0,
                duration: 18,
                ease: "none",
              },
              8,
            )
            .to(
              titleSecond,
              {
                opacity: 1,
                y: 0,
                duration: 24,
                ease: "none",
              },
              24,
            )
            .to(
              scrollHint,
              {
                opacity: 0,
                duration: 10,
                ease: "none",
              },
              8,
            )
            .to(
              [details, disciplines],
              {
                opacity: 1,
                y: 0,
                duration: 20,
                ease: "none",
              },
              40,
            )
            .to({}, { duration: 18 }, 78);
        }
      },
      section,
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={introRef} className={styles.intro} id="intro">
      <div className={styles.introContent}>
        <p className={styles.introLabel}>PORTFOLIO — 2026</p>

        <div className={styles.introAnimation}>
          <IntroAnimation />
        </div>

        <p className={styles.introScroll}>SCROLL TO EXPLORE</p>

        <h1 className={styles.introTitle}>
          <span className={styles.titleFirst}>Creating beyond </span>
          <span
            className={styles.titleSecond}
            data-transition-title
          >
            {" "}the screen.
          </span>
        </h1>

        <div
          className={styles.introDetails}
          data-transition-details
        >
          <p className={styles.introRole}>CREATIVE DEVELOPER</p>

          <p className={styles.introDescription}>
            An independent creative practice exploring design, 3D and
            interactive experiences.
          </p>
        </div>

        <p
          className={styles.introDisciplines}
          data-transition-disciplines
        >
          DESIGN · 3D · CODE
        </p>
      </div>
    </section>
  );
}
