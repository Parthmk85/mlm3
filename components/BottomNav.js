"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, User, ClipboardList, Gem } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language];
  const [imgError, setImgError] = useState(false);

  const navItems = [
    { label: t.home, icon: Home, href: "/" },
    { label: t.tasks, icon: ClipboardList, href: "/tasks" },
    { label: t.team, icon: Users, href: "/team" },
    { label: t.vip, icon: Gem, href: "/vip" },
    { label: t.me, icon: User, href: "/profile" },
  ];

  // Hide nav on admin pages or login/signup if needed, 
  // but for now let's keep it global as per the prompt.
  const isHidden = pathname === "/login" || pathname === "/signup";

  if (isHidden) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50 max-w-[450px] mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              isActive ? "text-green-600" : "text-gray-400 hover:text-green-500"
            )}
          >
            {item.label === "Me" ? (
              <div className={cn(
                "w-7 h-7 rounded-full overflow-hidden border-2 shadow-sm transition-all flex items-center justify-center bg-gray-50",
                isActive ? "border-green-600 scale-110" : "border-white"
              )}>
                {!imgError ? (
                  <img
                    src="/avatar.jpg"
                    alt="Me"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-green-600">
                    <User size={16} />
                  </div>
                )}
              </div>
            ) : (
              <Icon size={24} />
            )}
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
