import { GlassWrapper } from "./GlassWrapper";

export function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto my-8">
      <GlassWrapper className="w-full flex justify-between items-center py-2 px-2 sm:px-4">
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-black dark:text-white select-none">
          Resourcer<span className="text-2xl align-sub">.</span>
        </span>
        <span className="text-black/60 dark:text-white/60 text-sm">
          &copy; {new Date().getFullYear()} ResourcerAI. All rights reserved.
        </span>
      </GlassWrapper>
    </footer>
  );
}
