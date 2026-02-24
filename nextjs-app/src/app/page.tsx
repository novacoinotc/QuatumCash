import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Why from "@/components/sections/Why";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import SectionTransition from "@/components/ui/SectionTransition";
import AmbientGlow from "@/components/visuals/AmbientGlow";
import CursorTrail from "@/components/visuals/CursorTrail";
import ColorShiftProvider from "@/components/visuals/ColorShiftProvider";

export default function Home() {
  return (
    <>
      <Navbar />
      <AmbientGlow />
      <CursorTrail />
      <ColorShiftProvider />
      <main>
        <Hero />
        <SectionTransition variant="top" />
        <About />
        <SectionTransition variant="frame" />
        <Stats />
        <SectionTransition variant="curtain" />
        <Services />
        <SectionTransition variant="top" />
        <Why />
        <SectionTransition variant="frame" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
