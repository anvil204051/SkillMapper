"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Map, Star, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export function TopNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  const navItems = [
    { name: "Home", href: "/#main", icon: Home },
    { name: "My Roadmap", href: "/roadmap", icon: Map },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto pl-2 pr-8 sm:pl-4 sm:pr-12">
          <div className="relative flex items-center h-16 w-full">
            {/* Logo */}
            <div className="flex items-center flex-1 min-w-0">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-sm">
                  <Map className="w-6 h-6 text-white -scale-x-100" />
                </div>
                <span className="text-xl font-bold gradient-text">SkillMapper</span>
              </Link>
            </div>

            {/* Desktop Navigation - centered */}
            <div className="hidden md:flex items-center space-x-1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-all
                        ${
                          isActive
                            ? "gradient-bg text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center justify-end w-auto mr-6">
              <ThemeToggle />
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`
                          w-full justify-start flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium
                          ${isActive ? "gradient-bg text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"}
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
