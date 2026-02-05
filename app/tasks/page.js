"use client";

import { ClipboardList, Lock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
    const { language } = useLanguage();
    const t = translations[language];
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (session) {
            fetch("/api/user/me")
                .then(res => res.json())
                .then(data => setUserData(data));
        }
    }, [session]);

    if (status === "loading") return <div className="min-h-screen bg-[#f0faf2] flex items-center justify-center font-black text-green-600 animate-pulse uppercase tracking-widest">Loading...</div>;

    if (!session) {
        if (typeof window !== "undefined") router.push("/login");
        return null;
    }

    if (session.user.role === "admin") {
        return (
            <div className="bg-[#f0faf2] min-h-screen p-6 flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-100/50 border-4 border-white animate-bounce-slow">
                    <ClipboardList size={48} />
                </div>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">No task for admin</h1>
                <p className="text-gray-500 text-center text-sm font-medium">Administrators do not participate in daily tasks.</p>
                <button
                    onClick={() => router.push("/admin")}
                    className="mt-6 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-green-200 active:scale-95 transition-all"
                >
                    Go To Admin Panel
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#f0faf2] min-h-screen p-6 pt-12 pb-24">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-100/50 border-4 border-white">
                    <ClipboardList size={40} />
                </div>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{t.availableTasks}</h1>
                <p className="text-gray-500 text-center text-sm font-medium">{t.unlockVipToEarn}</p>

                <div className="w-full mt-8 space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => {
                        const isUnlocked = userData && userData.vipLevel >= i;
                        return (
                            <div key={i} className={`p-6 rounded-[2rem] shadow-sm border flex items-center justify-between transition-all ${isUnlocked ? 'bg-white border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl border ${isUnlocked ? 'bg-green-50 border-green-100 text-green-600' : 'bg-gray-100 border-gray-100 text-gray-400'}`}>
                                        {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>{t.dailyTask} {i}</h3>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                            {isUnlocked ? <span className="text-green-600">Active Task</span> : `${t.unlockVipToAccess} VIP ${i}`}
                                        </p>
                                    </div>
                                </div>
                                {isUnlocked && (
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-200 active:scale-95 transition-all">
                                        START
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
