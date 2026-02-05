"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { translations } from "@/lib/translations";

const LanguageModal = ({ isOpen, onClose }) => {
    const { language, changeLanguage } = useLanguage();
    const t = translations[language];

    if (!isOpen) return null;

    const languages = [
        { code: "en", name: "English", label: "US" },
        { code: "ar", name: "العربية", label: "AE" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />

            {/* Modal / Bottom Sheet */}
            <div className="relative w-full max-w-[450px] bg-white rounded-t-[2.5rem] shadow-2xl p-6 pb-10 animate-slide-up">
                <div className="w-12 h-0.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="text-xl font-bold text-gray-800">
                        {t.selectLanguage}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 active:scale-90 transition-all font-light"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                changeLanguage(lang.code);
                                onClose();
                            }}
                            className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all active:scale-[0.98] ${language === lang.code
                                ? "bg-green-50/50 border-2 border-green-600 shadow-sm"
                                : "bg-gray-50/80 border-2 border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-bold text-gray-400 w-8 text-left uppercase tracking-tight">
                                    {lang.label}
                                </span>
                                <span className={`text-lg font-bold ${language === lang.code ? "text-green-700" : "text-gray-700"}`}>
                                    {lang.name}
                                </span>
                            </div>
                            {language === lang.code && (
                                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
        </div>
    );
};

export default LanguageModal;
