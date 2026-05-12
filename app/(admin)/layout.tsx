"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  HelpCircle, 
  MessageSquare, 
  Tag, 
  Activity, 
  LayoutDashboard,
  LogOut 
} from "lucide-react";

const SidebarItem = ({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) => (
  <Link
    href={href}
    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we are on the login page
    if (pathname === "/admin-login") {
      setIsLoading(false);
      return;
    }

    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin-login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin-login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Don't show sidebar on login page
  if (pathname === "/admin-login") {
    return <>{children}</>;
  }

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/users", icon: Users, label: "Users" },
    { href: "/dashboard/questions", icon: HelpCircle, label: "Questions" },
    { href: "/dashboard/answers", icon: MessageSquare, label: "Answers" },
    { href: "/dashboard/tags", icon: Tag, label: "Tags" },
    { href: "/dashboard/interactions", icon: Activity, label: "Interactions" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-gray-900/50 backdrop-blur-xl">
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
              T
            </div>
            <span className="text-xl font-bold tracking-tight">Taiba Admin</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.href} 
                {...item} 
                active={pathname === item.href} 
              />
            ))}
          </nav>

          <div className="mt-auto border-t border-white/5 pt-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
