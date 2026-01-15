'use client';

import React, { useState } from 'react';
import { Dot } from '@/types/database';
import { Session } from '@supabase/supabase-js';
import { MapPin, Calendar, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProfileCenterProps {
    session: Session;
    userDots: Dot[];
    onClose: () => void;
    onEditDot: (dot: Dot) => void;
    onDotDeleted: () => void;
}

export function ProfileCenter({ session, userDots, onClose, onEditDot, onDotDeleted }: ProfileCenterProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (dotId: string) => {
        if (!confirm('確定要刪除這筆紀錄嗎？此動作無法復原。')) return;

        setDeletingId(dotId);
        try {
            const { error } = await supabase
                .from('dots')
                .delete()
                .eq('id', dotId);

            if (error) throw error;
            onDotDeleted();
        } catch (error: any) {
            alert('刪除失敗: ' + error.message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="glass-panel w-full max-w-2xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                            {session.user.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">個人中心</h2>
                            <p className="text-sm text-slate-400">{session.user.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <MapPin size={20} className="text-emerald-400" />
                            我的旅程足跡 ({userDots.length})
                        </h3>

                        {userDots.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <p className="text-slate-400 mb-2">尚無紀錄</p>
                                <button onClick={onClose} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                                    回到地圖新增第一筆紀錄
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {userDots.map(dot => (
                                    <div key={dot.id} className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="font-medium text-slate-200">{dot.place_name || '未命名地點'}</h4>
                                            <p className="text-sm text-slate-400 line-clamp-2">{dot.content?.text || '無內容'}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                                <Calendar size={12} />
                                                {new Date(dot.created_at).toLocaleDateString()}
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${dot.is_public ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                                    {dot.is_public ? '公開' : '私人'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEditDot(dot)}
                                                className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition-colors"
                                                title="編輯"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dot.id)}
                                                disabled={deletingId === dot.id}
                                                className="p-2 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500/30 transition-colors disabled:opacity-50"
                                                title="刪除"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
