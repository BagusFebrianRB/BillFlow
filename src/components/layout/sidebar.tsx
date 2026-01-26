"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
];

// 1. Define Types for your Menu Items
interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

interface ActionItem {
  name: string;
  icon: React.ElementType;
  action: string;
}

type MenuItem = NavItem | ActionItem;

const general: MenuItem[] = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  {
    name: "Logout",
    action: "/auth/signout",
    icon: LogOut,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900">BillFlow</span>
        </Link>
      </div>

      {/* Main Menu Label */}
      <div className="flex items-center px-6 pt-4">
        <span className="text-xs font-semibold text-slate-500">MAIN MENU</span>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "font-bold text-teal-500 bg-slate-100"
                  : "text-slate-500 hover:bg-slate-100",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-teal-500" : "text-slate-500",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* General Label */}
      <div className="flex items-center px-6">
        <span className="text-xs font-semibold text-slate-500">GENERAL</span>
      </div>

      {/* General Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {general.map((item) => {
          // TYPE GUARD
          if ("href" in item) {
            // Settings (Link)
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "font-bold text-teal-500 bg-slate-100"
                    : "text-slate-500 hover:bg-slate-100",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-teal-500" : "text-slate-500",
                  )}
                />
                {item.name}
              </Link>
            );
          } else {
            // Logout (Form)
            return (
              <form key={item.name} action={item.action} method="post">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </button>
              </form>
            );
          }
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-slate-500">© 2026 BillFlow</div>
      </div>
    </div>
  );
}
