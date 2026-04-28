import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";

/**
 * Props cho Base Modal
 * (Thuộc tính cho Modal cơ sở)
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, description, children, className }: ModalProps) => {
  // Bịt scroll khi modal mở (Prevent scroll)
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Lớp nền mờ Glassmorphism */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Content - Nội dung Modal */}
      <div className={cn(
        "relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
            {description && <p className="text-sm text-slate-400 font-bold">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};