import { X, MapPin, Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
  placeholder: string;
  icon?: "search" | "location";
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  readonly?: boolean;
  showLocationIcon?: boolean;
  onClose?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  icon = "search",
  value,
  onChange,
  onClear,
  readonly = false,
  onKeyDown,
  showLocationIcon = false
}) => {
  const IconComponent = icon === "search" ? Search : MapPin;

  return (
    <div className="flex items-center justify-center gap-4 bg-background w-full rounded-3xl px-3 py-2 shadow-[1px_4px_12px_0px_rgba(0,0,0,0.25)]  md:max-w-full">
      <IconComponent size={25} className="text-secondary-foreground" />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => !readonly && onChange(e.target.value)}
        onKeyDown={onKeyDown}
        readOnly={readonly}
        className={`flex-1 bg-transparent outline-none placeholder:text-foreground ${
          readonly ? "cursor-pointer" : ""
        }`}
      />
      {value && !readonly && (
        <button onClick={onClear}>
          <X size={16} className="text-muted-foreground" />
        </button>
      )}
    </div>
    
  );
};

export default SearchBar;
