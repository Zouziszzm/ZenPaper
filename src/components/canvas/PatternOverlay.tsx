"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { hexToRgba } from "@/lib/grid-utils";
import { useMemo } from "react";

interface PatternOverlayProps {
    dimensions: { width: number; height: number };
}

export function PatternOverlay({ dimensions }: PatternOverlayProps) {
    const store = useCanvasStore();

    const patternStyle = useMemo(() => {
        if (store.patternType === 'none') return { backgroundImage: 'none', display: 'none' };

        const color = store.patternColor;
        const thickness = store.patternThickness;
        const pageW = dimensions.width;
        const pageH = dimensions.height;
        const margin = store.gridMargin;

        const availW = Math.max(0, pageW - 2 * margin);
        const availH = Math.max(0, pageH - 2 * margin);

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

            const cols = Math.floor((availW - thickness) / requestedCell);
            const rows = Math.floor((availH - thickness) / requestedCell);

            if (cols <= 0 || rows <= 0) return { backgroundImage: 'none' };

            const fitSizeX = Math.floor((availW - thickness) / cols);
            const fitSizeY = Math.floor((availH - thickness) / rows);

            const totalW = cols * fitSizeX;
            const totalH = rows * fitSizeY;

            const drawW = totalW + thickness;
            const drawH = totalH + thickness;

            const left = margin + (availW - drawW) / 2;
            const top = margin + (availH - drawH) / 2;

            const crossColor = hexToRgba(store.innerGridCrossColor, store.innerGridCrossOpacity);
            const isDashed = store.innerGridCrossStyle === 'dashed';
            const dashArray = isDashed ? '4,4' : 'none';

            const svg = `
                <svg width="${fitSizeX}" height="${fitSizeY}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
                    <rect x="0" y="0" width="${fitSizeX}" height="${thickness}" fill="${color}" />
                    <rect x="0" y="0" width="${thickness}" height="${fitSizeY}" fill="${color}" />
                    ${store.showInnerGridCross ? `
                        <line x1="0" y1="${Math.floor(fitSizeY / 2)}" x2="${fitSizeX}" y2="${Math.floor(fitSizeY / 2)}" stroke="${crossColor}" stroke-width="1" stroke-dasharray="${dashArray}" />
                        <line x1="${Math.floor(fitSizeX / 2)}" y1="0" x2="${Math.floor(fitSizeX / 2)}" y2="${fitSizeY}" stroke="${crossColor}" stroke-width="1" stroke-dasharray="${dashArray}" />
                    ` : ''}
                </svg>
            `.trim().replace(/\n/g, '').replace(/"/g, "'");

            const svgBase64 = typeof window !== 'undefined' ? window.btoa(svg) : "";

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

    if (store.patternType === 'none') return null;

    return (
        <div
            className="pointer-events-none print:opacity-100"
            style={{
                ...patternStyle,
                opacity: store.gridOpacity * 1.5,
                containerType: 'size'
            }}
        />
    );
}
