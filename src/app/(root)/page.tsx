import { Hero } from "@/components/home/HeroSection";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FaqSection } from "@/components/home/FaqSection";
import { TopRatedServices } from "@/components/home/TopRatedServices";


export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedServices />
      <TopRatedServices />
      <FaqSection />
      <HowItWorks />
      <PopularCategories /> 
      <WhyChooseUs />
    </main>
  );
}
