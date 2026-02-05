"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, X, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("transactions"); // transactions or users

    useEffect(() => {
        if (status === "unauthenticated" || (session && session.user.role !== "admin")) {
            router.push("/");
        } else if (session && session.user.role === "admin") {
            fetchAllData();
        }
    }, [session, status]);

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([fetchTransactions(), fetchUsers()]);
        setLoading(false);
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/transaction");
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const res = await fetch("/api/admin/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: id, status: action }),
            });

            if (res.ok) {
                setTransactions(transactions.filter((t) => t._id !== id));
                fetchUsers(); // Refresh users to see status changes
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-green-600 animate-pulse">ADMIN LOADING...</div>;

    return (
        <div className="p-6 bg-[#f8fafc] min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight italic">Admin Control</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Management Dashboard</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                    <ShieldCheck size={24} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-2xl mb-8 shadow-sm border border-gray-100">
                <button
                    onClick={() => setActiveTab("transactions")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400'}`}
                >
                    Payments ({transactions.length})
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400'}`}
                >
                    Members ({users.length})
                </button>
            </div>

            <div className="space-y-4">
                {activeTab === "transactions" ? (
                    transactions.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 italic">
                            <p className="text-gray-300 font-medium">Clear as crystal. No pending payments.</p>
                        </div>
                    ) : (
                        transactions.map((t) => (
                            <div key={t._id} className="bg-white border border-gray-50 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-black">
                                            {t.userId?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-800 text-sm">{t.userId?.name || "Unknown"}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold">{t.userId?.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-600 font-black text-sm">₹{t.amount}</p>
                                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.1em]">Pending</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                                    <p className="text-[8px] uppercase text-slate-400 font-black tracking-widest mb-1">Transaction Proof (UTR)</p>
                                    <p className="font-mono text-xs font-black text-slate-700 select-all">{t.transactionId}</p>
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={t.screenshotURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-100 transition-all border border-blue-100"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                    <button
                                        onClick={() => handleAction(t._id, "approved")}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                                    >
                                        <Check size={20} /> APPROVE
                                    </button>
                                    <button
                                        onClick={() => handleAction(t._id, "rejected")}
                                        className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    users.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 italic text-gray-300">
                            No members found.
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {users.map((u) => (
                                <div key={u._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${u.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800">{u.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{u.phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${u.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {u.status}
                                        </div>
                                        <p className="text-[8px] text-gray-300 mt-1 italic">Code: {u.referralCode}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
