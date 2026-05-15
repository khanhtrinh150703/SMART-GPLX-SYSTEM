import { Transition } from "framer-motion";

export const SHARED_SPRING: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 20,
  mass: 1.2,
};

export const VARIANT_CONFIG = {
  emerald: {
    base: "bg-emerald-50 text-emerald-900",
    veil: "bg-emerald-600",
    iconContainer: "bg-white shadow-md text-emerald-600",
    active: "active:bg-emerald-100",
  },
  rose: {
    base: "bg-rose-50 text-rose-900",
    veil: "bg-rose-600",
    iconContainer: "bg-white shadow-md text-rose-600",
    active: "active:bg-rose-100",
  },
  slate: {
    base: "bg-slate-50 text-slate-900 border-2 border-slate-800",
    veil: "bg-slate-800",
    iconContainer: "bg-white shadow-md text-slate-800",
    active: "active:bg-slate-200",
  },
};

