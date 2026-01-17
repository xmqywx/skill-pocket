import { getCurrentWindow } from '@tauri-apps/api/window';

export function WindowControls() {
  const handleClose = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  const handleMinimize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  };

  const handleMaximize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.toggleMaximize();
  };

  return (
    <div className="flex items-center gap-2 px-4">
      {/* Close button - Red */}
      <button
        onClick={handleClose}
        className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors flex items-center justify-center group"
        title="Close"
      >
        <svg className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1l8 8M9 1l-8 8" stroke="#4D0000" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Minimize button - Yellow */}
      <button
        onClick={handleMinimize}
        className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 transition-colors flex items-center justify-center group"
        title="Minimize"
      >
        <svg className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5h8" stroke="#995700" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Maximize button - Green */}
      <button
        onClick={handleMaximize}
        className="w-3.5 h-3.5 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors flex items-center justify-center group"
        title="Maximize"
      >
        <svg className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 3.5L3.5 1M6.5 1L9 3.5M9 6.5L6.5 9M3.5 9L1 6.5" stroke="#006500" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function DragRegion({ className = '' }: { className?: string }) {
  const handleMouseDown = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.startDragging();
  };

  return (
    <div
      className={`cursor-default ${className}`}
      onMouseDown={handleMouseDown}
    />
  );
}
