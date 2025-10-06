import { Bell, ChevronLeft, Funnel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../components/ui/select";
import type { FilterOptions } from "../hooks/useFilter";
import { Link } from "react-router-dom";

interface Props {
  selectedFilter: FilterOptions;
  handleFilterChange: (value: FilterOptions) => void;
}
const NotificationHeader = ({ selectedFilter, handleFilterChange }: Props) => {
  return (
    <div className="flex justify-around py-6 items-center">
      <Link to="/">
        <ChevronLeft size={25} className="hover:text-gray-600" />
      </Link>
      <div className="flex justify-center gap-1">
        <Bell size={25} className="fill-black" />
        <h1 className="font-medium text-[16px]">Notification</h1>
      </div>
      <Select value={selectedFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="border-none bg-gray-300 hover:bg-gray-400 py-0 rounded-3xl">
          <p className="text-sm font-400 text-foreground">Filter</p>
          <Funnel size={16} className="fill-black border-0" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="preference">Job Preference</SelectItem>
          <SelectItem value="post">My Posts</SelectItem>
          <SelectItem value="mention">Mentions</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NotificationHeader;
