"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang" },
    { href: "/struktur", label: "Struktur" },
    { href: "/kegiatan", label: "Kegiatan" },
    { href: "/kontak", label: "Kontak" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-border/50"
          : "bg-background/40 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="container-islamic flex h-20 items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group relative"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <motion.span
              className="font-heading text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              Masjid Baiturrahim
            </motion.span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Pusat Kegiatan Islam
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group"
              >
                <motion.div
                  initial={false}
                  whileHover={{ y: -2 }}
                  className="relative px-4 py-2 rounded-lg transition-colors"
                >
                  <span
                    className={cn(
                      "relative z-10 text-sm font-semibold transition-colors duration-300",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavItem"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          {mounted && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 rounded-xl border border-border/50 bg-background/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
              </Button>
            </motion.div>
          )}

          {/* Login Button - Desktop */}
          <Link href="/login" className="hidden lg:block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="h-10 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 font-semibold"
              >
                Login
              </Button>
            </motion.div>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl border border-border/50 bg-background/50"
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-border/50"
            >
              <SheetHeader className="pb-6 border-b border-border/50">
                <SheetTitle className="font-heading text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 mt-8">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "relative flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 group",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveNavItem"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                        <motion.div
                          className="ml-auto opacity-0 group-hover:opacity-100"
                          initial={false}
                        >
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            →
                          </motion.div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-4 mt-4 border-t border-border/50"
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 font-semibold"
                    >
                      Login
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
