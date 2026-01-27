'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { BackgroundMap } from '@/components/BackgroundMap';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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
    <main className="relative w-full min-h-screen overflow-hidden">
      {/* Full-screen Background Map with Overlay */}
      <div className="fixed inset-0 z-0">
        <BackgroundMap />
        {/* 40% Black Overlay for readability */}
        <div className="absolute inset-0 background-overlay" />
      </div>

      {/* Centered Content Container - Strict Vertical Stack */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center gap-10 px-4 py-10 md:gap-14">

        {/* Hero Section - Single TravelDot Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-shadow-strong tracking-tight">
            TravelDot
          </h1>
          <p className="text-xl md:text-2xl text-white/95 text-shadow-soft font-light tracking-widest">
            Every Dot Tells a Story
          </p>
        </div>

        {/* Login/Registration Card - The Focus */}
        {!session ? (
          <div className="glass-card-zen-enhanced w-full max-w-md">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              {isSignUp ? 'Join TravelDot' : 'Welcome Back'}
            </h3>

            <form onSubmit={handleAuth} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="zen-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="zen-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="zen-button-primary"
              >
                {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-3 rounded-xl text-sm text-center ${message.includes('檢查')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                {message}
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card-zen-enhanced w-full max-w-md text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4">
              {session.user.email?.[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-700 mb-6">{session.user.email}</p>
            <button
              onClick={() => router.push('/map')}
              className="zen-button-primary"
            >
              Enter My Map 🗺️
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
