import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

const options = ["Nirman Academy", "KBros Aristo Pvt Ltd"];

interface CompanyFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selected: string) => void;
  initialSelection?: string;
}

const CompanyFilterSheet: React.FC<CompanyFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  initialSelection = "Anytime",
}) => {
  const [selected, setSelected] = useState(initialSelection);
  const[option, setOptions] = useState<string>("");

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    options.push(option);
    setSelected(option);
  }

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
            {/* Add company list input */}
            <form className="flex justify-center py-2" onSubmit={handleSubmit}>
                <input type="text" name="company" placeholder="Add a company"
                    className="py-4 border-1 border-foreground rounded-lg px-6 w-full mx-2 placeholder-foreground"
                    value={option}
                    onChange={(e) => setOptions(e.target.value)}
                />
            </form>

            {/* Options */}
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-wrap gap-6 justify-between  mb-6 px-12 ">
                {options.map((opt) => (
                  <>
                    <button
                      key={opt}
                      className={`py-1.5 px-2 rounded-full border-1 border-muted-foreground flex justify-around ${
                        selected === opt
                          ? "bg-primary text-secondary"
                          : "bg-primary-foreground text-foreground"
                      }`}
                      onClick={() => setSelected(opt)}
                    >
                      {opt} <PlusIcon size={25}/>
                    </button>
                    
                  </>
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
