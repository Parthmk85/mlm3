"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";
import LanguageModal from "@/components/LanguageModal";
import SettingsModal from "@/components/SettingsModal";
import {
  Package,
  ArrowDownToLine,
  Smartphone,
  FileText,
  UserPlus,
  Users,
  Volume2,
  Lock,
  Unlock,
  Play,
  ArrowRight,
  Globe,
  CheckCircle2,
  User as UserIcon,
  Wallet,
  Settings as SettingsIcon,
  Edit2
} from "lucide-react";

const VIPCard = ({ level, amount, locked = true, t }) => (
  <div className={`rounded-xl overflow-hidden shadow-sm border transition-all active:scale-95 ${locked ? 'bg-white border-gray-100 opacity-90' : 'bg-green-50 border-green-200 ring-1 ring-green-200'}`}>
    <div className={`aspect-[4/3] relative flex items-center justify-center overflow-hidden ${locked ? 'bg-gray-200' : 'bg-green-100'}`}>
      {/* Background Graphic */}
      <div className={`w-24 h-24 rounded-full flex items-center justify-center relative ${locked ? 'bg-gray-400' : 'bg-green-600'}`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute inset-0 bg-white" style={{
              transform: `rotate(${i * 22.5}deg)`,
              clipPath: 'polygon(48% 0, 52% 0, 52% 100%, 48% 100%)'
            }}></div>
          ))}
        </div>
        <div className="bg-white p-2 rounded-lg shadow-inner z-10">
          {locked ? <Lock size={20} className="text-gray-800" /> : <CheckCircle2 size={24} className="text-green-600" />}
        </div>
      </div>
    </div>
    <div className="p-3">
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{t.unlockAmount}</div>
      <div className={`text-sm font-black ${locked ? 'text-gray-700' : 'text-green-700'}`}>₹{amount.toFixed(2)}</div>
      <div className={`text-[10px] mt-1 uppercase font-black tracking-widest flex items-center gap-1 ${locked ? 'text-gray-400' : 'text-green-600'}`}>
        {t.vip} {level} {!locked && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
      </div>
    </div>
  </div>
);

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, changeLanguage } = useLanguage();
  const t = translations[language];
  const [userData, setUserData] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [appSettings, setAppSettings] = useState({});
  const [editModal, setEditModal] = useState({ open: false, key: '', value: '' });

  useEffect(() => {
    if (session) {
      if (session.user.status === "pending" && session.user.role !== "admin") {
        router.push("/pay");
      } else {
        fetchUserData();
        fetchSettings();
      }
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setAppSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditor = (key, defaultValue) => {
    if (session?.user?.role !== "admin") return;
    setEditModal({ open: true, key, value: appSettings[key] || defaultValue });
  };

  const handleSaveSetting = (key, value) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const quickActions = [
    { label: t.package, icon: Package, image: "https://dltr-mall.top/static/img/index/hall/8.png" },
    { label: t.withdraw, icon: ArrowDownToLine, image: "https://dltr-mall.top/static/img/index/hall/1.png" },
    { label: t.app, icon: Smartphone, image: "https://dltr-mall.top/static/img/index/hall/2.png" },
    { label: t.companyProfile, icon: FileText, image: "https://dltr-mall.top/static/img/index/hall/3.png" },
    { label: t.inviteFriends, icon: UserPlus, image: "https://dltr-mall.top/static/img/index/hall/4.png" },
    { label: t.agencyCoop, icon: Users, image: "https://dltr-mall.top/static/img/index/hall/5.png" },
  ];

  const vipLevels = [
    { level: 1, amount: 1100.00 },
    { level: 2, amount: 4600.00 },
    { level: 3, amount: 13800.00 },
    { level: 4, amount: 48000.00 },
    { level: 5, amount: 120000.00 },
    { level: 6, amount: 360000.00 },
  ];

  const memberList = [
    { email: "yan******@rediffmail.com", amount: 150.00, vip: 1 },
    { email: "low******@gmail.com", amount: 108000.00, vip: 6 },
    { email: "abc******@icloud.com", amount: 1400.00, vip: 3 },
    { email: "cool******@yahoo.com", amount: 600.00, vip: 2 },
  ];

  if (status === "loading") return <div className="min-h-screen bg-[#f0faf2] flex items-center justify-center font-black text-green-600 animate-pulse uppercase tracking-[0.2em]">Loading...</div>;

  if (!session) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="bg-[#f0faf2] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#c2f2d0] p-4 flex justify-between items-center rounded-b-[2rem]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">{userData?.name || t.dollarTree}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="bg-green-600 text-white p-0.5 rounded-full">
                <Wallet size={8} />
              </div>
              <p className="text-[10px] text-green-700 font-bold">₹{userData?.walletBalance?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <SettingsIcon size={16} />
            </button>
          )}
          <button
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-gray-800 border border-green-200 shadow-sm transition-all active:scale-95"
          >
            <Globe size={14} className="text-green-600" /> {language === "en" ? "English" : "العربية"}
          </button>
          <div
            onClick={() => router.push("/profile")}
            className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden cursor-pointer active:scale-90 transition-all flex items-center justify-center bg-green-50"
          >
            {!imgError ? (
              <img
                src="/avatar.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 -mt-2 group/banner relative">
        <div className="w-full h-40 bg-green-100 rounded-2xl overflow-hidden relative shadow-lg shadow-green-100">
          <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-green-600/20 to-transparent z-10"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-6 z-20">
            <h2 className="text-2xl font-black text-green-800 mb-1 italic text-shadow-sm">
              {appSettings.home_banner_title || t.dollarTree}
            </h2>
            <p className="bg-green-600 text-white text-[10px] py-0.5 px-2 rounded inline-block w-fit font-bold">
              {appSettings.home_banner_label || t.everythingIs}
            </p>
          </div>
          <div className="absolute ltr:right-0 rtl:left-0 top-0 bottom-0 w-1/2 bg-green-600/10 flex items-center justify-center">
            <Package size={80} className="text-green-600/30 -rotate-12 rtl:rotate-12" />
          </div>
        </div>
        {isAdmin && (
          <div className="absolute top-2 right-6 opacity-0 group-hover/banner:opacity-100 transition-opacity flex gap-2">
            <button onClick={() => openEditor('home_banner_title', t.dollarTree)} className="bg-white/80 p-2 rounded-full shadow-lg text-green-600"><Edit2 size={14} /></button>
            <button onClick={() => openEditor('home_banner_label', t.everythingIs)} className="bg-white/80 p-2 rounded-full shadow-lg text-green-600"><Edit2 size={14} /></button>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-y-6 gap-x-2 p-6">
        {quickActions.map((action, i) => (
          <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => (action.label === "Invite Friends" || action.label === t.inviteFriends || action.label === t.withdraw) && router.push("/profile")}>
            <div className={`bg-green-100 w-14 h-14 rounded-full flex items-center justify-center text-green-600 shadow-sm group-active:scale-95 transition-all overflow-hidden`}>
              {action.image ? (
                <img src={action.image} alt={action.label} className="w-full h-full object-contain p-2" />
              ) : (
                <action.icon size={26} />
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight whitespace-pre-wrap">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Notification Bar */}
      <div className="px-4 mb-6 group/news relative">
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm border border-white overflow-hidden">
          <div className="text-green-600 bg-green-50 ltr:p-1.5 rtl:p-1.5 rounded-lg flex-shrink-0">
            <Volume2 size={16} />
          </div>
          <div className="flex-1 overflow-hidden h-5">
            <p className="text-xs text-gray-500 animate-marquee whitespace-nowrap">
              {appSettings.home_welcome_msg || t.welcomeTo}
            </p>
          </div>
          {isAdmin && (
            <button onClick={() => openEditor('home_welcome_msg', t.welcomeTo)} className="opacity-0 group-hover/news:opacity-100 bg-white p-1 rounded-full shadow-md text-green-600 ml-2 transition-opacity flex-shrink-0"><Edit2 size={12} /></button>
          )}
        </div>
      </div>

      {/* Task Hall */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">{t.taskHall}</h3>
          <ArrowRight size={16} className="text-gray-400 rtl:rotate-180" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {vipLevels.map((vip) => (
            <VIPCard
              key={vip.level}
              level={vip.level}
              amount={vip.amount}
              t={t}
              locked={isAdmin ? false : (userData ? (userData.vipLevel < vip.level) : true)}
            />
          ))}
        </div>
      </div>

      {/* Platform Introduction */}
      <div className="px-4 mb-8">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 px-1">{t.platformIntro}</h3>
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-hidden relative group">
          <div className="aspect-video bg-gray-900 rounded-xl relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
              <Play size={24} className="text-white fill-white ml-1" />
            </div>
            <div className="absolute bottom-4 ltr:left-4 rtl:right-4 z-20">
              <p className="text-white text-xs font-bold">About Dollar Tree Business</p>
            </div>
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="px-4 mb-8">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 px-1">{t.memberList}</h3>
        <div className="space-y-2">
          {memberList.map((member, i) => (
            <div key={i} className="bg-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm border border-gray-50">
              <div className="bg-green-600 text-white p-1 rounded-full text-[8px] font-bold w-10 text-center h-5 flex items-center justify-center">
                VIP {member.vip}
              </div>
              <div className="flex-1 text-[11px] font-medium text-gray-600 truncate">{member.email}</div>
              <div className="text-xs font-black text-gray-800 bg-gray-50 px-2 py-1 rounded-lg">
                +₹{member.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Authority */}
      <div className="px-4 mb-12">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 px-1">{t.regulatory}</h3>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-around w-full">
              <div className="w-16 h-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                <img src="https://dltr-mall.top/static/img/index/regulatory/1.png" alt="Regulatory 1" className="w-full h-full object-contain" />
              </div>
              <div className="w-16 h-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                <img src="https://dltr-mall.top/static/img/index/regulatory/2.png" alt="Regulatory 2" className="w-full h-full object-contain" />
              </div>
              <div className="w-16 h-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                <img src="https://dltr-mall.top/static/img/index/regulatory/3.png" alt="Regulatory 3" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed">
              Dollar Tree is regulated by international financial authorities to ensure safe and legal operations for all members.
            </p>
          </div>
        </div>
      </div>

      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />

      {isAdmin && (
        <SettingsModal
          isOpen={editModal.open}
          onClose={() => setEditModal({ ...editModal, open: false })}
          settingKey={editModal.key}
          initialValue={editModal.value}
          onSave={handleSaveSetting}
        />
      )}
    </div>
  );
}
