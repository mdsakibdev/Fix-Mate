import { Hero } from "@/components/home/HeroSection";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FaqSection } from "@/components/home/FaqSection";


export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedServices />
      <FaqSection />
      <HowItWorks />
      <PopularCategories /> 
      <WhyChooseUs />
    </main>
  );
}
