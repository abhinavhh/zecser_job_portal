import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";
import { Switch } from "../../../components/ui/switch";

interface EasyApplyFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (easyApplyFilter: boolean) => void;
}

const EasyApplyFilterSheet: React.FC<EasyApplyFilterSheetProps> = ({ 
  isOpen, 
  onClose, 
  onApply 
}) => {
  const [easyApplyOnly, setEasyApplyOnly] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleApply = () => {
    onApply(easyApplyOnly);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-lg max-h-[50vh] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center p-2">
              <div className="w-12 h-1.5 bg-muted-foreground rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <button onClick={onClose}>
                  <ArrowLeft size={20} className="text-muted-foreground" />
                </button>
                <h2 className="text-lg font-semibold">Easy Apply</h2>
              </div>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Apply
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h3 className="font-medium">Easy Apply only</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show only jobs that allow easy application
                  </p>
                </div>
                <Switch 
                  checked={easyApplyOnly}
                  onCheckedChange={setEasyApplyOnly}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EasyApplyFilterSheet;