"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const prompts = [
  "Edit video with AI",
  "Chat with AI assistant",
  "Generate images from text",
  "Create presentations",
  "Write code faster",
  "Transcribe audio to text",
  "Design logos instantly",
  "Automate workflows",
  "Analyze data with AI",
  "Remove image backgrounds",
];

export function AnimatedSearchBox() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const router = useRouter();

  // Typewriter effect
  useEffect(() => {
    const currentPrompt = prompts[currentPromptIndex];

    if (isTyping) {
      if (displayedText.length < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentPrompt.slice(0, displayedText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentPromptIndex]);

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    router.push(`/tools?search=${encodeURIComponent(prompt)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-3xl mx-auto mb-8"
    >
      {/* Chatbot-style input box — matches site liquid glass */}
      <div className="rounded-2xl liquid-bg border border-black/10 dark:border-white/20 shadow-[0_2px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_32px_rgba(255,255,255,0.06)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <Search className="w-5 h-5 text-black/40 dark:text-white/40 flex-shrink-0" />
          <div className="flex-1 min-h-[1.5rem] flex items-center">
            <span className="text-lg text-black dark:text-white font-medium">
              {displayedText}
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-5 bg-black/60 dark:bg-white/60 ml-0.5 align-middle rounded-full"
            />
          </div>
          <Sparkles className="w-5 h-5 text-black/50 dark:text-white/50 flex-shrink-0" />
        </div>
      </div>

      {/* Selectable prompt chips — liquid-hover to match site */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 flex flex-wrap gap-2 justify-center"
      >
        {prompts.slice(0, 6).map((prompt, index) => (
          <motion.button
            key={prompt}
            onClick={() => handlePromptClick(prompt)}
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`liquid-hover px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              selectedPrompt === prompt
                ? "bg-black/15 dark:bg-white/15 text-black dark:text-white border-black/20 dark:border-white/20 shadow-md"
                : "bg-black/5 dark:bg-white/10 text-black dark:text-white border-black/10 dark:border-white/20"
            }`}
          >
            {prompt}
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-4 text-sm text-black/50 dark:text-white/50"
      >
        Click any prompt to discover AI tools
      </motion.p>
    </motion.div>
  );
}
