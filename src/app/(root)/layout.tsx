import { Navbar } from "@/components/layout/Navbar";



const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <Navbar/>
      <div className="flex-1">
        {children}
      </div>
      
    </>
  );
};

export default RootLayout;
