import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, CheckIcon } from "lucide-react";
import React, { useState } from "react";

// Available job type options
const options = ["Full Time", "Internship", "Temporary", "Contract", "Other"];

interface JobTypeFilterProps {
  isOpen: boolean;                // Controls whether the sheet is visible
  onClose: () => void;            // Callback to close the sheet
  onApply: (selected: string) => void; // Callback when user applies a selection
  initialSelection?: string;      // Default selected option
}

const JobTypeFilterSheet: React.FC<JobTypeFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  initialSelection = options[0], // Default to first option if nothing passed
}) => {
  // Track the currently selected option
  const [selected, setSelected] = useState(initialSelection);

  // Handle final apply action -> send value back + close the sheet
  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay (clicking it closes the sheet) */}
          <motion.div
            className="fixed inset-0 z-40 bg-secondary/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom sheet container */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-secondary shadow-lg shadow-black rounded-t-4xl z-50 py-4 max-h-[50vh] overflow-y-auto"
            initial={{ y: "100%" }}   // Start hidden below screen
            animate={{ y: 0 }}        // Slide up into view
            exit={{ y: "100%" }}      // Slide down on exit
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Drag handle bar at the top of the sheet */}
            <div className="flex justify-center p-2">
              <div className="w-18 h-1 bg-foreground rounded-full" />
            </div>

            {/* Title */}
            <h2 className="text-center text-xl font-semibold pb-6 pt-2 mb-8 border-b-1 border-foreground">
              Job type
            </h2>

            {/* Option buttons */}
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-wrap gap-6 justify-evenly mb-6 px-12">
                {options.map((opt) => (
                  <button
                    key={opt}
                    className={`py-1.5 px-2 rounded-full border-1 border-muted-foreground flex justify-around items-center gap-1 ${
                      selected === opt
                        ? "bg-primary text-secondary" // Highlight when selected
                        : "bg-primary-foreground text-foreground"
                    }`}
                    onClick={() => setSelected(opt)}
                  >
                    {/* Label + conditional icon (check when selected, plus otherwise) */}
                    {opt}{" "}
                    {selected === opt ? (
                      <CheckIcon size={18} />
                    ) : (
                      <PlusIcon size={18} />
                    )}
                  </button>
                ))}
              </div>

              {/* Action button to confirm selection */}
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

export default JobTypeFilterSheet;
