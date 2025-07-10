"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center"
    >
      {theme === "dark" ? (
        <>
          <motion.span initial={false} animate={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex items-center">
            <Moon className="h-[1.2rem] w-[1.2rem] mr-1 text-white" />
          </motion.span>
          <span className="text-sm font-semibold text-white transition-opacity duration-300 opacity-100">Dark Mode</span>
        </>
      ) : (
        <>
          <motion.span initial={false} animate={{ rotate: 0 }} transition={{ duration: 0.5 }} className="flex items-center">
            <Sun className="h-[1.2rem] w-[1.2rem] mr-1 text-[#222]" />
          </motion.span>
          <span className="text-sm font-semibold text-[#222] transition-opacity duration-300 opacity-100">Light Mode</span>
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
