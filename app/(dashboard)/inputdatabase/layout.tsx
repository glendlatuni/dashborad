
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./navbar";

export default function InputDatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" m-4">
        <Navbar />
      </div>
      <div className="mt-8">
        
      {children}
   <Toaster/>
      </div>
    </>
  );
}
