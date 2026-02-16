import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ServiceGrid from "@/components/ServiceGrid";
import SessionFlow from "@/components/SessionFlow";
import Pricing from "@/components/Pricing";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import Info from "@/components/Info";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { fetchServices } from "@/lib/fetch-services";

// リクエスト毎にサーバーサイドレンダリング（ビルド時の空データキャッシュを防ぐ）
export const dynamic = "force-dynamic";

export default async function Home() {
  const services = await fetchServices();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <ServiceGrid services={services} />
      <SessionFlow />
      <Pricing />
      <AvailabilityCalendar />
      <Info />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
