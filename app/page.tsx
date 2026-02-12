import { BackgroundDecoration } from "@/components/home/BackgroundDecoration";
import { HeroSection } from "@/components/home/HeroSection";
import { LoginCard } from "@/components/home/LoginCard";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundDecoration />
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center z-10">
        <HeroSection />
        <LoginCard />
      </main>
    </div>
  );
}
