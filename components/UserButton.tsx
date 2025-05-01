"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "./providers/AuthProvider";
import { Button } from "./ui/button";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function UserButton() {
  const { user, signOut, isLoaded } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  // Add local state to preserve user data during updates
  const [localUser, setLocalUser] = useState(user);

  // Update local user when auth user changes, but only if it's a significant change
  useEffect(() => {
    if (user) {
      setLocalUser(prev => {
        // If no previous data or email changed (indicating a true user change)
        if (!prev || prev.email !== user.email) {
          return user;
        }
        // For updates to the same user account, prefer existing local data if available
        return {
          ...user,
          name: prev.name || user.name,
          image: prev.image || user.image
        };
      });
    } else {
      setLocalUser(null);
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <Avatar className="h-8 w-8 border">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    );
  }

  if (!localUser) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/signin">Sign In</Link>
      </Button>
    );
  }

  const userInitials = localUser.name
    ? localUser.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
    : localUser.email?.charAt(0).toUpperCase();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={localUser.image || ""} alt={localUser.name || "User"} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {localUser.name && <p className="font-medium">{localUser.name}</p>}
            {localUser.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {localUser.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}