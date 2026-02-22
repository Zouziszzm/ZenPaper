"use client";

import { useCanvasStore, PageSize, PageColor } from "@/store/useCanvasStore";
import { Popover } from "../Popover";
import { Monitor, Smartphone, Layout, Palette, LayoutTemplate, Square, Circle, ChevronDown, Check, LayoutGrid, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_SIZES, PAGE_COLORS } from "@/lib/constants";

export function PageSettings() {
    const store = useCanvasStore();

    const activeColor = store.pageColor === 'custom' ? store.customColor : (PAGE_COLORS.find(c => c.id === store.pageColor)?.hex || '#ffffff');

    return (
        <div className="flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-3">
            {/* Page Size & Orientation */}
            <Popover
                trigger={
                    <button className="flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                        {store.orientation === 'landscape' ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                        <span className="text-sm font-medium hidden md:block">{PAGE_SIZES[store.pageSize]?.label || "Custom"}</span>
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                }
                content={
                    <div className="flex flex-col gap-3 w-64 p-3">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Orientation</span>
                            <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                <button
                                    onClick={() => store.setOrientation('landscape')}
                                    className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition-all", store.orientation === 'landscape' ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600" : "text-zinc-500")}
                                >
                                    <Monitor className="w-4 h-4" /> Landscape
                                </button>
                                <button
                                    onClick={() => store.setOrientation('portrait')}
                                    className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition-all", store.orientation === 'portrait' ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600" : "text-zinc-500")}
                                >
                                    <Smartphone className="w-4 h-4" /> Portrait
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Size Preset</span>
                            <div className="grid grid-cols-1 gap-1">
                                {Object.entries(PAGE_SIZES).map(([id, size]) => (
                                    <button
                                        key={id}
                                        onClick={() => store.setPageSize(id as PageSize)}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                                            store.pageSize === id ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" : "hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {id === 'custom' ? <Layout className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                                            {size.label}
                                        </div>
                                        {store.pageSize === id && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {store.pageSize === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase pl-1">Width</span>
                                    <input
                                        type="number"
                                        value={store.customResolution.width}
                                        onChange={(e) => store.setCustomResolution(Number(e.target.value), store.customResolution.height)}
                                        className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase pl-1">Height</span>
                                    <input
                                        type="number"
                                        value={store.customResolution.height}
                                        onChange={(e) => store.setCustomResolution(store.customResolution.width, Number(e.target.value))}
                                        className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                }
            />

            {/* Background Color */}
            <Popover
                trigger={
                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all relative" title="Page Color">
                        <Palette className="w-5 h-5" />
                        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full border border-white dark:border-zinc-900 shadow-sm" style={{ backgroundColor: activeColor }}></div>
                    </button>
                }
                content={
                    <div className="flex flex-col gap-3 w-56 p-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Background</span>
                        <div className="grid grid-cols-4 gap-2">
                            {PAGE_COLORS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => store.setPageColor(c.id as PageColor)}
                                    className={cn(
                                        "w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 relative group",
                                        store.pageColor === c.id ? "border-blue-500 scale-105" : "border-zinc-100 dark:border-zinc-800"
                                    )}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.label}
                                >
                                    {store.pageColor === c.id && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-lg">
                                            <Check className="w-4 h-4 text-blue-600" />
                                        </div>
                                    )}
                                </button>
                            ))}
                            <div className="relative group">
                                <button
                                    onClick={() => store.setPageColor('custom')}
                                    className={cn(
                                        "w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 flex items-center justify-center overflow-hidden",
                                        store.pageColor === 'custom' ? "border-blue-500 scale-105" : "border-zinc-100 dark:border-zinc-800"
                                    )}
                                    style={{ backgroundColor: store.pageColor === 'custom' ? store.customColor : '#f4f4f5' }}
                                >
                                    {store.pageColor === 'custom' ? <Check className="w-4 h-4 text-white mix-blend-difference" /> : <div className="w-full h-full bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500 opacity-80" />}
                                </button>
                                <input
                                    type="color"
                                    value={store.customColor}
                                    onChange={(e) => {
                                        store.setCustomColor(e.target.value);
                                        store.setPageColor('custom');
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Templates Dropdown */}
            <Popover
                trigger={
                    <button className="flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all" title="Templates">
                        <LayoutTemplate className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-medium hidden lg:block text-indigo-600 dark:text-indigo-400">Templates</span>
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                }
                content={
                    <div className="flex flex-col gap-2 w-72 p-2">
                        <div className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 rounded-lg mb-1">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-loose">Practice Templates</span>
                        </div>

                        <button
                            onClick={() => {
                                store.setPagePattern('none');
                                store.setPatternType('none');
                                store.setSnapGrid(true);
                                store.setGridRows(22);
                                store.setGridCols(22);
                                store.setGridSize(45);
                                store.setGridMargin(20);
                                store.setGridGap(0);
                                store.setGridOpacity(0.3);
                                store.setGridColor("#000000");
                                store.setShowInnerGridCross(true);
                                store.setInnerGridCrossStyle('dashed');
                                store.setInnerGridCrossColor("#000000");
                                store.setInnerGridCrossOpacity(0.4);
                                store.clearLinesAndTrace();
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20"
                        >
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                <LayoutGrid className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Standard Grid (22x22)</span>
                                <span className="text-[10px] text-zinc-500 font-medium tracking-tight">Classic Genkoyoshi style practice grid</span>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                store.setPagePattern('none');
                                store.setPatternType('grid');
                                store.setPatternThickness(1);
                                store.setPatternSpacing(45);
                                store.setPatternColor("#94a3b8");
                                store.setSnapGrid(false);
                                store.clearLinesAndTrace();
                                store.setShowInnerGridCross(false);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all group border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <ScanLine className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Plain Grid Pattern</span>
                                <span className="text-[10px] text-zinc-500 font-medium tracking-tight">Endless auto-filling grid lines</span>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                store.setPagePattern('none');
                                store.setPatternType('none');
                                store.setSnapGrid(false);
                                store.clearLinesAndTrace();
                                store.setShowInnerGridCross(false);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        >
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:scale-110 transition-transform">
                                <Square className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Blank Canvas</span>
                                <span className="text-[10px] text-zinc-500 font-medium tracking-tight">Pure page with no patterns or grids</span>
                            </div>
                        </button>
                    </div>
                }
            />
        </div>
    );
}
