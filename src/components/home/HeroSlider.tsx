"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
    label: "Smartphone Repair",
  },
  {
    src: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80",
    label: "Laptop & PC Service",
  },
  {
    src: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1000&q=80",
    label: "AC Service & Repair",
  },
  {
    src: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1000&q=80",
    label: "Refrigerator Repair",
  },
  {
    src: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80",
    label: "TV Repair & Mounting",
  },
  {
    src: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1000&q=80",
    label: "Washing Machine Repair",
  },
  {
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
    label: "Electrical Service",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-3xl sm:h-105 lg:h-125">
      {slides.map((slide, index) => (
        <div
          key={slide.label}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.label}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Service name of the current slide */}
      <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">
        {slides[current].label}
      </span>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            aria-label={`Show ${slide.label}`}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === current
                ? "w-6 bg-[rgb(249,115,22)]"
                : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
