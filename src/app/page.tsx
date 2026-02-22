import { Toolbar } from "@/components/Toolbar";
import { CanvasPreview } from "@/components/CanvasPreview";
import { TraceInputModal } from "@/components/TraceInputModal";

export default function BuilderPage() {
  return (
    <main className="relative flex flex-col h-screen bg-zinc-50 dark:bg-black font-sans overflow-hidden">
      <Toolbar />
      <div className="flex-1 w-full pt-20 pb-4 px-4 flex flex-col items-center justify-center h-full overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 w-full max-w-7xl overflow-auto relative z-0 flex items-center justify-center p-4">
          <CanvasPreview />
        </div>
      </div>
      <TraceInputModal />
    </main>
  );
}
