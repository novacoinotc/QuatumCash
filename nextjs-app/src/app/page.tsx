import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Why from "@/components/sections/Why";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import AmbientGlow from "@/components/visuals/AmbientGlow";
import CursorTrail from "@/components/visuals/CursorTrail";
import ScrollProgress from "@/components/visuals/ScrollProgress";

export default function Home() {
  return (
    <>
      <Navbar />
      <ScrollProgress />
      <AmbientGlow />
      <CursorTrail />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <Why />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
