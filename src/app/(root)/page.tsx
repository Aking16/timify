import CtaSection from "@/app/(root)/components/cta-section";
import FeaturesSection from "@/app/(root)/components/features-section";
import HeroSection from "@/app/(root)/components/hero-section";
import HowItWorksSection from "@/app/(root)/components/how-it-works-section";
import LandingFooter from "@/app/(root)/components/landing-footer";
import LandingNav from "@/app/(root)/components/landing-nav";

export default function Home() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
