'use client';

import React, { useState, useMemo } from 'react';
import { Dot } from '@/types/database';
import { ChevronDown, ChevronRight, MapPin, List, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    dots: Dot[];
    onDotClick: (dot: Dot) => void;
    isOpen: boolean;
    onToggle: () => void;
    theme: 'light' | 'dark';
}

export function Sidebar({ dots, onDotClick, isOpen, onToggle, theme }: SidebarProps) {
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['未分類']));

    // Group dots by group_name
    const groupedDots = useMemo(() => {
        const groups: Record<string, Dot[]> = {};
        dots.forEach(dot => {
            const group = dot.group_name || '未分類';
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(dot);
        });
        return groups;
    }, [dots]);

    const toggleGroup = (group: string) => {
        const newOpen = new Set(openGroups);
        if (newOpen.has(group)) {
            newOpen.delete(group);
        } else {
            newOpen.add(group);
        }
        setOpenGroups(newOpen);
    };

    return (
        <div
            className={clsx(
                "h-full transition-all duration-300 ease-in-out flex flex-col border-r relative z-10",
                isOpen ? "w-80" : "w-0",
                theme === 'dark' ? "bg-[#0a0a0c] border-white/10" : "bg-white border-slate-200"
            )}
        >
            {/* Toggle Handle - Always visible (slightly poking out when closed ideally, or managed by parent) 
                Actually, putting it here might hide it when w-0. We might need the parent to handle the 'Open' button if closed, 
                or we keep a thin strip. For now, let's assume parent puts a button to OPEN, and this has a button to CLOSE.
            */}

            <div className={clsx("flex-1 overflow-y-auto overflow-x-hidden", !isOpen && "invisible")}>
                <div className="p-4 border-b border-opacity-10 header-section flex items-center justify-between">
                    <h2 className={clsx("font-bold text-lg", theme === 'dark' ? "text-white" : "text-slate-800")}>
                        地點清單
                    </h2>
                    <button
                        onClick={onToggle}
                        className={clsx(
                            "p-2 rounded-lg hover:bg-opacity-10 transition-colors",
                            theme === 'dark' ? "hover:bg-white text-slate-400" : "hover:bg-slate-900 text-slate-500"
                        )}
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <div className="p-2 space-y-1">
                    {Object.entries(groupedDots).map(([groupName, groupDots]) => (
                        <div key={groupName} className="rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleGroup(groupName)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-3 text-sm font-medium transition-colors",
                                    theme === 'dark'
                                        ? "text-slate-200 hover:bg-white/5"
                                        : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {openGroups.has(groupName) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    {groupName}
                                    <span className="text-xs opacity-50">({groupDots.length})</span>
                                </span>
                            </button>

                            {openGroups.has(groupName) && (
                                <div className="pl-4 pb-2 space-y-1">
                                    {groupDots.map(dot => (
                                        <button
                                            key={dot.id}
                                            onClick={() => onDotClick(dot)}
                                            className={clsx(
                                                "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all",
                                                theme === 'dark'
                                                    ? "hover:bg-white/10 text-slate-400 hover:text-white"
                                                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                            )}
                                        >
                                            <MapPin size={14} className={dot.is_public ? "text-indigo-500" : "text-emerald-500"} />
                                            <span className="truncate text-sm">{dot.place_name || '未命名地點'}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {dots.length === 0 && (
                        <div className="p-4 text-center text-sm opacity-50">
                            暫無地點，請在地圖上點擊新增
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
