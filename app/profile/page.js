"use client";

import { signOut, useSession } from "next-auth/react";
import { User, LogOut, Settings, Shield, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language];
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status]);

    if (status === "loading") {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t.me}</h1>

            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center overflow-hidden mb-4 border-4 border-white shadow-lg relative bg-white">
                    {!imgError ? (
                        <img
                            src="/avatar.jpg"
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="text-green-600">
                            <User size={48} />
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{session?.user?.name}</h2>
                <p className="text-gray-500 text-sm font-medium">{session?.user?.phone}</p>
                <span className="mt-2 bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {session?.user?.status === 'active' ? t.activeMember : t.pendingMember}
                </span>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-2 shadow-sm space-y-1">
                {[
                    { label: 'Security Settings', icon: Shield },
                    { label: 'Notifications', icon: Bell },
                    { label: 'Application Defaults', icon: Settings },
                ].map((item, i) => (
                    <button key={i} className="w-full flex items-center p-4 hover:bg-gray-50 rounded-2xl transition-all">
                        <item.icon className="text-gray-400 ltr:mr-4 rtl:ml-4" size={20} />
                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    </button>
                ))}

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center p-4 hover:bg-red-50 rounded-2xl transition-all text-red-600"
                >
                    <LogOut className={language === 'ar' ? "ml-4" : "mr-4"} size={20} />
                    <span className="text-sm font-bold">{t.logout}</span>
                </button>
            </div>
        </div>
    );
}
