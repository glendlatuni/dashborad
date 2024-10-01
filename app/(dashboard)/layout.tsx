import Sidebar from "@/components/Menu";
import Navbar from "@/components/Navbar";
import React from "react";



export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="h-screen flex">
        {/* Sidebar */}
        {/* left */}
        <div className="w-[15%] md:w-[8%] lg:w-[16%] xl:w-[15%]  ">
          <Sidebar/>
        </div>

        <div className="w-[85%] md:w-[92%] lg:w-[84%] xl:w-[85%]">
          {/* right */}
          <Navbar/>
          {children}
        </div>
      </div>
    </>
  );
}
