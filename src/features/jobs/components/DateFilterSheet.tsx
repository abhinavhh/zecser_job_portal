import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Check } from "lucide-react";

interface DateFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (dateFilter: string) => void;
}

const DateFilterSheet: React.FC<DateFilterSheetProps> = ({ 
  isOpen, 
  onClose, 
  onApply 
}) => {
  const [selectedDate, setSelectedDate] = useState("Any time");

  const dateOptions = [
    "Any time",
    "Past 24 hours",
    "Past week",
    "Past month"
  ];

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleApply = () => {
    onApply(selectedDate);
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-lg max-h-[70vh] flex flex-col"
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
                <h2 className="text-lg font-semibold">Date Posted</h2>
              </div>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Apply
              </button>
            </div>

            {/* Options */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                {dateOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedDate(option)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border text-left ${
                      selectedDate === option 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                    {selectedDate === option && (
                      <Check size={20} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DateFilterSheet;