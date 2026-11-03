"use client";

import { useState } from "react";
import styles from "./Header.module.css";
import { Menu, AudioLines, AudioLinesOff } from "lucide-react";

const menuItems = [
  { label: "HOME", href: "#home" },
  { label: "PROJECTS", href: "#projects" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  return (
    <header className={styles.header}>
      <a href="#home" className={styles.logo} aria-label="BHL - Home">
        BHL
      </a>

      <div className={styles.controls}>
        <button
          className={`${styles.sound} ${soundOn ? styles.soundActive : ""}`}
          onClick={() => setSoundOn(!soundOn)}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Désactiver le son" : "Activer le son"}
        >
          <span className={styles.equalizer}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
        </button>

        <button
          className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.dropdown}>
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
