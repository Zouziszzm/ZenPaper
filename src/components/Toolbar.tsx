"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { Download, LayoutGrid, Palette, Type, ScanLine, Smartphone, Monitor, ChevronDown, Check, Minus, Grid, Moon, Sun, LayoutTemplate, Circle, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Popover } from "./Popover";
import { PAGE_SIZES, PAGE_COLORS, PAGE_PATTERNS } from "@/lib/constants";

export function Toolbar() {
    const store = useCanvasStore();
    const toolbarRef = useRef<HTMLDivElement>(null);
    const dimensions = useMemo(() => {
        let w: number = PAGE_SIZES[store.pageSize]?.width || 1440;
        let h: number = PAGE_SIZES[store.pageSize]?.height || 1080;

        if (store.pageSize === 'custom') {
            w = store.customResolution.width;
            h = store.customResolution.height;
        }

        if (store.orientation === 'portrait') {
            return { width: h, height: w };
        }
        return { width: w, height: h };
    }, [store.pageSize, store.customResolution, store.orientation]);

    const maxGrid = useMemo(() => {
        const margin = store.gridMargin;
        const squareSize = store.gridSize;
        const spacing = store.gridGap;
        const availW = Math.max(0, dimensions.width - 2 * margin);
        const availH = Math.max(0, dimensions.height - 2 * margin);

        // Manual Grid Math: (n * size) + (n-1)*gap <= avail
        // n * (size + gap) - gap <= avail
        // n <= (avail + gap) / (size + gap)
        const cols = (squareSize + spacing) > 0 ? Math.floor((availW + spacing) / (squareSize + spacing)) : 0;
        const rows = (squareSize + spacing) > 0 ? Math.floor((availH + spacing) / (squareSize + spacing)) : 0;

        return { cols, rows };
    }, [dimensions, store.gridMargin, store.gridSize, store.gridGap]);

    useGSAP(() => {
        gsap.fromTo(toolbarRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );
    }, { scope: toolbarRef });

    return (
        <div
            ref={toolbarRef}
            className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50",
                "flex items-center gap-1 p-2 rounded-2xl",
                "bg-[var(--card)]/90 backdrop-blur-xl",
                "border border-[var(--border)]/50 shadow-2xl"
            )}
        >
            {/* Layout Elements Group */}
            <div className="flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-3">
                {/* Size Selector */}
                <Popover
                    trigger={<><Monitor className="w-5 h-5 mr-1" /> <span className="text-sm font-medium">{PAGE_SIZES[store.pageSize]?.label || "Size"}</span> <ChevronDown className="w-4 h-4 opacity-50 ml-1" /></>}
                    content={
                        <div className="flex flex-col gap-1 w-48">
                            <div className="text-xs font-semibold text-zinc-500 mb-1 px-2 uppercase tracking-wide">Page Size</div>
                            {(Object.entries(PAGE_SIZES) as [keyof typeof PAGE_SIZES, typeof PAGE_SIZES[keyof typeof PAGE_SIZES]][]).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => store.setPageSize(key)}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                        store.pageSize === key ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-medium" : "text-zinc-700 dark:text-zinc-300"
                                    )}
                                >
                                    {value.label}
                                    {store.pageSize === key && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                            {store.pageSize === 'custom' && (
                                <div className="flex gap-2 p-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <span className="text-xs text-zinc-500">Width</span>
                                        <input type="number" className="w-full text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700" value={store.customResolution.width} onChange={e => store.setCustomResolution(Number(e.target.value), store.customResolution.height)} />
                                    </div>
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <span className="text-xs text-zinc-500">Height</span>
                                        <input type="number" className="w-full text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700" value={store.customResolution.height} onChange={e => store.setCustomResolution(store.customResolution.width, Number(e.target.value))} />
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                />

                {/* Templates Selector */}
                <Popover
                    trigger={<><LayoutTemplate className="w-5 h-5 mr-1" /> <span className="text-sm font-medium">Templates</span> <ChevronDown className="w-4 h-4 opacity-50 ml-1" /></>}
                    content={
                        <div className="flex flex-col gap-2 w-48 p-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest pl-2 pt-1">Quick Presets</span>
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => {
                                        store.setSnapGrid(false);
                                        store.setPatternType('none');
                                        store.setShowInnerGridCross(false);
                                        store.setGridRows(0);
                                        store.setGridCols(0);
                                    }}
                                    className="text-sm px-3 py-2 text-left bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium text-red-600 dark:text-red-400"
                                >
                                    Blank Canvas
                                </button>
                                <button
                                    onClick={() => {
                                        store.setSnapGrid(true); store.setGridSize(40); store.setGridGap(5); store.setGridMargin(50);
                                        store.setGridCols(22); store.setGridRows(22);
                                        store.setPatternType('none');
                                        store.setShowInnerGridCross(true);
                                    }}
                                    className="text-sm px-3 py-2 text-left bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium text-zinc-700 dark:text-zinc-300"
                                >Genkoyoshi
                                </button>
                                <button
                                    onClick={() => {
                                        store.setSnapGrid(true); store.setGridSize(80); store.setGridGap(10); store.setGridMargin(60);
                                        store.setGridCols(14); store.setGridRows(10);
                                        store.setPatternType('none');
                                        store.setShowInnerGridCross(true);
                                    }}
                                    className="text-sm px-3 py-2 text-left bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium text-zinc-700 dark:text-zinc-300"
                                >Kanji Grid
                                </button>
                                <button
                                    onClick={() => {
                                        store.setSnapGrid(true); store.setGridSize(110); store.setGridGap(15); store.setGridMargin(80);
                                        store.setGridCols(10); store.setGridRows(8);
                                        store.setPatternType('none');
                                        store.setShowInnerGridCross(true);
                                    }}
                                    className="text-sm px-3 py-2 text-left bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium text-zinc-700 dark:text-zinc-300"
                                >Kana Practice
                                </button>
                            </div>
                        </div>
                    }
                />

                {/* Orientation Toggle */}
                <button
                    onClick={() => store.setOrientation(store.orientation === 'landscape' ? 'portrait' : 'landscape')}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all group"
                    title="Toggle Orientation"
                >
                    <Smartphone
                        className={cn("w-5 h-5 transition-transform duration-300", store.orientation === 'landscape' ? "-rotate-90" : "rotate-0")}
                    />
                </button>
            </div>

            {/* Theme Elements Group */}
            <div className="flex items-center gap-1.5 border-r border-zinc-200 dark:border-zinc-800 pr-3 pl-2">
                {PAGE_COLORS.map(color => (
                    <button
                        key={color.id}
                        onClick={() => store.setPageColor(color.id as any)}
                        className={cn(
                            "w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110",
                            store.pageColor === color.id ? "border-blue-500 scale-110 ring-2 ring-blue-500/30" : "border-zinc-200 dark:border-zinc-700"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                    />
                ))}

                <Popover
                    trigger={<Palette className="w-5 h-5 ml-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" />}
                    content={
                        <div className="flex flex-col gap-2 w-48 p-1">
                            <div className="text-xs font-semibold text-zinc-500 mb-1 px-1 uppercase tracking-wide">Background Color</div>
                            <div className="flex flex-wrap gap-2 px-1">
                                <button
                                    onClick={() => store.setPageColor('custom')}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden transition-transform hover:scale-110 relative",
                                        store.pageColor === 'custom' ? "border-blue-500 scale-110 shadow-md" : "border-zinc-200 dark:border-zinc-700"
                                    )}
                                    title="Pick Custom Color"
                                >
                                    <div className="absolute inset-0 pointer-events-none rounded-full" style={{ backgroundColor: store.customColor }}></div>
                                    <input
                                        type="color"
                                        value={store.customColor}
                                        onChange={(e) => {
                                            store.setCustomColor(e.target.value);
                                            store.setPageColor('custom');
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </button>
                            </div>
                        </div>
                    }
                />

                {/* Dots Tool */}
                <Popover
                    active={store.patternType === 'dots'}
                    trigger={<Circle className={cn("w-4 h-4 ml-0.5", store.patternType === 'dots' ? "text-blue-500" : "text-zinc-500")} />}
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
                                    className={cn("text-xs px-2 py-1 rounded-md transition-all", store.patternType === 'dots' ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20")}
                                >
                                    {store.patternType === 'dots' ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Size</span>
                                    <input type="number" value={store.patternSize} onChange={(e) => store.setPatternSize(Number(e.target.value))} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Spacing</span>
                                    <input type="number" value={store.patternSpacing} onChange={(e) => store.setPatternSpacing(Number(e.target.value))} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Color</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex-shrink-0">
                                        <div className="absolute inset-0" style={{ backgroundColor: store.patternColor }} />
                                        <input type="color" value={store.patternColor} onChange={(e) => store.setPatternColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    <input type="text" value={store.patternColor} onChange={(e) => store.setPatternColor(e.target.value)} className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] font-mono" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Page Margin</span>
                                    <span className="text-[10px] font-bold text-blue-500">{store.gridMargin}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="200" step="5"
                                    value={store.gridMargin}
                                    onChange={(e) => store.setGridMargin(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    }
                />

                {/* Lines Tool */}
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
                                    className={cn("text-xs px-2 py-1 rounded-md transition-all", store.patternType === 'lines' ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20")}
                                >
                                    {store.patternType === 'lines' ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Height</span>
                                    <input type="number" value={store.patternThickness} onChange={(e) => store.setPatternThickness(Number(e.target.value))} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Spacing</span>
                                    <input type="number" value={store.patternSpacing} onChange={(e) => store.setPatternSpacing(Number(e.target.value))} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Color</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex-shrink-0">
                                        <div className="absolute inset-0" style={{ backgroundColor: store.patternColor }} />
                                        <input type="color" value={store.patternColor} onChange={(e) => store.setPatternColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    <input type="text" value={store.patternColor} onChange={(e) => store.setPatternColor(e.target.value)} className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] font-mono" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Page Margin</span>
                                    <span className="text-[10px] font-bold text-blue-500">{store.gridMargin}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="200" step="5"
                                    value={store.gridMargin}
                                    onChange={(e) => store.setGridMargin(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    }
                />

                {/* Grid Tool */}
                <Popover
                    active={store.patternType === 'grid'}
                    trigger={<Square className={cn("w-4 h-4 ml-0.5", store.patternType === 'grid' ? "text-blue-500" : "text-zinc-500")} />}
                    content={
                        <div className="flex flex-col gap-4 w-64 p-3 font-sans">
                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                <span className="text-sm font-semibold">Grid Pattern</span>
                                <button
                                    onClick={() => {
                                        const nextType = store.patternType === 'grid' ? 'none' : 'grid';
                                        store.setPatternType(nextType);
                                        if (nextType !== 'none') store.setSnapGrid(false);
                                    }}
                                    className={cn("text-xs px-2 py-1 rounded-md transition-all", store.patternType === 'grid' ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20")}
                                >
                                    {store.patternType === 'grid' ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Thickness</span>
                                    <input type="number" value={store.patternThickness} onChange={(e) => store.setPatternThickness(Number(e.target.value))} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Cell Size</span>
                                    <input type="number" value={store.patternSpacing} onChange={(e) => store.setPatternSpacing(Number(e.target.value))} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Color</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex-shrink-0">
                                        <div className="absolute inset-0" style={{ backgroundColor: store.patternColor }} />
                                        <input type="color" value={store.patternColor} onChange={(e) => store.setPatternColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    <input type="text" value={store.patternColor} onChange={(e) => store.setPatternColor(e.target.value)} className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] font-mono" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Inner Grid Cross</span>
                                    <button
                                        onClick={() => store.setShowInnerGridCross(!store.showInnerGridCross)}
                                        className={cn(
                                            "w-8 h-4 rounded-full relative transition-colors duration-200",
                                            store.showInnerGridCross ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200",
                                            store.showInnerGridCross ? "right-0.5" : "left-0.5"
                                        )} />
                                    </button>
                                </div>

                                {store.showInnerGridCross && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-1 mt-1 bg-zinc-50 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                            <button
                                                onClick={() => store.setInnerGridCrossStyle('solid')}
                                                className={cn(
                                                    "flex-1 text-[10px] py-1 rounded transition-all",
                                                    store.innerGridCrossStyle === 'solid' ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                                )}
                                            >
                                                Solid
                                            </button>
                                            <button
                                                onClick={() => store.setInnerGridCrossStyle('dashed')}
                                                className={cn(
                                                    "flex-1 text-[10px] py-1 rounded transition-all",
                                                    store.innerGridCrossStyle === 'dashed' ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                                )}
                                            >
                                                Dashed
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Cross Color</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex-shrink-0">
                                                        <div className="absolute inset-0" style={{ backgroundColor: store.innerGridCrossColor }} />
                                                        <input type="color" value={store.innerGridCrossColor} onChange={(e) => store.setInnerGridCrossColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    </div>
                                                    <input type="text" value={store.innerGridCrossColor} onChange={(e) => store.setInnerGridCrossColor(e.target.value)} className="w-16 px-1.5 py-0.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[9px] font-mono" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Cross Opacity</span>
                                                    <span className="text-[9px] font-bold text-blue-500">{Math.round(store.innerGridCrossOpacity * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="1" step="0.05"
                                                    value={store.innerGridCrossOpacity}
                                                    onChange={(e) => store.setInnerGridCrossOpacity(Number(e.target.value))}
                                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Page Margin</span>
                                    <span className="text-[10px] font-bold text-blue-500">{store.gridMargin}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="200" step="5"
                                    value={store.gridMargin}
                                    onChange={(e) => store.setGridMargin(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    }
                />
            </div>



            {/* Grid & Trace Tool Group */}
            <div className="flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-3 pl-1">
                <Popover
                    active={store.snapGrid}
                    trigger={<Grid className="w-5 h-5" />}
                    content={
                        <div className="flex flex-col gap-4 w-80 p-3">
                            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                                <span className="text-sm font-semibold">Grid & Snapping</span>
                                <button
                                    onClick={() => store.setSnapGrid(!store.snapGrid)}
                                    className={cn("w-10 h-5 rounded-full relative transition-colors", store.snapGrid ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700")}
                                >
                                    <div className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", store.snapGrid ? "translate-x-5" : "translate-x-0")}></div>
                                </button>
                            </div>

                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest pt-1">Grid Dimensions</span>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-zinc-500 font-medium">Rows</span>
                                            <button
                                                onClick={() => store.setGridRows(0)}
                                                className={cn(
                                                    "text-[9px] px-1 py-0.5 rounded border border-blue-500/20",
                                                    store.gridRows === 0 ? "bg-blue-500 text-white" : "text-blue-500 hover:bg-blue-50"
                                                )}
                                            >
                                                Auto
                                            </button>
                                        </div>
                                        {store.gridRows > 0 && <span className="text-[9px] font-bold text-blue-500">Max: {maxGrid.rows}</span>}
                                    </div>
                                    <input
                                        type="number"
                                        value={store.gridRows === 0 ? "" : store.gridRows}
                                        placeholder={`Auto (${maxGrid.rows})`}
                                        onChange={(e) => {
                                            const val = e.target.value === "" ? 0 : Math.min(Number(e.target.value), maxGrid.rows);
                                            store.setGridRows(val);
                                        }}
                                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-zinc-500 font-medium">Cols</span>
                                            <button
                                                onClick={() => store.setGridCols(0)}
                                                className={cn(
                                                    "text-[9px] px-1 py-0.5 rounded border border-blue-500/20",
                                                    store.gridCols === 0 ? "bg-blue-500 text-white" : "text-blue-500 hover:bg-blue-50"
                                                )}
                                            >
                                                Auto
                                            </button>
                                        </div>
                                        {store.gridCols > 0 && <span className="text-[9px] font-bold text-blue-500">Max: {maxGrid.cols}</span>}
                                    </div>
                                    <input
                                        type="number"
                                        value={store.gridCols === 0 ? "" : store.gridCols}
                                        placeholder={`Auto (${maxGrid.cols})`}
                                        onChange={(e) => {
                                            const val = e.target.value === "" ? 0 : Math.min(Number(e.target.value), maxGrid.cols);
                                            store.setGridCols(val);
                                        }}
                                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-xs text-zinc-500 font-medium">Cell Size</span>
                                    <input
                                        type="number"
                                        value={store.gridSize}
                                        onChange={(e) => {
                                            const newSize = Number(e.target.value);
                                            store.setGridSize(newSize);
                                        }}
                                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-xs text-zinc-500 font-medium">Gap (internal)</span>
                                    <input type="number" value={store.gridGap} onChange={(e) => store.setGridGap(Number(e.target.value))} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" />
                                </div>
                                <div className="flex flex-col gap-2 col-span-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-500 font-medium tracking-wide">Page Margin Offset</span>
                                        <span className="text-xs font-bold text-blue-500">{store.gridMargin}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="200" step="5"
                                        value={store.gridMargin}
                                        onChange={(e) => store.setGridMargin(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-1">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Outline Style</span>
                                    <span className="text-xs text-blue-500 font-bold bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md">{Math.round(store.gridOpacity * 100)}%</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex-shrink-0" title="Outline Color">
                                        <div className="absolute inset-0 pointer-events-none rounded-full" style={{ backgroundColor: store.gridColor }}></div>
                                        <input
                                            type="color"
                                            value={store.gridColor}
                                            onChange={(e) => store.setGridColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="range"
                                            min="0" max="1" step="0.05"
                                            value={store.gridOpacity}
                                            onChange={(e) => store.setGridOpacity(Number(e.target.value))}
                                            className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] text-zinc-400 font-medium px-1 ml-11">
                                    <span>Invisible</span>
                                    <span>Solid Line</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Inner Cross Divider</span>
                                    <button
                                        onClick={() => store.setShowInnerGridCross(!store.showInnerGridCross)}
                                        className={cn(
                                            "w-8 h-4 rounded-full relative transition-colors duration-200",
                                            store.showInnerGridCross ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200",
                                            store.showInnerGridCross ? "right-0.5" : "left-0.5"
                                        )} />
                                    </button>
                                </div>
                                {store.showInnerGridCross && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-1 mt-1 bg-zinc-50 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                            <button
                                                onClick={() => store.setInnerGridCrossStyle('solid')}
                                                className={cn(
                                                    "flex-1 text-[10px] py-1.5 rounded-md transition-all font-medium",
                                                    store.innerGridCrossStyle === 'solid' ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                                                )}
                                            >
                                                Solid
                                            </button>
                                            <button
                                                onClick={() => store.setInnerGridCrossStyle('dashed')}
                                                className={cn(
                                                    "flex-1 text-[10px] py-1.5 rounded-md transition-all font-medium",
                                                    store.innerGridCrossStyle === 'dashed' ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                                                )}
                                            >
                                                Dashed
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Cross Color</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex-shrink-0">
                                                        <div className="absolute inset-0" style={{ backgroundColor: store.innerGridCrossColor }} />
                                                        <input type="color" value={store.innerGridCrossColor} onChange={(e) => store.setInnerGridCrossColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    </div>
                                                    <input type="text" value={store.innerGridCrossColor} onChange={(e) => store.setInnerGridCrossColor(e.target.value)} className="w-18 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-mono" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Cross Opacity</span>
                                                    <span className="text-xs text-blue-500 font-bold">{Math.round(store.innerGridCrossOpacity * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="1" step="0.05"
                                                    value={store.innerGridCrossOpacity}
                                                    onChange={(e) => store.setInnerGridCrossOpacity(Number(e.target.value))}
                                                    className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-1">
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Trace Character Style</span>
                                <div className="flex flex-col gap-3 mt-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">Trace Color</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex-shrink-0">
                                                <div className="absolute inset-0" style={{ backgroundColor: store.traceColor }} />
                                                <input type="color" value={store.traceColor} onChange={(e) => store.setTraceColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                            </div>
                                            <input type="text" value={store.traceColor} onChange={(e) => store.setTraceColor(e.target.value)} className="w-18 px-1.5 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-mono" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">Trace Opacity</span>
                                            <span className="text-[10px] font-bold text-blue-500">{Math.round(store.traceOpacity * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="1" step="0.05"
                                            value={store.traceOpacity}
                                            onChange={(e) => store.setTraceOpacity(Number(e.target.value))}
                                            className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />

                <button
                    onClick={() => window.dispatchEvent(new Event('open-trace-modal'))}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                    title="Trace Template Generator"
                >
                    <Type className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center pl-2 gap-2">
                <button
                    onClick={() => {
                        if (document.documentElement.classList.contains('dark')) {
                            document.documentElement.classList.remove('dark');
                        } else {
                            document.documentElement.classList.add('dark');
                        }
                    }}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                    title="Toggle Dark Mode"
                >
                    <Moon className="w-5 h-5 hidden dark:block" />
                    <Sun className="w-5 h-5 block dark:hidden" />
                </button>
                <button
                    onClick={async () => {
                        const element = document.getElementById("jappaper-canvas");
                        if (!element) return;

                        // We do a dynamic import to avoid SSR issues with html2canvas and jsPDF
                        const html2canvas = (await import("html2canvas")).default;
                        const { jsPDF } = await import("jspdf");

                        // Add a subtle loading state later, for now just process synchronously inside async
                        const canvas = await html2canvas(element, {
                            scale: 2, // Double resolution for crisp PDF
                            useCORS: true,
                            backgroundColor: store.pageColor === 'custom' ? store.customColor : (PAGE_COLORS.find(c => c.id === store.pageColor)?.hex || '#ffffff')
                        });

                        const imgData = canvas.toDataURL("image/jpeg", 1.0);

                        // Default to A4 proportions or canvas exact pixel aspect ratio mapping
                        const isLandscape = store.orientation === "landscape";
                        const pdf = new jsPDF({
                            orientation: isLandscape ? "landscape" : "portrait",
                            unit: "px",
                            format: [canvas.width / 2, canvas.height / 2]
                        });

                        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height / 2);
                        pdf.save(`jappaper-template-${Date.now()}.pdf`);
                    }}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

        </div>
    );
}
