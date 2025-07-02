"use client";
import { GlassWrapper } from "./GlassWrapper";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden ">
      {/* Liquid glass panel */}
      <GlassWrapper className="relative z-10 max-w-2xl mx-auto text-center py-20 px-8 liquid-bg">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-4 text-black dark:text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Resourcer: AI Tools Discovery
        </motion.h1>
        <motion.p
          className="text-xl text-black/70 dark:text-white/70 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Plus Curated insights, Latest News, one click away
        </motion.p>
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
