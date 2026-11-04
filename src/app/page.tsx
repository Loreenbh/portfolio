import Header from "@/components/layout/Header";
import Intro from "@/components/intro/Intro";
import ScrollProgress from "@/components/layout/ScrollProgress";
import styles from "./Home.module.css";
import ImmersiveScene from "@/components/immersive/ImmersiveScene";

export default function Home() {
  return (
    <main id="home" className={styles.home}>
      <div className={styles.homeContent}>
        <Header />
        <Intro />
        <ImmersiveScene />
        <ScrollProgress />
      </div>
    </main>
  );
}
