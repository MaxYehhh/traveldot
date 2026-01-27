'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Map } from '@/components/Map';
import { Sidebar } from '@/components/Sidebar';
import { TravelCard } from '@/components/TravelCard';
import { ProfileCenter } from '@/components/ProfileCenter';
import { Session } from '@supabase/supabase-js';
import { Dot } from '@/types/database';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'mine' | 'others';
type Theme = 'light' | 'dark';

export default function MapPage() {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [dots, setDots] = useState<Dot[]>([]);
    const [filteredDots, setFilteredDots] = useState<Dot[]>([]);
    const [selectedDot, setSelectedDot] = useState<Dot | null>(null);
    const [newDotCoords, setNewDotCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
            if (session) {
                fetchDots();
            } else {
                router.push('/');
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!session) return;

        let result = dots;
        if (filterType === 'mine') {
            result = dots.filter(d => d.user_id === session.user.id);
        } else if (filterType === 'others') {
            result = dots.filter(d => d.user_id !== session.user.id);
        }
        setFilteredDots(result);
    }, [dots, filterType, session]);

    const fetchDots = async () => {
        try {
            setFetchError(null);
            const { data, error } = await supabase
                .from('dots')
                .select('*, profiles(username, avatar_url)');

            if (error) throw error;
            if (data) setDots(data as any);
        } catch (err: any) {
            console.error('Error fetching dots:', err.message);
            if (err.code === '404' || err.message.includes('404')) {
                setFetchError('無法連接資料庫 (Table missing?)');
            } else {
                setFetchError('讀取紀錄失敗');
            }
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        setNewDotCoords({ lat, lng });
        setSelectedDot(null);
        setIsEditing(false);
    };

    const handleDotClick = (dot: Dot) => {
        setSelectedDot(dot);
        setNewDotCoords(null);
        setIsEditing(false);
    };

    const cancelSelection = () => {
        setNewDotCoords(null);
        setSelectedDot(null);
        setIsEditing(false);
    };

    const handleEditFromProfile = (dot: Dot) => {
        setIsProfileOpen(false);
        setSelectedDot(dot);
        setIsEditing(true);
    };

    // Derived groups for autosuggestion
    const existingGroups = Array.from(new Set(dots.map(d => d.group_name).filter(Boolean))) as string[];

    if (loading || !session) {
        return (
            <main className="flex items-center justify-center w-full h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className="relative w-full h-screen overflow-hidden flex">
            {/* Sidebar */}
            <Sidebar
                dots={filteredDots}
                onDotClick={handleDotClick}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                theme={theme}
            />

            <div className="flex-1 relative h-full">
                <Map
                    dots={filteredDots}
                    selectedDotId={selectedDot?.id}
                    onMapClick={handleMapClick}
                    onDotClick={handleDotClick}
                    theme={theme}
                    onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />

                {/* Sidebar Toggle Button (Floating if Sidebar is closed) */}
                {!isSidebarOpen && (
                    <div className="absolute top-6 left-6 z-10">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={clsx(
                                "p-3 rounded-xl shadow-lg border transition-all",
                                theme === 'dark' ? "bg-[#1a1c23]/90 border-white/10 text-white hover:bg-white/10" : "bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-50"
                            )}
                            title="開啟側邊欄"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                            </svg>
                        </button>
                    </div>
                )}

                {/* Error Toast */}
                {fetchError && (
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-600 rounded-full text-sm font-medium backdrop-blur-md">
                            <AlertCircle size={16} />
                            {fetchError}
                        </div>
                    </div>
                )}

                {/* Floating UI Elements - Adjusted position if Sidebar is open? 
                    Actually, if Sidebar occupies left space, 'absolute top-6 left-6' is relative to the Map container (flex-1 div). 
                    So it will be at the top-left of the MAP area, which is correct.
                    However, Google My Maps usually has the panel inside the layout.
                    The "Floating UI Elements" in page.tsx (the card showing "New Dot" or "Selected Dot info") mimics the old behavior.
                    PRD says: "Location Card ... Open the TravelCard (Info Window)".
                    The current "Floating UI Elements" acts like a sidebar/card.
                    We are REPLACING the old left-panel info with the new Sidebar + Modal TravelCard?
                    PRD says "Sidebar... Clicking... Opens the TravelCard".
                    And "Location Card ... Clicking Marker ... Opens the card".
                    And "Card... Display Mode... Header... Body...".
                    Wait, `TravelCard` component in `src/components/TravelCard.tsx` is a MODAL (`fixed inset-0`).
                    The PRD says "Location Card (Info Window)".
                    Google My Maps opens an InfoWindow ON the map (bubble).
                    My `TravelCard` is currently a full screen modal.
                    PRD says "Optimized Location Card".
                    If I keep it as a Modal, it's fine.
                    But what about the "Floating UI Elements" at `top-6 left-6` in `page.tsx`?
                    That seems to be a "Quick Info" panel.
                    If I have a Sidebar, that Quick Info panel might be redundant or conflicts with Sidebar.
                    PRD doesn't explicitly delete it, but implies "Sidebar Implementation... List all...".
                    And "Location Card... Content...".
                    If I keep the Sidebar as list, and the Dot Info opens in TravelCard (Modal), then the "Quick Info" panel (which allows "Add Note" or "Edit") needs to be integrated or removed/replaced?
                    Currently `TravelCard` is the EDIT modal.
                    The "Quick Info" panel shows "Selected Dot" summary.
                    Maybe we can KEEP the Quick Info panel but ensure it doesn't overlap Sidebar?
                    But if Sidebar is open (w-80), the Map area shrinks. The Quick Info panel is inside Map area, so it moves right.
                    So it shouldn't overlap.
                    However, having Sidebar AND Quick Info Panel might be cluttered.
                    Let's see: Sidebar lists dots. Clicking one selects it.
                    Selection triggers `handleDotClick`.
                    `handleDotClick` sets `selectedDot`.
                    `page.tsx` renders "Floating UI Elements" if `selectedDot` is present.
                    So user sees Sidebar (left) + Quick Info Panel (on map) + Marker (on map).
                    This mimics Google Maps (Sidebar + Search Result Card).
                    I will keep it for now.
                */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-4 pointer-events-none">
                    {/* If sidebar is open, maybe we hide this "Quick Info" or keep it? 
                        The sidebar lists dots. The Quick Info details the SELECTED dot.
                        It seems fine. 
                        However, the "Toggle Sidebar" button needs to be clickable.
                        The Floating Elements are `left-6`.
                        If Sidebar is closed, Toggle Button is at `left-6`.
                        The Floating Elements might overlap the Toggle Button.
                        I should move Floating Elements down if needed, or put the Toggle Button into the Floating UI.
                        Actually, the Toggle Button is only shown when !isSidebarOpen.
                        When !isSidebarOpen, the Floating Elements are at left-6. 
                        They fight for space.
                        I should probably integrate the Sidebar Toggle INTO the Floating Elements logic or position.
                        
                        Better idea: 
                        If !isSidebarOpen, show Toggle Button.
                        Move Floating Elements to `top-20` (below search bar or buttons)?
                        Search bar is `top-6 center`.
                        
                        Let's adjust Floating UI `top-6` to `top-20` or stick to `left-6` but add `mt-12`?
                        Or just `top-20 left-6`.
                        
                        Wait, `Map.tsx` has Search Bar at `top-6 center`.
                        The Floating UI at `top-6 left-6` is fine, they are far apart.
                        The Toggle Button at `top-6 left-6`.
                        Collision!

                        I'll move Floating UI to `top-20`.
                     */}
                    <div className={clsx(
                        "glass-panel p-6 rounded-2xl w-80 pointer-events-auto transition-all mt-14", // Added mt-14 to clear top space
                        theme === 'dark' ? "text-white" : "bg-white/90 border-slate-200 shadow-xl"
                    )}>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className={clsx(
                                "text-xl font-semibold",
                                theme === 'dark' ? "text-white" : "text-slate-800"
                            )}>
                                {newDotCoords ? '📍 新紀錄' : selectedDot ? '📍 旅程亮點' : '🌍 探索地圖'}
                            </h2>
                            {(newDotCoords || selectedDot) && (
                                <button
                                    onClick={cancelSelection}
                                    className={clsx(
                                        "transition-colors",
                                        theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-800"
                                    )}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {newDotCoords ? (
                            <div className="space-y-4">
                                <p className={clsx("text-sm", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
                                    您選中了地圖上的一點。點擊下方按鈕開始捕捉您的旅行故事。
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={cancelSelection}
                                        className={clsx(
                                            "flex-1 py-3 px-4 transition-colors rounded-xl font-medium",
                                            theme === 'dark' ? "bg-white/5 hover:bg-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                        )}
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-[2] py-3 px-4 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-xl font-medium text-white shadow-lg shadow-emerald-500/20"
                                    >
                                        新增筆記
                                    </button>
                                </div>
                            </div>
                        ) : selectedDot ? (
                            <div className="space-y-4">
                                <h3 className="font-medium text-indigo-500">{selectedDot.place_name || '未命名地點'}</h3>
                                <p className={clsx("text-sm line-clamp-3", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
                                    {selectedDot.content?.text || '尚無內容'}
                                </p>
                                <div className="flex gap-2">
                                    {session.user.id === selectedDot.user_id && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 transition-colors rounded-xl font-medium text-indigo-500 text-sm"
                                        >
                                            編輯
                                        </button>
                                    )}
                                    <button className={clsx(
                                        "flex-1 py-2 px-3 border transition-colors rounded-xl font-medium text-sm",
                                        theme === 'dark' ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                                    )}>
                                        詳細資訊
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className={clsx("text-sm mb-4", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
                                    在地圖上隨意點擊一個位置，紀錄下您的旅行心情或媒體。
                                </p>
                                <button className="w-full py-3 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 transition-colors rounded-xl font-medium text-indigo-500">
                                    瀏覽全球紀錄
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Modals - TravelCard now gets existingGroups */}
                {isEditing && (
                    <TravelCard
                        coords={newDotCoords || undefined}
                        dot={selectedDot || undefined}
                        existingGroups={existingGroups}
                        onClose={() => setIsEditing(false)}
                        onSave={fetchDots}
                    />
                )}

                {isProfileOpen && (
                    <ProfileCenter
                        session={session}
                        userDots={dots.filter(d => d.user_id === session.user.id)}
                        onClose={() => setIsProfileOpen(false)}
                        onEditDot={handleEditFromProfile}
                        onDotDeleted={fetchDots}
                    />
                )}

                {/* Profile Button - Adjusted position: right-6 is fine */}
                <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className={clsx(
                            "px-4 py-2 glass-panel rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
                            theme === 'dark' ? "text-slate-300 hover:text-white hover:bg-white/10" : "bg-white/90 border-slate-200 text-slate-700 hover:bg-white hover:text-slate-900 shadow-sm"
                        )}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white">
                            {session.user.email?.[0].toUpperCase()}
                        </div>
                        {session.user.email}
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className={clsx(
                            "glass-panel p-2 rounded-xl transition-all text-sm font-medium",
                            theme === 'dark' ? "hover:bg-white/10 hover:border-white/20 text-slate-300" : "bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                        )}
                    >
                        回首頁
                    </button>
                </div>

                {/* Bottom Filter/Legend */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                    <div className={clsx(
                        "glass-panel p-1.5 rounded-2xl flex items-center gap-1",
                        theme === 'dark' ? "" : "bg-white/90 border-slate-200 shadow-lg"
                    )}>
                        <button
                            onClick={() => setFilterType('all')}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2",
                                filterType === 'all'
                                    ? (theme === 'dark' ? "bg-slate-700/50 text-white shadow-sm" : "bg-slate-200 text-slate-900 shadow-sm")
                                    : (theme === 'dark' ? "text-slate-400 hover:text-slate-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")
                            )}
                        >
                            全部
                        </button>
                        <div className={clsx("w-px h-4 mx-1", theme === 'dark' ? "bg-white/10" : "bg-slate-300")} />
                        <button
                            onClick={() => setFilterType('mine')}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2",
                                filterType === 'mine'
                                    ? (theme === 'dark' ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30" : "bg-indigo-50 text-indigo-700 border border-indigo-200")
                                    : (theme === 'dark' ? "text-slate-400 hover:text-slate-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")
                            )}
                        >
                            <div className={`w-2 h-2 rounded-full ${filterType === 'mine' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-indigo-500'}`} />
                            您的紀錄
                        </button>
                        <button
                            onClick={() => setFilterType('others')}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2",
                                filterType === 'others'
                                    ? (theme === 'dark' ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200")
                                    : (theme === 'dark' ? "text-slate-400 hover:text-slate-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")
                            )}
                        >
                            <div className={`w-2 h-2 rounded-full ${filterType === 'others' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-emerald-600'}`} />
                            其他用戶
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
