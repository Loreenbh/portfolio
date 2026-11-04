import Header from "@/components/layout/Header";
import Intro from "@/components/intro/Intro";
import ScrollProgress from "@/components/layout/ScrollProgress";
import InteractiveTexture from "@/components/effects/InteractiveTexture";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main id="home" className={styles.home}>
      <div className={styles.homeTexture}>
        <InteractiveTexture />
      </div>
      <div className={styles.homeContent}>
        <Header />
        <Intro />
        <ScrollProgress />
      </div>
    </main>
  );
}
