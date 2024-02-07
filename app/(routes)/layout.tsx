import { Navbar } from "@/components/system/Navbar";
import { Footer } from "@/components/system/Footer";
import { Sidebar } from "@/components/system/Sidebar";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-full">{children}</div>
      <Footer />
    </>
  );
};
export default PublicLayout;
