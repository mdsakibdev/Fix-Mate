import { Hero } from "@/components/home/HeroSection";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";


export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedServices />
      <HowItWorks />
      <PopularCategories /> 
      <WhyChooseUs />
    </main>
  );
}
