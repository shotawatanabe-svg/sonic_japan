import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ServiceGrid from "@/components/ServiceGrid";
import SessionFlow from "@/components/SessionFlow";
import Pricing from "@/components/Pricing";
import Info from "@/components/Info";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <ServiceGrid />
      <SessionFlow />
      <Pricing />
      <Info />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
