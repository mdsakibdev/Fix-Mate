import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Suspense } from "react";




const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <Suspense fallback={<div className="h-16" />}><Navbar /></Suspense>

      <div className="flex-1">
        {children}
      </div>
      <Footer/>
    </>
  );
};

export default RootLayout;
