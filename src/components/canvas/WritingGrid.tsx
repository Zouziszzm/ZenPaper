"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";

interface WritingGridProps {
    dimensions: { width: number; height: number };
}

export function WritingGrid({ dimensions }: WritingGridProps) {
    const store = useCanvasStore();

    if (!(store.gridRows > 0 && store.gridCols > 0 && store.snapGrid)) return null;

    const margin = store.gridMargin;
    const squareSize = store.gridSize;
    const spacing = store.gridGap;
    const pageW = dimensions.width;
    const pageH = dimensions.height;

    const availW = Math.max(0, pageW - 2 * margin);
    const availH = Math.max(0, pageH - 2 * margin);

    const maxCols = Math.floor((availW + spacing) / (squareSize + spacing));
    const maxRows = Math.floor((availH + spacing) / (squareSize + spacing));

    const cols = store.gridCols > 0 ? Math.min(store.gridCols, maxCols) : maxCols;
    const rows = store.gridRows > 0 ? Math.min(store.gridRows, maxRows) : maxRows;

    if (cols <= 0 || rows <= 0) return null;

    const totalW = cols * squareSize + (cols - 1) * spacing;
    const totalH = rows * squareSize + (rows - 1) * spacing;

    const left = margin + (availW - totalW) / 2;
    const top = margin + (availH - totalH) / 2;

    return (
        <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: rows }).map((_, r) => (
                <div
                    key={`row-${r}`}
                    className="absolute flex items-center"
                    style={{
                        top: `${((top + r * (squareSize + spacing)) / pageH) * 100}%`,
                        left: `${(left / pageW) * 100}%`,
                        width: `${(totalW / pageW) * 100}%`,
                        height: `${(squareSize / pageH) * 100}%`,
                        gap: `${(spacing / totalW) * 100}%`
                    }}
                >
                    {Array.from({ length: cols }).map((_, c) => {
                        const val = store.manualGridData[`${r},${c}`] || '';
                        const isInteractive = store.drawMode === 'select';
                        return (
                            <div
                                key={`cell-${r}-${c}`}
                                className={cn(
                                    "relative flex items-center justify-center border-zinc-200 dark:border-zinc-800",
                                    isInteractive ? "hover:border-blue-400 focus-within:border-blue-500 z-20" : ""
                                )}
                                style={{
                                    flex: `0 0 ${(squareSize / totalW) * 100}%`,
                                    height: '100%',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: store.gridColor,
                                    opacity: store.gridOpacity,
                                    pointerEvents: isInteractive ? 'auto' : 'none',
                                    containerType: 'size'
                                }}
                            >
                                {/* Fixed Inner Grid Cross with user settings */}
                                {store.showInnerGridCross && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div
                                            className="absolute top-1/2 left-0 right-0 h-[1px]"
                                            style={{
                                                borderTop: `1px ${store.innerGridCrossStyle} ${store.innerGridCrossColor}`,
                                                transform: 'translateY(-50%)',
                                                opacity: store.innerGridCrossOpacity
                                            }}
                                        />
                                        <div
                                            className="absolute left-1/2 top-0 bottom-0 w-[1px]"
                                            style={{
                                                borderLeft: `1px ${store.innerGridCrossStyle} ${store.innerGridCrossColor}`,
                                                transform: 'translateX(-50%)',
                                                opacity: store.innerGridCrossOpacity
                                            }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    maxLength={1}
                                    value={val}
                                    onChange={(e) => store.updateManualGridCell(r, c, e.target.value)}
                                    className="absolute inset-0 w-full h-full bg-transparent text-center border-none outline-none font-medium p-0 flex items-center justify-center leading-none"
                                    style={{
                                        fontSize: '70cqh',
                                        color: store.traceColor,
                                        opacity: val ? store.traceOpacity : 0.4
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
