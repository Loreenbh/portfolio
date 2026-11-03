"use client";

import { type MouseEvent, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Intro.module.css";

const fragmentShapes = [
  "polygon(0 18%, 72% 0, 100% 34%, 38% 58%, 8% 100%, 0 64%)",
  "polygon(12% 0, 100% 16%, 78% 52%, 100% 86%, 34% 100%, 0 58%)",
  "polygon(0 42%, 32% 8%, 86% 0, 100% 62%, 58% 100%, 18% 82%)",
];

function DustText({
  children,
  className,
  onEnter,
  onLeave,
}: {
  children: string;
  className: string;
  onEnter: (event: MouseEvent<HTMLSpanElement>) => void;
  onLeave: (event: MouseEvent<HTMLSpanElement>) => void;
}) {
  return (
    <span
      className={`${className} ${styles.dustText}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {Array.from(children).map((character, index) => {
        const hasFragment = character !== " " && index % 5 === 2;

        return (
          <span className={styles.dustChar} key={`${character}-${index}`}>
            {character === " " ? "\u00a0" : character}
            {hasFragment && (
              <span
                aria-hidden="true"
                className={styles.dustFragment}
                style={{
                  clipPath:
                    fragmentShapes[index % fragmentShapes.length],
                }}
              >
                {character}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

function animateDust(
  target: HTMLSpanElement,
  isEntering: boolean,
): void {
  const fragments = target.querySelectorAll<HTMLElement>(
    `.${styles.dustFragment}`,
  );

  gsap.killTweensOf(fragments);
  gsap.to(fragments, {
    opacity: isEntering ? 0.58 : 0,
    x: isEntering ? () => gsap.utils.random(-7, 7) : 0,
    y: isEntering ? () => gsap.utils.random(-5, 6) : 0,
    rotation: isEntering ? () => gsap.utils.random(-8, 8) : 0,
    duration: isEntering ? 0.7 : 0.85,
    stagger: isEntering ? 0.08 : 0.04,
    ease: isEntering ? "power1.out" : "power2.inOut",
  });
}

export default function Intro() {
  const introRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "+=5000",
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      const elements = [
        `.${styles.introLabel}`,
        `.${styles.titleFirst}`,
        `.${styles.titleSecond}`,
        `.${styles.introRole}`,
        `.${styles.introDescription}`,
        `.${styles.introDisciplines}`,
      ];

      gsap.set(elements, { opacity: 0, y: 18 });

      timeline
        .to(
          `.${styles.introLabel}`,
          {
            opacity: 0.65,
            y: 0,
            duration: 2,
            ease: "power1.out",
          },
          0,
        )

        .to(
          `.${styles.titleFirst}`,
          {
            opacity: 1,
            y: 0,
            duration: 2.8,
            ease: "power2.out",
          },
          4,
        )

        .to(
          `.${styles.titleSecond}`,
          {
            opacity: 1,
            y: 0,
            duration: 3.8,
            ease: "power1.out",
          },
          11,
        )

        .to(
          `.${styles.introRole}`,
          {
            opacity: 1,
            y: 0,
            duration: 2.2,
            ease: "power2.out",
          },
          21,
        )

        .to(
          `.${styles.introDescription}`,
          {
            opacity: 0.65,
            y: 0,
            duration: 2.6,
            ease: "power1.out",
          },
          26,
        )

        .to(
          `.${styles.introDisciplines}`,
          {
            opacity: 0.85,
            y: 0,
            duration: 2,
            ease: "power2.out",
          },
          34,
        );

      gsap.to(`.${styles.introScroll}`, {
        opacity: 0,
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "+=300",
          scrub: true,
        },
      });
    }, introRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={introRef} className={styles.intro} id="intro">
      <div className={styles.introContent}>
        <DustText
          className={styles.introLabel}
          onEnter={(event) => animateDust(event.currentTarget, true)}
          onLeave={(event) => animateDust(event.currentTarget, false)}
        >
          PORTFOLIO — 2026
        </DustText>

        <h1 className={styles.introTitle}>
          <DustText
            className={styles.titleFirst}
            onEnter={(event) => animateDust(event.currentTarget, true)}
            onLeave={(event) => animateDust(event.currentTarget, false)}
          >
            Creating beyond
          </DustText>

          <DustText
            className={styles.titleSecond}
            onEnter={(event) => animateDust(event.currentTarget, true)}
            onLeave={(event) => animateDust(event.currentTarget, false)}
          >
            the screen.
          </DustText>
        </h1>

        <div className={styles.introDetails}>
          <DustText
            className={styles.introRole}
            onEnter={(event) => animateDust(event.currentTarget, true)}
            onLeave={(event) => animateDust(event.currentTarget, false)}
          >
            CREATIVE DEVELOPER
          </DustText>

          <DustText
            className={styles.introDescription}
            onEnter={(event) => animateDust(event.currentTarget, true)}
            onLeave={(event) => animateDust(event.currentTarget, false)}
          >
            An independent creative practice exploring design, 3D and
            interactive experiences.
          </DustText>
        </div>

        <DustText
          className={styles.introDisciplines}
          onEnter={(event) => animateDust(event.currentTarget, true)}
          onLeave={(event) => animateDust(event.currentTarget, false)}
        >
          DESIGN · 3D · CODE
        </DustText>
      </div>

      <p className={styles.introScroll}>SCROLL TO EXPLORE</p>
    </section>
  );
}
