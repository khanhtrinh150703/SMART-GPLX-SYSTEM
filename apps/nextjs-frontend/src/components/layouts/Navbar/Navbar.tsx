"use client";
import { motion } from "framer-motion";
import { NAV_LINKS } from "./nav.constants";
import { cn } from "@/lib/utils/utils";
import Button from "@/components/ui/Button/Button";
import { Logo } from "@/components/ui/Logo/Logo";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Logo />
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "transition-colors hover:text-emerald-600 relative py-2",
                link.active &&
                  "text-slate-900 font-semibold after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-500 after:rounded-full",
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            href={"/register"}
            variant="outline"
            className="hidden sm:flex rounded-2xl"
          >
            Đăng ký
          </Button>
          <Button
            href={"/login"}
            className="rounded-2xl shadow-emerald-600/20 shadow-lg px-6"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};
