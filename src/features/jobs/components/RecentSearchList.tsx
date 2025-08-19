import { ArrowUpLeft, Search } from "lucide-react";

interface RecentSearchListProps {
  searches: string[];              // Array of recent search terms
  onSelect: (term: string) => void; // Callback when a term is selected
}

const RecentSearchList: React.FC<RecentSearchListProps> = ({
  searches,
  onSelect,
}) => {
  // Don't render anything if there are no recent searches
  if (searches.length === 0) {
    return null;
    // Alternatively:
    // return <p className="text-muted-foreground px-4 mt-4">No recent searches</p>;
  }

  return (
    <div className="mt-4 border-t-2 border-ring pt-4 px-4">
      {/* Section heading */}
      <p className="text-foreground mb-2 text-lg font-extralight">
        Try searching for
      </p>

      {/* List of recent searches */}
      <ul>
        {searches.map((item) => (
          <li
            key={item}
            role="button" // Accessibility improvement
            tabIndex={0}  // Makes it keyboard navigable
            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-200 px-2 rounded"
            onClick={() => onSelect(item)} // Pass the clicked term back to parent
            onKeyDown={(e) => {
              if (e.key === "Enter") onSelect(item); // Keyboard support
            }}
          >
            {/* Left side: search icon + search term */}
            <div className="flex items-center gap-6">
              <Search size={14} className="text-muted-foreground" />
              <span className="text-foreground">{item}</span>
            </div>

            {/* Right side: "recent" indicator icon */}
            <ArrowUpLeft size={16} className="text-muted-foreground" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearchList;
