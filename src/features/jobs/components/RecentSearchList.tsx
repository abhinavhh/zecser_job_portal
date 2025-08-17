import { ArrowUpLeft, Search } from "lucide-react";

interface RecentSearchListProps {
  searches: string[];
  onSelect: (term: string) => void;
}

const RecentSearchList: React.FC<RecentSearchListProps> = ({
  searches,
  onSelect
}) => {
  return (
    <div className="mt-4 border-t-2 border-ring pt-4 px-4">
      <p className="text-foreground mb-2 text-lg font-extralight">Try searching for</p>
      <ul className="">
        {searches.map((item) => (
          <li
            key={item}
            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-200 px-2 rounded"
            onClick={() => onSelect(item)}
          >
            <div className="flex items-center gap-6">
              <Search size={14} className="text-muted-foreground" />
              <span className="text-foreground">{item}</span>
            </div>
            <ArrowUpLeft size={16} className="text-muted-foreground" />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecentSearchList;
