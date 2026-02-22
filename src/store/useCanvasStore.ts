import { create } from "zustand";

export type PageSize = "1440" | "1280" | "720" | "4k" | "custom";
export type Orientation = "landscape" | "portrait";
export type PageColor = "white" | "cream" | "sepia" | "lightblue" | "mint" | "dark" | "custom";
export type LineType = "horizontal" | "vertical";
export type DrawMode = "select";

export interface TraceCell {
    row: number;
    columns: number;
    character: string;
}

export interface CanvasState {
    pageSize: PageSize;
    customResolution: { width: number; height: number };
    orientation: Orientation;
    pageColor: PageColor;
    customColor: string;
    pagePattern: string; // Legacy CSS background string
    patternType: 'none' | 'dots' | 'lines' | 'grid';
    patternSize: number;
    patternSpacing: number;
    patternThickness: number;
    patternColor: string;
    showInnerGridCross: boolean;
    innerGridCrossStyle: 'solid' | 'dashed';
    innerGridCrossColor: string;
    innerGridCrossOpacity: number;

    snapGrid: boolean;
    gridSize: number; // For snapping
    gridRows: number;
    gridCols: number;
    gridMargin: number;
    gridGap: number;
    gridOpacity: number;
    gridColor: string;
    manualGridData: Record<string, string>;

    // Trace Styling
    traceColor: string;
    traceOpacity: number;

    traceData: TraceCell[];
    drawMode: DrawMode;

    // Actions
    setPageSize: (size: PageSize) => void;
    setCustomResolution: (width: number, height: number) => void;
    setOrientation: (orientation: Orientation) => void;
    setPageColor: (color: PageColor) => void;
    setCustomColor: (color: string) => void;
    setPagePattern: (pattern: string) => void;
    setPatternType: (type: 'none' | 'dots' | 'lines' | 'grid') => void;
    setPatternSize: (size: number) => void;
    setPatternSpacing: (spacing: number) => void;
    setPatternThickness: (thickness: number) => void;
    setPatternColor: (color: string) => void;
    setShowInnerGridCross: (show: boolean) => void;
    setInnerGridCrossStyle: (style: 'solid' | 'dashed') => void;
    setInnerGridCrossColor: (color: string) => void;
    setInnerGridCrossOpacity: (opacity: number) => void;

    setSnapGrid: (active: boolean) => void;
    setGridSize: (size: number) => void;
    setGridRows: (r: number) => void;
    setGridCols: (c: number) => void;
    setGridMargin: (m: number) => void;
    setGridGap: (g: number) => void;
    setGridOpacity: (o: number) => void;
    setGridColor: (c: string) => void;
    setManualGridData: (data: Record<string, string>) => void;
    updateManualGridCell: (r: number, c: number, val: string) => void;

    setTraceColor: (color: string) => void;
    setTraceOpacity: (opacity: number) => void;

    setDrawMode: (mode: DrawMode) => void;
    setTraceData: (data: TraceCell[]) => void;
    clearLinesAndTrace: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    pageSize: "1440",
    customResolution: { width: 1440, height: 1080 },
    orientation: "landscape",
    pageColor: "white",
    customColor: "#ffffff",
    pagePattern: "none",
    patternType: "none",
    patternSize: 4,
    patternSpacing: 20,
    patternThickness: 1,
    patternColor: "#cbd5e1",
    showInnerGridCross: false,
    innerGridCrossStyle: 'dashed',
    innerGridCrossColor: "#cbd5e1",
    innerGridCrossOpacity: 0.4,

    snapGrid: false,
    gridSize: 45,
    gridRows: 22,
    gridCols: 22,
    gridMargin: 20,
    gridGap: 0,
    gridOpacity: 0.3, // Default 30% outline visibility
    gridColor: "#000000",
    manualGridData: {},

    traceColor: "#000000",
    traceOpacity: 0.6,
    traceData: [],

    drawMode: "select",

    setPageSize: (size) => set({ pageSize: size }),
    setCustomResolution: (width, height) => set({ customResolution: { width, height } }),
    setOrientation: (orientation) => set({ orientation }),
    setPageColor: (color) => set({ pageColor: color }),
    setCustomColor: (color) => set({ customColor: color }),
    setPagePattern: (pattern) => set({ pagePattern: pattern }),
    setPatternType: (type) => set({ patternType: type }),
    setPatternSize: (size) => set({ patternSize: size }),
    setPatternSpacing: (spacing) => set({ patternSpacing: spacing }),
    setPatternThickness: (thickness) => set({ patternThickness: thickness }),
    setPatternColor: (color) => set({ patternColor: color }),
    setShowInnerGridCross: (show) => set({ showInnerGridCross: show }),
    setInnerGridCrossStyle: (style) => set({ innerGridCrossStyle: style }),
    setInnerGridCrossColor: (color) => set({ innerGridCrossColor: color }),
    setInnerGridCrossOpacity: (opacity) => set({ innerGridCrossOpacity: opacity }),

    setSnapGrid: (active) => set({ snapGrid: active }),
    setGridSize: (size) => set({ gridSize: size }),
    setGridRows: (r) => set({ gridRows: r }),
    setGridCols: (c) => set({ gridCols: c }),
    setGridMargin: (m) => set({ gridMargin: m }),
    setGridGap: (g) => set({ gridGap: g }),
    setGridOpacity: (o) => set({ gridOpacity: o }),
    setGridColor: (c) => set({ gridColor: c }),
    setManualGridData: (data) => set({ manualGridData: data }),
    updateManualGridCell: (r, c, val) => set((state) => ({
        manualGridData: { ...state.manualGridData, [`${r},${c}`]: val }
    })),

    setTraceColor: (color) => set({ traceColor: color }),
    setTraceOpacity: (opacity) => set({ traceOpacity: opacity }),

    setDrawMode: (mode) => set({ drawMode: mode }),
    setTraceData: (data) => set({ traceData: data }),
    clearLinesAndTrace: () => set({ traceData: [] })
}));
