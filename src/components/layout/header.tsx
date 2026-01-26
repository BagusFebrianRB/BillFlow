"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
  userName?: string;
  avatarUrl?: string | null;
}

export default function Header({ userName, avatarUrl }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1">
          {/* Search atau breadcrumb bisa ditambah di sini */}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="avatar"
                    className="rounded-full object-contain"
                    width={32}
                    height={32}
                  />
                ) : (
                  <User className="h-4 w-4 text-teal-600" />
                )}
              </div>
              <span className="text-sm font-medium">{userName}</span>
              <div>
                <ChevronDown />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action="/auth/signout" method="post">
              <button type="submit" className="w-full">
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
