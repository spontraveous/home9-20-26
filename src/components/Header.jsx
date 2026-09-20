export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-20 flex items-center gap-3 px-6 py-6 text-paper sm:px-10">
      <img src="/logo-mark.svg" alt="" width="32" height="32" className="shrink-0" />
      <span className="font-display text-lg tracking-tight">spontraveous</span>
    </header>
  );
}
