"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { Popover } from "../Popover";
import { Grid, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateGridConstraints } from "@/lib/grid-utils";
import { useMemo } from "react";
import { PAGE_SIZES } from "@/lib/constants";

export function GridSettings() {
    const store = useCanvasStore();

    const dimensions = useMemo(() => {
        let w: number = (PAGE_SIZES as any)[store.pageSize]?.width || 1440;
        let h: number = (PAGE_SIZES as any)[store.pageSize]?.height || 1080;

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
        return calculateGridConstraints(dimensions, store.gridMargin, store.gridSize, store.gridGap);
    }, [dimensions, store.gridMargin, store.gridSize, store.gridGap]);

    return (
        <div className="flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-3 pl-1">
            <Popover
                active={store.snapGrid}
                trigger={<Grid className="w-5 h-5" />}
                content={
                    <div className="flex flex-col gap-4 w-72 p-3 font-sans">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-1">
                            <span className="text-sm font-bold flex items-center gap-2">
                                <Grid className="w-4 h-4 text-blue-500" />
                                Grid & Snapping
                            </span>
                            <button
                                onClick={() => store.setSnapGrid(!store.snapGrid)}
                                className={cn(
                                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors",
                                    store.snapGrid ? "bg-red-50 text-red-600 dark:bg-red-500/10" : "bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                                )}
                            >
                                {store.snapGrid ? 'Disable' : 'Enable'}
                            </button>
                        </div>

                        {/* Grid Dimensions */}
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rows</span>
                                        <button onClick={() => store.setGridRows(0)} className="text-[9px] text-blue-500 hover:underline font-bold">Auto</button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={store.gridRows === 0 ? '' : store.gridRows}
                                            placeholder={`Max ${maxGrid.rows}`}
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? 0 : Math.min(maxGrid.rows, Math.max(0, parseInt(e.target.value)));
                                                store.setGridRows(val);
                                            }}
                                            className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        />
                                        {store.gridRows === 0 && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-bold uppercase pointer-events-none">Auto</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Cols</span>
                                        <button onClick={() => store.setGridCols(0)} className="text-[9px] text-blue-500 hover:underline font-bold">Auto</button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={store.gridCols === 0 ? '' : store.gridCols}
                                            placeholder={`Max ${maxGrid.cols}`}
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? 0 : Math.min(maxGrid.cols, Math.max(0, parseInt(e.target.value)));
                                                store.setGridCols(val);
                                            }}
                                            className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        />
                                        {store.gridCols === 0 && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-bold uppercase pointer-events-none">Auto</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-1">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Cell Size</span>
                                        <span className="text-xs text-blue-500 font-bold">{store.gridSize}px</span>
                                    </div>
                                    <input
                                        type="range" min="10" max="200"
                                        value={store.gridSize}
                                        onChange={(e) => store.setGridSize(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Page Margin</span>
                                        <span className="text-xs text-blue-500 font-bold">{store.gridMargin}px</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="200"
                                        value={store.gridMargin}
                                        onChange={(e) => store.setGridMargin(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-1">
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Outline Style</span>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex-shrink-0">
                                            <div className="absolute inset-0" style={{ backgroundColor: store.gridColor }} />
                                            <input type="color" value={store.gridColor} onChange={(e) => store.setGridColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <input type="text" value={store.gridColor} onChange={(e) => store.setGridColor(e.target.value)} className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-mono" />
                                    </div>
                                    <div className="flex flex-col gap-1 w-24">
                                        <div className="flex justify-between">
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase">Opac</span>
                                            <span className="text-[10px] text-blue-500 font-bold">{Math.round(store.gridOpacity * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={store.gridOpacity}
                                            onChange={(e) => store.setGridOpacity(Number(e.target.value))}
                                            className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                </div>
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
                        </div>
                    </div>
                }
            />
        </div>
    );
}
