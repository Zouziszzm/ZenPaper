"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { useRef } from "react";
import { ExportSettings } from "./toolbar/ExportSettings";
import { PageSettings } from "./toolbar/PageSettings";
import { PatternSettings } from "./toolbar/PatternSettings";
import { GridSettings } from "./toolbar/GridSettings";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function Toolbar() {
    const toolbarRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (toolbarRef.current) {
            gsap.fromTo(toolbarRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
            );
        }
    }, { scope: toolbarRef });

    return (
        <div
            ref={toolbarRef}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
        >
            <PageSettings />
            <PatternSettings />
            <GridSettings />
            <ExportSettings />
        </div>
    );
}
