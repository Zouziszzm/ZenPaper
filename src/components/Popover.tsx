"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface PopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    active?: boolean;
}

export function Popover({ trigger, content, active }: PopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: -10, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out", display: "block" }
            );
        } else {
            gsap.to(contentRef.current, {
                opacity: 0,
                y: -10,
                scale: 0.95,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    if (contentRef.current) contentRef.current.style.display = "none";
                }
            });
        }
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 rounded-xl transition-all duration-200 outline-none flex items-center justify-center",
                    isOpen ? "bg-zinc-200 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    active && "text-blue-600 dark:text-blue-400"
                )}
            >
                {trigger}
            </button>

            <div
                ref={contentRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 min-w-48 bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-2xl p-2 hidden"
                style={{ transformOrigin: "top center" }}
            >
                {content}
            </div>
        </div>
    );
}
