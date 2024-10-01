'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NavBar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Schedule', href: '/inputdatabase/schedule' },
    { name: 'Family', href: '/inputdatabase/inputfamily' },
    { name: 'Member', href: '/inputdatabase/inputmember' },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      {navItems.map((item, index) => (
        <React.Fragment key={item.name}>
          <Link 
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "bg-muted"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Button>
          </Link>
          {index < navItems.length - 1 && (
            <Separator orientation="vertical" className="h-6" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default NavBar;