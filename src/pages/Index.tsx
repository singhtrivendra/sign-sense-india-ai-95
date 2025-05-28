
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksPreview from "@/components/home/HowItWorksPreview";
import DemoPreview from "@/components/home/DemoPreview";
import CtaSection from "@/components/home/CtaSection";
import AIHelperBot from "@/components/AIHelperBot";

export default function Index() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksPreview />
      <DemoPreview />
      <CtaSection />
      <AIHelperBot/>
    </div>
  );
}
