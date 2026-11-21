import { Hero } from "@/components/home/HeroSection";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FaqSection } from "@/components/home/FaqSection";
import { TopRatedServices } from "@/components/home/TopRatedServices";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <main>
      <Reveal>
        <Hero />
      </Reveal>
      <Reveal>
        <FeaturedServices />
      </Reveal>
      <Reveal>
        <TopRatedServices />
      </Reveal>
      <Reveal>
        <FaqSection />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <PopularCategories />
      </Reveal>
      <Reveal>
        <WhyChooseUs />
      </Reveal>
    </main>
  );
}
