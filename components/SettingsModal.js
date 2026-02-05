"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

export default function SettingsModal({ isOpen, onClose, settingKey, initialValue, onSave }) {
    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: settingKey, value }),
            });
            if (res.ok) {
                onSave(settingKey, value);
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Edit Element</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{settingKey.replace(/_/g, ' ')}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-8">
                    <textarea
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-green-500 transition-all min-h-[120px]"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter new value..."
                    />

                    <button
                        disabled={loading}
                        onClick={handleSave}
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "SAVING..." : <><Save size={20} /> SAVE CHANGES</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
