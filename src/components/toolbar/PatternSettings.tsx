"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { Popover } from "../Popover";
import { Minus, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PatternSettings() {
    const store = useCanvasStore();

    return (
        <div className="flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-3 pl-1">
            {/* Dots Pattern */}
            <Popover
                active={store.patternType === 'dots'}
                trigger={
                    <div className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all h-9 w-9 flex items-center justify-center">
                        <Circle className={cn("w-5 h-5", store.patternType === 'dots' ? "text-blue-500" : "text-zinc-500")} fill={store.patternType === 'dots' ? "currentColor" : "none"} />
                    </div>
                }
                content={
                    <div className="flex flex-col gap-4 w-64 p-3 font-sans">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            <span className="text-sm font-semibold">Dots Pattern</span>
                            <button
                                onClick={() => {
                                    const nextType = store.patternType === 'dots' ? 'none' : 'dots';
                                    store.setPatternType(nextType);
                                    if (nextType !== 'none') store.setSnapGrid(false);
                                }}
                                className={cn(
                                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors",
                                    store.patternType === 'dots' ? "bg-red-50 text-red-600 dark:bg-red-500/10" : "bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                                )}
                            >
                                {store.patternType === 'dots' ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Dot Size</span>
                                    <span className="text-xs text-blue-500 font-bold">{store.patternSize}px</span>
                                </div>
                                <input
                                    type="range" min="1" max="20"
                                    value={store.patternSize}
                                    onChange={(e) => store.setPatternSize(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Spacing</span>
                                    <span className="text-xs text-blue-500 font-bold">{store.patternSpacing}px</span>
                                </div>
                                <input
                                    type="range" min="5" max="100"
                                    value={store.patternSpacing}
                                    onChange={(e) => store.setPatternSpacing(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Lines Pattern */}
            <Popover
                active={store.patternType === 'lines'}
                trigger={<Minus className={cn("w-5 h-5 ml-0.5", store.patternType === 'lines' ? "text-blue-500" : "text-zinc-500")} />}
                content={
                    <div className="flex flex-col gap-4 w-64 p-3 font-sans">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            <span className="text-sm font-semibold">Lines Pattern</span>
                            <button
                                onClick={() => {
                                    const nextType = store.patternType === 'lines' ? 'none' : 'lines';
                                    store.setPatternType(nextType);
                                    if (nextType !== 'none') store.setSnapGrid(false);
                                }}
                                className={cn(
                                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors",
                                    store.patternType === 'lines' ? "bg-red-50 text-red-600 dark:bg-red-500/10" : "bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                                )}
                            >
                                {store.patternType === 'lines' ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Line Height</span>
                                    <span className="text-xs text-blue-500 font-bold">{store.patternSpacing}px</span>
                                </div>
                                <input
                                    type="range" min="10" max="200"
                                    value={store.patternSpacing}
                                    onChange={(e) => store.setPatternSpacing(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Thickness</span>
                                    <span className="text-xs text-blue-500 font-bold">{store.patternThickness}px</span>
                                </div>
                                <input
                                    type="range" min="1" max="10"
                                    value={store.patternThickness}
                                    onChange={(e) => store.setPatternThickness(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
