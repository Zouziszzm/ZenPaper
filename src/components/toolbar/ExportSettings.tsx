"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { Download, Moon, Sun, Type } from "lucide-react";
import { PAGE_COLORS } from "@/lib/constants";

export function ExportSettings() {
    const store = useCanvasStore();

    return (
        <div className="flex items-center gap-2 pl-3">
            <button
                onClick={() => window.dispatchEvent(new Event('open-trace-modal'))}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                title="Trace Template Generator"
            >
                <Type className="w-5 h-5" />
            </button>

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

                    const html2canvas = (await import("html2canvas")).default;
                    const { jsPDF } = await import("jspdf");

                    const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: store.pageColor === 'custom' ? store.customColor : (PAGE_COLORS.find(c => c.id === store.pageColor)?.hex || '#ffffff')
                    });

                    const imgData = canvas.toDataURL("image/jpeg", 1.0);
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
    );
}
