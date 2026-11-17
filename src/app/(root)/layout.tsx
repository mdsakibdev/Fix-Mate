import { Navbar } from "@/components/layout/Navbar";


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <Navbar/>
      {children}
    </>
  );
};

export default RootLayout;
