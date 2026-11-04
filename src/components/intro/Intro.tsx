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
    const ctx = gsap.context(() => {
      const titleFirst = `.${styles.titleFirst}`;
      const titleSecond = `.${styles.titleSecond}`;
      const role = `.${styles.introRole}`;
      const description = `.${styles.introDescription}`;
      const disciplines = `.${styles.introDisciplines}`;
      const scrollHint = `.${styles.introScroll}`;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set([titleFirst, titleSecond, role, description, disciplines], {
          opacity: 1,
          y: 0,
        });

        gsap.set(scrollHint, { opacity: 0.55 });

        return;
      }

      // État initial des textes.
      // Visible dès le chargement.
      gsap.set([titleFirst, role, description, disciplines], {
        opacity: 1,
        y: 0,
      });

      // Apparaissent au scroll.
      gsap.set([titleSecond], {
        opacity: 0,
        y: 0,
      });

      // Timeline de l'introduction.
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
        // 2. Deuxième ligne.
        .to(
          titleSecond,
          {
            opacity: 1,
            y: 0,
            duration: 40,
            ease: "none",
          },
          20,
        )
        // 6. Disparition de l'indication de scroll.
        .to(
          scrollHint,
          {
            opacity: 0,
            duration: 10,
            ease: "none",
          },
          8,
        )

        // Temps de respiration.
        .to({}, { duration: 56 }, 44);
    }, section);

    return () => ctx.revert();
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
          <span className={styles.titleFirst}>Creating beyond</span>
          <span className={styles.titleSecond}>the screen.</span>
        </h1>

        <div className={styles.introDetails}>
          <p className={styles.introRole}>CREATIVE DEVELOPER</p>
          <p className={styles.introDescription}>
            An independent creative practice exploring design, 3D and
            interactive experiences.
          </p>
        </div>

        <p className={styles.introDisciplines}>DESIGN · 3D · CODE</p>
      </div>
    </section>
  );
}
