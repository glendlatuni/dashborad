import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Database, Eye } from "lucide-react";

const menuItems = [
  { icon: Calendar, label: "Create Schedule", href: "/createschedule" },
  { icon: Database, label: "Input Database", href: "/inputdatabase" },
  { icon: Eye, label: "View Data", href: "/viewdata" },
];

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col text-black shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold lg:text-2xl whitespace-nowrap">
          <span className="hidden sm:hidden md:hidden lg:inline">WorshipLink</span>
          <span className="inline sm:inline md:inline lg:hidden">WL</span>
        </h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h2 className="mb-2 text-lg font-semibold tracking-tight hidden lg:block">
            Menu
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    "hover:bg-black hover:text-white",
                    "focus:bg-black  focus:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="ml-2 hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}