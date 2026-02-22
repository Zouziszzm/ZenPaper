"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { PAGE_COLORS, PAGE_PATTERNS } from "@/lib/constants";
import { getPageDimensions } from "@/lib/grid-utils";
import { PatternOverlay } from "./canvas/PatternOverlay";
import { WritingGrid } from "./canvas/WritingGrid";

export function CanvasPreview() {
    const store = useCanvasStore();
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            gsap.fromTo(canvasRef.current,
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
        }
    }, []);

    const dimensions = useMemo(() => {
        return getPageDimensions(store.pageSize, store.customResolution, store.orientation);
    }, [store.pageSize, store.customResolution, store.orientation]);

    const activePattern = PAGE_PATTERNS.find(p => p.id === store.pagePattern);
    const activeColor = store.pageColor === 'custom' ? store.customColor : (PAGE_COLORS.find(c => c.id === store.pageColor)?.hex || '#ffffff');

    return (
        <div className="w-full h-max flex items-center justify-center p-4 md:p-8 relative z-0">
            <div
                id="jappaper-canvas"
                ref={canvasRef}
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
                <PatternOverlay dimensions={dimensions} />
                <WritingGrid dimensions={dimensions} />
            </div>
            {store.traceData.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                </div>
            )}
        </div>
    );
}
