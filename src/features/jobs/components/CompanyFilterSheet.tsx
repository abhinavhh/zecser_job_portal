import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import React, { useState } from "react";

const defaultOptions = ["Nirman Academy", "KBros Aristo Pvt Ltd"];

interface CompanyFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selected: string[]) => void;
  initialSelection?: string[];
}

const CompanyFilterSheet: React.FC<CompanyFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  initialSelection = [],
}) => {
  const [options, setOptions] = useState(defaultOptions);
  const [selected, setSelected] = useState<string[]>(initialSelection || "Any");
  const [input, setInput] = useState("");

  // toggle selection
  const toggleSelection = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
    );
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !options.includes(input)) {
      setOptions((prev) => [...prev, input]);
    }
    if (input.trim()) {
      toggleSelection(input);
    }
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-secondary/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-secondary shadow-lg shadow-black rounded-t-4xl z-50 py-4 max-h-[50vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center p-2">
              <div className="w-18 h-1 bg-foreground rounded-full" />
            </div>

            {/* Title */}
            <h2 className="text-center text-xl font-semibold pb-6 pt-2 mb-8 border-b-1 border-foreground">
              Company
            </h2>

            {/* Add company input */}
            <form className="flex justify-center py-2" onSubmit={handleSubmit}>
              <input
                type="text"
                name="company"
                placeholder="Add a company"
                className="py-4 border-1 border-foreground rounded-lg px-6 w-full mx-2 placeholder-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </form>

            {/* Options */}
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-wrap gap-4 justify-start mb-6 px-6">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`py-1.5 px-3 rounded-full border flex items-center gap-2 ${
                      selected.includes(opt)
                        ? "bg-primary text-secondary border-primary"
                        : "bg-primary-foreground text-foreground border-muted-foreground"
                    }`}
                    onClick={() => toggleSelection(opt)}
                  >
                    {opt}
                    {selected.includes(opt) && <Check size={16} />}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                className="px-28 py-2 bg-primary text-secondary rounded-full text-xl font-semibold"
                onClick={handleApply}
              >
                Show results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompanyFilterSheet;
