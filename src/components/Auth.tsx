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
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="glass-panel p-8 rounded-3xl w-full max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold gradient-text">
                        {isSignUp ? '加入 TravelDot' : '歡迎回來'}
                    </h2>
                    <p className="text-slate-400 mt-2">
                        {isSignUp ? '開始紀錄您的全球足跡' : '繼續您的旅行故事'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">電子郵件</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">密碼</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? '處理中...' : isSignUp ? '立即註冊' : '登入帳號'}
                    </button>
                </form>

                {message && (
                    <div className={`p-4 rounded-xl text-sm text-center ${message.includes('檢查') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {message}
                    </div>
                )}

                <div className="text-center pt-2">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        {isSignUp ? '已經有帳號了？點此登入' : '還沒有帳號？立即註冊'}
                    </button>
                </div>
            </div>
        </div>
    );
}
