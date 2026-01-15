'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Auth } from '@/components/Auth';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { MapPin, Plane, Share2 } from 'lucide-react';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50 text-slate-900">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <nav className="relative z-10 w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <h1 className="text-xl font-bold text-slate-800">TravelDot</h1>
        </div>

        {session && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            登出
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left: Intro Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-medium text-sm">
              ✨ 專屬於您的旅行足跡
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              紀錄您的 <br />
              <span className="gradient-text">世界冒險</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              TravelDot 幫助您在地圖上釘選每一個珍貴回憶。
              無論是巴黎的咖啡廳，或是家附近的公園，都值得被記錄下來。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {session ? (
              <button
                onClick={() => router.push('/map')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
              >
                進入我的地圖 🗺️
              </button>
            ) : (
              <div className="text-sm text-slate-500 italic">
                👇 請在右側登入以開始使用
              </div>
            )}
          </div>

          {/* Features / Tutorial */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-left">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-slate-800">1. 點擊地圖</h3>
              <p className="text-sm text-slate-500 mt-1">直覺操作，點選您去過的任何地方。</p>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <Plane size={20} />
              </div>
              <h3 className="font-bold text-slate-800">2. 寫下回憶</h3>
              <p className="text-sm text-slate-500 mt-1">紀錄心情、上傳照片，保存當下的感動。</p>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-3">
                <Share2 size={20} />
              </div>
              <h3 className="font-bold text-slate-800">3. 分享世界</h3>
              <p className="text-sm text-slate-500 mt-1">可以將筆記設為公開，讓全世界看見您的足跡。</p>
            </div>
          </div>
        </div>

        {/* Right: Auth Form or Decorative Image */}
        <div className="w-full lg:w-[450px]">
          {session ? (
            // Logged In Status Display
            <div className="glass-panel p-8 rounded-3xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 bg-white/60">
              <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                {session.user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">歡迎回來！</h2>
                <p className="text-slate-500 mt-1">{session.user.email}</p>
              </div>
              <button
                onClick={() => router.push('/map')}
                className="w-full py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
              >
                整理您的相簿
              </button>
            </div>
          ) : (
            // Auth Component
            <div className="animate-in fade-in slide-in-from-bottom-8">
              <Auth />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
