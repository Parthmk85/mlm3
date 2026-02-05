"use client";

import { Users, UserPlus, Copy, Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Team() {
    const { language } = useLanguage();
    const t = translations[language];
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (session) {
            fetch("/api/user/me")
                .then(res => res.json())
                .then(data => setUserData(data));
        }
    }, [session]);

    const handleCopy = () => {
        if (userData?.referralCode) {
            navigator.clipboard.writeText(userData.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (status === "loading") return <div className="min-h-screen bg-[#f0faf2] flex items-center justify-center font-black text-green-600 animate-pulse uppercase tracking-widest">Loading...</div>;

    if (!session) {
        if (typeof window !== "undefined") router.push("/login");
        return null;
    }

    return (
        <div className="bg-[#f0faf2] min-h-screen p-6 pt-12 pb-24">
            <h1 className="text-2xl font-black text-gray-800 mb-8 uppercase tracking-tight">{t.myTeam}</h1>

            <div className="bg-white border-2 border-green-100 rounded-[2.5rem] p-8 shadow-xl shadow-green-100/20 mb-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">{t.totalMembers}</p>
                            <p className="text-2xl font-black text-gray-800">{userData?.teamCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Referral Code</p>
                        <p className="text-lg font-black text-green-700 font-mono tracking-widest">{userData?.referralCode || '------'}</p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`p-3 rounded-xl transition-all active:scale-90 ${copied ? 'bg-green-600 text-white' : 'bg-white text-gray-400 shadow-sm'}`}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                </div>

                <div className="border-t border-gray-50 pt-8 mt-8">
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Team Members List</h2>
                    <div className="space-y-3">
                        {userData?.teamMembers && userData.teamMembers.length > 0 ? (
                            userData.teamMembers.map((member, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{member.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{member.phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2')}</p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${member.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {member.status}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100">
                                <p className="text-center text-gray-400 text-xs font-medium italic leading-relaxed">
                                    {t.noReferralsYet}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
