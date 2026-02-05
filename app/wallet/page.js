"use client";

import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/lib/translations";

export default function Wallet() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t.balance}</h1>

            <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl mb-8 relative overflow-hidden">
                <p className="text-gray-400 text-sm mb-1">Available for Withdrawal</p>
                <h2 className="text-4xl font-extrabold mb-6">{t.currencySymbol}0.00</h2>
                <div className="flex gap-4">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex-1 transition-all">
                        {t.withdraw}
                    </button>
                </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-4 text-lg">Transactions</h3>
            <div className="space-y-4">
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">No transaction history found</p>
                </div>
            </div>
        </div>
    );
}

