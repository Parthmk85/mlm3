"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";

export default function Login() {
    const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language];
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
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
            const res = await signIn("credentials", {
                phone: formData.phone,
                password: formData.password,
                redirect: false,
            });

            if (res.error) {
                setError("Invalid phone number or password");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 pt-20">
            <div className="flex flex-col items-center mb-10">
                <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-green-100 overflow-hidden border border-gray-100">
                    {!imgError ? (
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="text-green-600 bg-green-50 w-full h-full flex items-center justify-center">
                            <LogIn size={48} />
                        </div>
                    )}
                </div>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{t.welcomeBack}</h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">{t.login} {t.home}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all disabled:opacity-70 mt-4"
                >
                    {loading ? "..." : t.login}
                </button>
            </form>

            <div className="mt-8 text-center text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-600 font-bold">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}
