import { PAGE_SIZES } from "./constants";

/**
 * Calculates page dimensions based on size and orientation
 */
export function getPageDimensions(pageSize: string, customRes: { width: number; height: number }, orientation: 'landscape' | 'portrait') {
    let w: number = (PAGE_SIZES as any)[pageSize]?.width || 1440;
    let h: number = (PAGE_SIZES as any)[pageSize]?.height || 1080;

    if (pageSize === 'custom') {
        w = customRes.width;
        h = customRes.height;
    }

    if (orientation === 'portrait') {
        return { width: h, height: w };
    }
    return { width: w, height: h };
}

/**
 * Converts hex color to rgba with opacity
 */
export function hexToRgba(hex: string, opacity: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Calculates current grid constraints (max possible rows/cols)
 */
export function calculateGridConstraints(dimensions: { width: number, height: number }, margin: number, size: number, gap: number) {
    const availW = Math.max(0, dimensions.width - 2 * margin);
    const availH = Math.max(0, dimensions.height - 2 * margin);

    // Formula: (n * size + (n-1) * gap) <= avail
    // n * size + n * gap - gap <= avail
    // n * (size + gap) <= avail + gap
    // n <= (avail + gap) / (size + gap)
    const maxCols = Math.floor((availW + gap) / (size + gap));
    const maxRows = Math.floor((availH + gap) / (size + gap));

    return {
        rows: Math.max(0, maxRows),
        cols: Math.max(0, maxCols)
    };
}
