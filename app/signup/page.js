"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus, Phone, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const t = translations[language];
    const ref = searchParams.get("ref") || "";

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        referredBy: ref,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imgError, setImgError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?signup=success");
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Signup error details:", err);
            setError("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 pt-12">
            <div className="flex flex-col items-center mb-10">
                <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center mb-4 shadow-xl shadow-green-100 overflow-hidden border border-gray-100">
                    {!imgError ? (
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="text-green-600 bg-green-50 w-full h-full flex items-center justify-center">
                            <UserPlus size={48} />
                        </div>
                    )}
                </div>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{t.createAccount}</h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">{t.signup} {t.home}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="relative">
                    <UserIcon className="absolute ltr:left-3 rtl:right-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="name"
                        placeholder={t.name}
                        required
                        className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                        onChange={handleChange}
                        value={formData.name}
                    />
                </div>

                <div className="relative">
                    <Phone className="absolute ltr:left-3 rtl:right-3 top-3 text-gray-400" size={20} />
                    <input
                        type="tel"
                        name="phone"
                        placeholder={t.phone}
                        required
                        className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                        onChange={handleChange}
                        value={formData.phone}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute ltr:left-3 rtl:right-3 top-3 text-gray-400" size={20} />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={t.password}
                        required
                        className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-12 rtl:pl-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                        onChange={handleChange}
                        value={formData.password}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute ltr:right-3 rtl:left-3 top-3 text-gray-400 hover:text-green-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="relative">
                    <UserPlus className="absolute ltr:left-3 rtl:right-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        name="referredBy"
                        placeholder={t.referral}
                        className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                        onChange={handleChange}
                        value={formData.referredBy}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all disabled:opacity-70 mt-4"
                >
                    {loading ? "..." : t.signup}
                </button>
            </form>

            <div className="mt-8 text-center text-gray-600 text-xs">
                {t.alreadyHaveAccount}{" "}
                <Link href="/login" className="text-green-600 font-bold uppercase tracking-wider">
                    {t.login}
                </Link>
            </div>
        </div>
    );
}

export default function Signup() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}

