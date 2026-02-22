"use client";

import { useCanvasStore, TraceCell } from "@/store/useCanvasStore";
import { useState, useEffect } from "react";
import { X, FileJson } from "lucide-react";
import { PAGE_SIZES } from "@/lib/constants";

export function TraceInputModal() {
    const store = useCanvasStore();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'json' | 'generator'>('generator');
    const [jsonInput, setJsonInput] = useState("");
    const [error, setError] = useState("");

    // Generator state
    const [genRows, setGenRows] = useState(10);
    const [genCols, setGenCols] = useState(10);
    const [genSize, setGenSize] = useState(60);
    const [genMargin, setGenMargin] = useState(80);
    const [genGap, setGenGap] = useState(10);
    const [genChar, setGenChar] = useState("あ");

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener("open-trace-modal", handleOpen);
        return () => window.removeEventListener("open-trace-modal", handleOpen);
    }, []);

    const handleGenerate = () => {
        let w: number = PAGE_SIZES[store.pageSize as keyof typeof PAGE_SIZES]?.width || 1440;
        let h: number = PAGE_SIZES[store.pageSize as keyof typeof PAGE_SIZES]?.height || 1080;

        if (store.pageSize === 'custom') {
            w = store.customResolution.width;
            h = store.customResolution.height;
        }

        const isPortrait = store.orientation === 'portrait';
        const canvasWidth = isPortrait ? h : w;
        const canvasHeight = isPortrait ? w : h;

        const printableWidth = canvasWidth - (2 * genMargin);
        const printableHeight = canvasHeight - (2 * genMargin);

        const autoCols = Math.floor((printableWidth + genGap) / (genSize + genGap));
        const autoRows = Math.floor((printableHeight + genGap) / (genSize + genGap));

        const data: Record<string, string> = {};
        for (let r = 0; r < autoRows; r++) {
            for (let c = 0; c < autoCols; c++) {
                data[`${r},${c}`] = genChar;
            }
        }

        store.setGridRows(autoRows);
        store.setGridCols(autoCols);
        store.setGridSize(genSize);
        store.setGridMargin(genMargin);
        store.setGridGap(genGap);
        store.setManualGridData(data);
        store.setSnapGrid(true);

        setIsOpen(false);
        setError("");
    };

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array.");

            const data: Record<string, string> = {};
            let maxR = 0;
            let maxC = 0;

            parsed.forEach((item: any) => {
                const r = parseInt(item.row) - 1; // JSON is 1-indexed based on instructions, converting to 0-indexed internal
                const c = parseInt(item.columns || item.column) - 1;
                const char = item.character || item.charecter || "";

                if (!isNaN(r) && !isNaN(c) && char) {
                    data[`${r},${c}`] = char;
                    if (r + 1 > maxR) maxR = r + 1;
                    if (c + 1 > maxC) maxC = c + 1;
                }
            });

            if (maxR > 0) store.setGridRows(Math.max(store.gridRows, maxR));
            if (maxC > 0) store.setGridCols(Math.max(store.gridCols, maxC));
            store.setManualGridData({ ...store.manualGridData, ...data });
            store.setSnapGrid(true);

            setIsOpen(false);
            setError("");
            setJsonInput("");
        } catch (err: any) {
            setError(err.message || "Invalid JSON format.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <FileJson className="w-5 h-5 text-blue-500" />
                    Trace Generator
                </h2>

                <div className="flex gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <button
                        onClick={() => setMode('generator')}
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${mode === 'generator' ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                    >
                        Auto-Generate
                    </button>
                    <button
                        onClick={() => setMode('json')}
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${mode === 'json' ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                    >
                        JSON Import
                    </button>
                </div>

                {mode === 'json' ? (
                    <>
                        <p className="text-sm text-zinc-500 mb-4">
                            Paste a JSON array of objects with <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">row</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">columns</code>, and <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">character</code> properties to generate a tracing guide on the grid. (1-indexed)
                        </p>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder="[\n  { \n    &quot;row&quot;: 1, \n    &quot;columns&quot;: 1, \n    &quot;character&quot;: &quot;あ&quot; \n  }\n]"
                            className="w-full h-48 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs text-zinc-500 font-medium mb-1">Cell Size (px)</label>
                                <input
                                    type="number"
                                    value={genSize}
                                    onChange={(e) => setGenSize(parseInt(e.target.value) || 40)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm"
                                />
                                <p className="text-[10px] text-zinc-400 mt-1 pl-1">Rows and columns automatically map perfectly to the canvas container.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">

                            <div>
                                <label className="block text-xs text-zinc-500 font-medium mb-1">Margin</label>
                                <input
                                    type="number"
                                    value={genMargin}
                                    onChange={(e) => setGenMargin(parseInt(e.target.value) || 0)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-500 font-medium mb-1">Gap</label>
                                <input
                                    type="number"
                                    value={genGap}
                                    onChange={(e) => setGenGap(parseInt(e.target.value) || 0)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-500 font-medium mb-1">Prefill Character</label>
                            <input
                                type="text"
                                maxLength={2}
                                placeholder="e.g. あ"
                                value={genChar}
                                onChange={(e) => setGenChar(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-center text-lg"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => { setGenSize(80); setGenMargin(80); setGenGap(10); setGenChar(''); }}
                                className="text-xs px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors text-center"
                            >Genkoyoshi
                            </button>
                            <button
                                onClick={() => { setGenSize(100); setGenMargin(60); setGenGap(10); setGenChar('あ'); }}
                                className="text-xs px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors text-center"
                            >Kanji Grid
                            </button>
                            <button
                                onClick={() => { setGenSize(140); setGenMargin(120); setGenGap(20); setGenChar('あ'); }}
                                className="text-xs px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors text-center"
                            >Kana Practice
                            </button>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end mt-6 gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={mode === 'json' ? handleImport : handleGenerate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-md transition-all active:scale-95"
                    >
                        {mode === 'json' ? 'Import' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
}
