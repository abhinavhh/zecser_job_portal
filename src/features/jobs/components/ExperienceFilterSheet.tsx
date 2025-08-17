import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Check } from "lucide-react";

interface ExperienceFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (expFilter: string[]) => void;
}

const ExperienceFilterSheet: React.FC<ExperienceFilterSheetProps> = ({ 
  isOpen, 
  onClose, 
  onApply 
}) => {
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  const experienceOptions = [
    "Internship",
    "Entry level",
    "Associate",
    "Mid-Senior level",
    "Director",
    "Executive"
  ];

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleToggleExperience = (experience: string) => {
    setSelectedExperience(prev => {
      if (prev.includes(experience)) {
        return prev.filter(exp => exp !== experience);
      } else {
        return [...prev, experience];
      }
    });
  };

  const handleApply = () => {
    onApply(selectedExperience);
  };

  const clearAll = () => {
    setSelectedExperience([]);
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-lg max-h-[80vh] flex flex-col"
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
                <h2 className="text-lg font-semibold">Experience Level</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearAll}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Clear
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Apply ({selectedExperience.length})
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-3">
                {experienceOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleToggleExperience(option)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border text-left ${
                      selectedExperience.includes(option)
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                    {selectedExperience.includes(option) && (
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

export default ExperienceFilterSheet;