'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Dot } from '@/types/database';

interface TravelCardProps {
    coords?: { lat: number, lng: number };
    dot?: Dot;
    existingGroups?: string[];
    onClose: () => void;
    onSave: () => void;
}

export function TravelCard({ coords, dot, existingGroups = [], onClose, onSave }: TravelCardProps) {
    const [loading, setLoading] = useState(false);
    const [placeName, setPlaceName] = useState(dot?.place_name || '');
    const [groupName, setGroupName] = useState(dot?.group_name || '');
    const [content, setContent] = useState(dot?.content ? (typeof dot.content === 'string' ? dot.content : dot?.content?.text || JSON.stringify(dot.content)) : '');
    const [isPublic, setIsPublic] = useState(dot?.is_public || false);
    const [showGroupSuggestions, setShowGroupSuggestions] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) return;

        const dotData = {
            user_id: session.user.id,
            latitude: coords?.lat || dot?.latitude,
            longitude: coords?.lng || dot?.longitude,
            place_name: placeName,
            group_name: groupName || null,
            content: content ? { text: content } : null,
            is_public: isPublic,
        };

        try {
            if (dot) {
                const { error } = await supabase
                    .from('dots')
                    .update(dotData)
                    .eq('id', dot.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('dots')
                    .insert([dotData]);
                if (error) throw error;
            }
            onSave();
            onClose();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold gradient-text">
                        {dot ? '編輯旅程紀錄' : '新增旅行點位'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">地點名稱</label>
                        <input
                            type="text"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="例如：札幌大通公園"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-1">分類群組</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            onFocus={() => setShowGroupSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowGroupSuggestions(false), 200)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="例如：美食、景點、住宿..."
                        />
                        {showGroupSuggestions && existingGroups.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/10 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                {existingGroups.filter(g => g.toLowerCase().includes(groupName.toLowerCase())).map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setGroupName(g)}
                                        className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-300 text-sm"
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">您的想法 / 紀錄</label>
                        <textarea
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="在這裡寫下您的心情或實用的旅遊資訊..."
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="isPublic" className="text-sm text-slate-300">
                            公開此紀錄（其他人也可以在地圖上看到）
                        </label>
                    </div>
                </div>

                <div className="p-6 bg-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-white/10 rounded-xl font-medium hover:bg-white/5 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        {loading ? '儲存中...' : '儲存紀錄'}
                    </button>
                </div>
            </div>
        </div>
    );
}
