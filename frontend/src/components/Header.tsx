export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#2a2a2a]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#e10600] rounded-full" />
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#888] uppercase font-medium">
              Formula 1
            </p>
            <h1 className="text-base font-bold text-white leading-tight tracking-tight">
              Lap Comparator
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#e10600] animate-pulse" />
          <span className="text-[10px] text-[#888] uppercase tracking-wider">Live</span>
        </div>
      </div>
    </header>
  );
}
