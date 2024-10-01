"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
    }
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center flex-1 max-w-xl w-full">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search data"
            className="pl-10 pr-4 py-2 w-full rounded-full transition-all duration-300 focus:ring-2 focus:ring-blue-300"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-4">
  {user ? (
    <Avatar>
      <AvatarImage src={user.profilePicture} alt={user.Member.FullName} />
      <AvatarFallback>{user.Member.FullName.charAt(0)}</AvatarFallback>
    </Avatar>
  ) : (
    <>
      <Link href="/login">
        <Button
          variant="outline"
          className="rounded-full transition-all duration-300 hover:bg-gray-100"
        >
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button className="rounded-full transition-all duration-300 hover:bg-blue-600">
          Sign up
        </Button>
      </Link>
    </>
  )}
</div>
<div className="md:hidden">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {user ? (
        <>
        
        <Avatar>
          <AvatarImage src={user.profilePicture} alt={user.Member.FullName} />
          <AvatarFallback>{user.Member.FullName.charAt(0)}</AvatarFallback>
        </Avatar>
        </>
      ) : (
        <Button variant="ghost" size="icon" className="rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </Button>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {user ? (
        <>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="w-full">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="w-full">
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {/* Add logout logic here */}}>
            Logout
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuItem asChild>
            <Link href="/login" className="w-full">
              Login
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/register" className="w-full">
              Sign up
            </Link>
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
</div>
    </nav>
  );
}
