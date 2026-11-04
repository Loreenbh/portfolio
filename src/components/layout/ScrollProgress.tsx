"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import styles from "./ScrollProgress.module.css";

const THUMB_RATIO = 0.2;

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const dragging = useRef(false);

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const nextProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      setProgress(Math.max(0, Math.min(1, nextProgress)));
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });

    window.addEventListener("resize", updateProgress);

    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollToPosition = (clientY: number, rect: DOMRect) => {
    const thumbHeight = rect.height * THUMB_RATIO;
    const availableHeight = rect.height - thumbHeight;

    const relativeY = clientY - rect.top - thumbHeight / 2;

    const nextProgress = Math.max(0, Math.min(1, relativeY / availableHeight));

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: nextProgress * maxScroll,
      behavior: "auto",
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;

    event.currentTarget.setPointerCapture(event.pointerId);

    scrollToPosition(
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
    );
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    scrollToPosition(
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
    );
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    let nextPosition = window.scrollY;

    switch (event.key) {
      case "ArrowDown":
        nextPosition += 100;
        break;

      case "ArrowUp":
        nextPosition -= 100;
        break;

      case "PageDown":
        nextPosition += window.innerHeight * 0.8;
        break;

      case "PageUp":
        nextPosition -= window.innerHeight * 0.8;
        break;

      case "Home":
        nextPosition = 0;
        break;

      case "End":
        nextPosition = maxScroll;
        break;

      default:
        return;
    }

    event.preventDefault();

    window.scrollTo({
      top: Math.max(0, Math.min(maxScroll, nextPosition)),
      behavior: "smooth",
    });
  };

  return (
    <div
      className={styles.scrollProgress}
      role="scrollbar"
      aria-label="Progression dans la page"
      aria-controls="home"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.track} />

      <span
        className={styles.thumb}
        style={{
          top: `${progress * (100 - THUMB_RATIO * 100)}%`,
        }}
      />
    </div>
  );
}
