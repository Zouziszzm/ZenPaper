"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useMemo, useState, MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";
import { PAGE_SIZES, PAGE_COLORS, PAGE_PATTERNS } from "@/lib/constants";

export function CanvasPreview() {
    const store = useCanvasStore();
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Subtle entry animation for canvas
        if (canvasRef.current) {
            gsap.fromTo(canvasRef.current,
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
        }
    }, []);

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



    const activePattern = PAGE_PATTERNS.find(p => p.id === store.pagePattern);
    const activeColor = store.pageColor === 'custom' ? store.customColor : (PAGE_COLORS.find(c => c.id === store.pageColor)?.hex || '#ffffff');

    const patternStyle = useMemo(() => {
        if (store.patternType === 'none') return { backgroundImage: 'none', display: 'none' };

        const color = store.patternColor;
        const thickness = store.patternThickness;
        const pageW = dimensions.width;
        const pageH = dimensions.height;
        const margin = store.gridMargin;

        const availW = Math.max(0, pageW - 2 * margin);
        const availH = Math.max(0, pageH - 2 * margin);

        // Helper for color with opacity
        const hexToRgba = (hex: string, opacity: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        if (store.patternType === 'dots') {
            const cellSize = store.patternSize + store.patternSpacing;
            if (cellSize <= 0) return { backgroundImage: 'none' };

            const cols = Math.floor(availW / cellSize);
            const rows = Math.floor(availH / cellSize);

            if (cols <= 0 || rows <= 0) return { backgroundImage: 'none' };

            const totalW = cols * cellSize;
            const totalH = rows * cellSize;

            const left = margin + (availW - totalW) / 2;
            const top = margin + (availH - totalH) / 2;

            return {
                position: 'absolute' as const,
                left: `${(left / pageW) * 100}%`,
                top: `${(top / pageH) * 100}%`,
                width: `${(totalW / pageW) * 100}%`,
                height: `${(totalH / pageH) * 100}%`,
                backgroundImage: `radial-gradient(circle, ${color} ${store.patternSize / 2}px, transparent ${store.patternSize / 2 + 0.5}px)`,
                backgroundSize: `${(cellSize / totalW) * 100}% ${(cellSize / totalH) * 100}%`,
                backgroundPosition: '0 0'
            };
        }

        if (store.patternType === 'lines') {
            const cellSize = thickness + store.patternSpacing;
            if (cellSize <= 0) return { backgroundImage: 'none' };

            const rows = Math.floor(availH / cellSize);
            if (rows <= 0) return { backgroundImage: 'none' };

            const totalH = rows * cellSize;
            const top = margin + (availH - totalH) / 2;

            return {
                position: 'absolute' as const,
                left: `${(margin / pageW) * 100}%`,
                top: `${(top / pageH) * 100}%`,
                width: `${(availW / pageW) * 100}%`,
                height: `${(totalH / pageH) * 100}%`,
                backgroundImage: `linear-gradient(to bottom, ${color} ${thickness}px, transparent ${thickness}px)`,
                backgroundSize: `100% ${(cellSize / totalH) * 100}%`,
                backgroundPosition: '0 0'
            };
        }

        if (store.patternType === 'grid') {
            const requestedCell = thickness + store.patternSpacing;
            if (requestedCell <= 0) return { backgroundImage: 'none' };

            // Calculate how many full cells fit including the closing border (thickness)
            const cols = Math.floor((availW - thickness) / requestedCell);
            const rows = Math.floor((availH - thickness) / requestedCell);

            if (cols <= 0 || rows <= 0) return { backgroundImage: 'none' };

            // Determine integer cell size to fill available space symmetrically
            const fitSizeX = Math.floor((availW - thickness) / cols);
            const fitSizeY = Math.floor((availH - thickness) / rows);

            const totalW = cols * fitSizeX;
            const totalH = rows * fitSizeY;

            // Container size includes closing borders
            const drawW = totalW + thickness;
            const drawH = totalH + thickness;

            const left = margin + (availW - drawW) / 2;
            const top = margin + (availH - drawH) / 2;

            const crossColor = hexToRgba(store.innerGridCrossColor, store.innerGridCrossOpacity);
            const isDashed = store.innerGridCrossStyle === 'dashed';
            const dashArray = isDashed ? '4,4' : 'none';

            // Generate SVG with crispEdges and integer coordinates
            const svg = `
                <svg width="${fitSizeX}" height="${fitSizeY}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
                    <!-- Outer Grid (Left/Top) -->
                    <rect x="0" y="0" width="${fitSizeX}" height="${thickness}" fill="${color}" />
                    <rect x="0" y="0" width="${thickness}" height="${fitSizeY}" fill="${color}" />
                    ${store.showInnerGridCross ? `
                        <!-- Inner Cross (Centered) -->
                        <line x1="0" y1="${Math.floor(fitSizeY / 2)}" x2="${fitSizeX}" y2="${Math.floor(fitSizeY / 2)}" stroke="${crossColor}" stroke-width="1" stroke-dasharray="${dashArray}" />
                        <line x1="${Math.floor(fitSizeX / 2)}" y1="0" x2="${Math.floor(fitSizeX / 2)}" y2="${fitSizeY}" stroke="${crossColor}" stroke-width="1" stroke-dasharray="${dashArray}" />
                    ` : ''}
                </svg>
            `.trim().replace(/\n/g, '').replace(/"/g, "'");

            const svgBase64 = typeof window !== 'undefined' ? window.btoa(svg) : Buffer.from(svg).toString('base64');

            return {
                position: 'absolute' as const,
                left: `${(left / pageW) * 100}%`,
                top: `${(top / pageH) * 100}%`,
                width: `${(drawW / pageW) * 100}%`,
                height: `${(drawH / pageH) * 100}%`,
                backgroundImage: `url("data:image/svg+xml;base64,${svgBase64}")`,
                backgroundSize: `${(fitSizeX / drawW) * 100}% ${(fitSizeY / drawH) * 100}%`,
                backgroundPosition: '0 0',
                borderRight: `${(thickness / drawW) * 100}cqw solid ${color}`,
                borderBottom: `${(thickness / drawH) * 100}cqh solid ${color}`,
                boxSizing: 'border-box' as const
            };
        }

        return {};
    }, [store.patternType, store.patternSize, store.patternSpacing, store.patternThickness, store.patternColor, store.showInnerGridCross, store.innerGridCrossColor, store.innerGridCrossOpacity, store.innerGridCrossStyle, store.gridMargin, dimensions]);

    const handleCanvasClick = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current) return;
        // Selection/Interaction logic could go here if needed
    };

    return (
        <div
            className="w-full h-max flex items-center justify-center p-4 md:p-8 relative z-0"
        >
            <div
                id="jappaper-canvas"
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={cn(
                    "relative bg-white dark:bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden"
                )}
                style={{
                    width: '100%',
                    maxWidth: store.orientation === 'landscape' ? '1200px' : '800px',
                    aspectRatio: `${dimensions.width} / ${dimensions.height}`,
                    backgroundColor: activeColor,
                    backgroundImage: activePattern?.css === 'none' ? 'none' : activePattern?.css,
                    backgroundSize: (activePattern as any)?.size || 'auto'
                }}
            >
                {/* Advanced Pattern Overlay */}
                {store.patternType !== 'none' && (
                    <div
                        className="pointer-events-none print:opacity-100"
                        style={{
                            ...patternStyle,
                            opacity: store.gridOpacity * 1.5,
                            containerType: 'size'
                        }}
                    />
                )}

                {/* Manual Grid Squares (Standard Practice Mode) */}
                {store.gridRows > 0 && store.gridCols > 0 && store.snapGrid && (
                    <div className="absolute inset-0 pointer-events-none">
                        {(() => {
                            const margin = store.gridMargin;
                            const squareSize = store.gridSize;
                            const spacing = store.gridGap;
                            const pageW = dimensions.width;
                            const pageH = dimensions.height;

                            const availW = Math.max(0, pageW - 2 * margin);
                            const availH = Math.max(0, pageH - 2 * margin);

                            const maxCols = Math.floor((availW + spacing) / (squareSize + spacing));
                            const maxRows = Math.floor((availH + spacing) / (squareSize + spacing));

                            // Use specified rows/cols if active (>0), otherwise auto-fill
                            const cols = store.gridCols > 0 ? Math.min(store.gridCols, maxCols) : maxCols;
                            const rows = store.gridRows > 0 ? Math.min(store.gridRows, maxRows) : maxRows;

                            if (cols <= 0 || rows <= 0) return null;

                            const totalW = cols * squareSize + (cols - 1) * spacing;
                            const totalH = rows * squareSize + (rows - 1) * spacing;

                            const left = margin + (availW - totalW) / 2;
                            const top = margin + (availH - totalH) / 2;

                            return Array.from({ length: rows }).map((_, r) => (
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
                                                {/* Inner Grid Cross for manual squares */}
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
                            ));
                        })()}
                    </div>
                )}
            </div>
            {store.traceData.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                </div>
            )}
        </div>
    );
}
