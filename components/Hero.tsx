"use client";
import { GlassWrapper } from "./GlassWrapper";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Hero({ children }: { children?: ReactNode }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden ">
      {/* Liquid glass panel */}
      <GlassWrapper className="relative z-10 max-w-2xl mx-auto text-center py-20 px-8 liquid-bg">
        {children}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button className="liquid-hover px-8 py-4 text-lg" variant="default">
            Browse Tools
          </Button>
        </motion.div>
      </GlassWrapper>
      {/* Optional: SVG particles or animated shapes for extra liquid effect */}
    </section>
  );
}
