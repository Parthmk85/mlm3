"use client";

import { Gem, Lock, CheckCircle, Unlock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VIPPage() {
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

    const vips = [
        { level: 1, amount: 1100, income: 150, tasks: 1 },
        { level: 2, amount: 4600, income: 600, tasks: 2 },
        { level: 3, amount: 13800, income: 1400, tasks: 5 },
        { level: 4, amount: 48000, income: 5200, tasks: 8 },
        { level: 5, amount: 120000, income: 14000, tasks: 12 },
        { level: 6, amount: 360000, income: 45000, tasks: 20 },
    ];

    if (status === "loading") return <div className="min-h-screen bg-[#f0faf2] flex items-center justify-center font-black text-green-600 animate-pulse uppercase tracking-widest">Loading...</div>;

    if (!session) {
        if (typeof window !== "undefined") router.push("/login");
        return null;
    }

    return (
        <div className="bg-[#f0faf2] min-h-screen p-6 pt-12 pb-24">
            <div className="flex flex-col items-center justify-center space-y-2 mb-10">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-200 border-4 border-white">
                    <Gem size={36} />
                </div>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{t.vipCenter}</h1>
                <p className="text-sm text-gray-500 font-medium">{t.upgradeEarnMore}</p>
                {userData && (
                    <div className="mt-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-green-100 flex items-center gap-2">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Your Current Level:</span>
                        <span className="text-sm font-black text-gray-800">VIP {userData.vipLevel}</span>
                    </div>
                )}
            </div>

            <div className="grid gap-6">
                {vips.map((vip) => {
                    const isCurrent = userData?.vipLevel === vip.level;
                    const isUnlocked = userData?.vipLevel >= vip.level;
                    return (
                        <div key={vip.level} className={`p-8 rounded-[2.5rem] shadow-sm border relative overflow-hidden transition-all ${isCurrent ? 'bg-green-50 border-green-300 ring-4 ring-green-100' : 'bg-white border-gray-100'}`}>
                            <div className={`absolute top-0 ltr:right-0 rtl:left-0 text-white px-8 py-2 ltr:rounded-bl-[2rem] rtl:rounded-br-[2rem] text-xs font-black tracking-widest uppercase shadow-lg ${isUnlocked ? 'bg-green-600' : 'bg-gray-400'}`}>
                                VIP {vip.level} {isCurrent && " (Current)"}
                            </div>

                            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-baseline gap-1">
                                {t.investment}: <span className="text-green-600">₹{vip.amount}</span>
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <span>{t.dailyIncome}: <b className="text-gray-900">₹{vip.income}</b></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <span>{t.tasksPerDay}: <b className="text-gray-900">{vip.tasks}</b></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <span>{t.totalValidity}: <b className="text-gray-900">365 {t.days}</b></span>
                                </div>
                            </div>

                            <button
                                className={`w-full font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest text-sm ${isCurrent ? 'bg-white text-green-600 border-2 border-green-600' : 'bg-[#16a34a] text-white shadow-green-100'}`}
                                onClick={() => !isCurrent && router.push("/pay")}
                            >
                                {isCurrent ? (
                                    <>CURRENT PLAN <CheckCircle2 size={20} /></>
                                ) : isUnlocked ? (
                                    <>UPGRADE NOW <Unlock size={20} /></>
                                ) : (
                                    <>JOIN NOW <Lock size={20} /></>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
