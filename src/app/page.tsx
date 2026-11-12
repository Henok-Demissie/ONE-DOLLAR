import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { DonationSection } from '@/components/sections/DonationSection';
import { HireMeSection } from '@/components/sections/HireMeSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SupportersWall } from '@/components/sections/SupportersWall';
import { PortfolioSection } from '@/components/sections/PortfolioSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <DonationSection />
        <HireMeSection />
        <AboutSection />
        <SupportersWall />
        <PortfolioSection />
      </main>
      <Footer />
    </div>
  );
}
