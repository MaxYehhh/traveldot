'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('請檢查您的信箱以驗證帳號！');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error: any) {
            setMessage(error.message || '發生錯誤');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="glass-panel p-8 rounded-3xl w-full max-w-md space-y-6 bg-white/80 shadow-xl border-slate-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold gradient-text">
                        {isSignUp ? '加入 TravelDot' : '歡迎回來'}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {isSignUp ? '開始紀錄您的全球足跡' : '繼續您的旅行故事'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">電子郵件</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">密碼</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all rounded-xl font-bold text-lg text-white shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? '處理中...' : isSignUp ? '立即註冊' : '登入帳號'}
                    </button>
                </form>

                {message && (
                    <div className={`p-4 rounded-xl text-sm text-center ${message.includes('檢查') ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                        {message}
                    </div>
                )}

                <div className="text-center pt-2">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                    >
                        {isSignUp ? '已經有帳號了？點此登入' : '還沒有帳號？立即註冊'}
                    </button>
                </div>
            </div>
        </div>
    );
}
