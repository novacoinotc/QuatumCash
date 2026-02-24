import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Why from "@/components/sections/Why";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Stats />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Why />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
