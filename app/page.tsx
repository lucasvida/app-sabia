import { HomeHeader } from "@/components/home/HomeHeader";
import { NewHeroSection } from "@/components/home/NewHeroSection";
import { HeroImage } from "@/components/home/HeroImage";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
      <HomeHeader />
      
      {/* Hero Section */}
      <main className="flex-1 pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start min-h-[60vh]">
          <NewHeroSection />
          <div className="relative w-full flex items-center justify-center lg:justify-end">
            <HeroImage />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
