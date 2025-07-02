"use client";
import { GlassWrapper } from "./GlassWrapper";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { Input } from "./ui/input";
import { ToolCard } from "./ToolCard";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY > lastScrollY.current && window.scrollY > 80) {
        setShow(false); // scrolling down, hide
      } else {
        setShow(true); // scrolling up, show
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl transition-shadow px-2 sm:px-0`}
        style={{
          transition:
            "transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s cubic-bezier(.4,0,.2,1)",
          transform: show ? "translate(-50%, 0)" : "translate(-50%, -120%)",
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
        }}
      >
        <GlassWrapper className="w-full flex justify-between items-center py-2 px-2 sm:px-4">
          <span
            className="font-extrabold text-2xl tracking-tight text-black dark:text-white px-4 sm:px-6 py-2 mx-1 sm:mx-2 flex items-center gap-1 select-none"
            style={{ border: "none" }}
          >
            Resourcer
            <span
              className="text-5xl leading-none text-black dark:text-white align-middle"
              style={{ fontWeight: 900, marginLeft: 2, marginTop: -10 }}
            >
              .
            </span>
          </span>
          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="liquid-bg liquid-hover rounded-full px-4 sm:px-6 py-2 mx-1 sm:mx-2 text-black dark:text-white font-medium text-base sm:text-lg transition text-center"
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="liquid-bg liquid-hover rounded-full px-4 sm:px-6 py-2 mx-1 sm:mx-2 text-black dark:text-white font-medium text-base sm:text-lg transition text-center"
            >
              Tools
            </Link>
            <Link
              href="/blog"
              className="liquid-bg liquid-hover rounded-full px-4 sm:px-6 py-2 mx-1 sm:mx-2 text-black dark:text-white font-medium text-base sm:text-lg transition text-center"
            >
              Blog
            </Link>
          </nav>
          {/* Mobile Hamburger */}
          <button
            className="sm:hidden p-2 rounded-full liquid-hover transition ml-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button
              className="p-2 rounded-full liquid-hover transition"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
            <ThemeToggle />
          </div>
        </GlassWrapper>
      </nav>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 dark:bg-white/10 backdrop-blur-xl">
          <button
            className="absolute top-6 right-6 p-2 rounded-full liquid-bg liquid-hover"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <div className="flex flex-col items-center gap-8">
            <Link
              href="/"
              className="liquid-bg liquid-hover rounded-full px-10 py-4 text-black dark:text-white font-bold text-2xl mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="liquid-bg liquid-hover rounded-full px-10 py-4 text-black dark:text-white font-bold text-2xl mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <Link
              href="/blog"
              className="liquid-bg liquid-hover rounded-full px-10 py-4 text-black dark:text-white font-bold text-2xl mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="liquid-bg liquid-hover rounded-full flex gap-4 mt-6">
              <button
                className="p-3 rounded-full liquid-hover"
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                aria-label="Open search"
              >
                <Search size={24} />
              </button>
            </div>
            <div className="flex gap-4 mt-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [tools, setTools] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tools/all");
      setTools(await res.json());
    })();
    setTimeout(() => inputRef.current?.focus(), 100);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query) setFiltered([]);
    else {
      setFiltered(
        tools.filter(
          (tool: any) =>
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            (tool.description &&
              tool.description
                .map((b: any) => b.children?.map((c: any) => c.text).join(" "))
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase()))
        )
      );
    }
  }, [query, tools]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-white/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-8 flex flex-col items-center gap-4 min-w-[320px] max-w-[90vw] bg-white dark:bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          ref={inputRef}
          autoFocus
          placeholder="Search tools by name or description..."
          className="w-full text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="w-full max-h-96 overflow-y-auto flex flex-col gap-2 mt-2">
          {query && filtered.length === 0 && (
            <div className="text-center text-black/60 dark:text-white/60 text-sm">
              No tools found.
            </div>
          )}
          {filtered.map((tool) => (
            <Link
              key={tool._id}
              href={`/tools/${tool.slug.current}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
              onClick={onClose}
            >
              <img
                src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool.websiteUrl}`}
                alt="favicon"
                className="w-6 h-6"
              />
              <span className="text-base text-black dark:text-white font-medium truncate max-w-[200px]">
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
        <button
          className="mt-2 px-6 py-2 rounded-full liquid-bg liquid-hover text-black dark:text-white font-semibold text-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
