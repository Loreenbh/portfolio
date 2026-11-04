import Header from "@/components/layout/Header";
import Intro from "@/components/intro/Intro";
import ScrollProgress from "@/components/layout/ScrollProgress";

export default function Home() {
  return (
    <main id="home">
      <Header />
      <Intro />
      <ScrollProgress />
    </main>
  );
}
