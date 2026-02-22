export const PAGE_SIZES = {
    "1440": { width: 1440, height: 1080, label: "1440p (Standard)" },
    "1280": { width: 1280, height: 720, label: "1280p (HD)" },
    "720": { width: 720, height: 480, label: "720p (SD)" },
    "4k": { width: 3840, height: 2160, label: "4K (Ultra HD)" },
    "custom": { width: 1440, height: 1080, label: "Custom" },
} as const;

export const PAGE_COLORS = [
    { id: "white", hex: "#ffffff", label: "White" },
    { id: "black", hex: "#18181b", label: "Black" },
    { id: "green", hex: "#e8f5e9", label: "Green" },
    { id: "cream", hex: "#fffdd0", label: "Cream" },
    { id: "khaki", hex: "#f0e68c", label: "Khaki" },
    { id: "blue", hex: "#e3f2fd", label: "Blue" },
] as const;

export const PAGE_PATTERNS = [
    { id: "none", css: "none", label: "None" },
    { id: "dots", css: "radial-gradient(circle, #cbd5e1 2px, transparent 2.5px)", label: "Dots", size: "30px 30px" },
    { id: "lines", css: "repeating-linear-gradient(transparent, transparent 29px, #cbd5e1 29px, #cbd5e1 30px)", label: "Lines" },
    { id: "grid", css: "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)", label: "Grid", size: "30px 30px" },
] as const;
