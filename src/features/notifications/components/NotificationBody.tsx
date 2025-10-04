import type { FilterOptions } from "../hooks/useFilter";

interface Props {
  selectedFilter: FilterOptions;
  filterNotifications: typeof import("../data/mock.data").mockNotifications;
}
const NotificationBody = ({ selectedFilter, filterNotifications }: Props) => {
  return (
    <div className="px-4 py-4 space-y-4">
      <div
        className={`${
          selectedFilter === "all"
            ? "flex items-center justify-end w-full text-muted-foreground"
            : "text-muted-foreground ml-4"
        }`}
      >
        {selectedFilter === "all"
          ? "All"
          : selectedFilter === "preference"
          ? "Job Preference"
          : selectedFilter === "post"
          ? "My Posts"
          : selectedFilter === "mention"
          ? "Mentions"
          : ""}
      </div>
      {filterNotifications.map((n) => (
        <div
          key={n.id}
          className="flex flex-col gap-2 p-3 rounded-lg shadow-md"
        >
          {/* Top Row: Image + Text */}
          <div className="flex items-center gap-3 justify-center">
            <img
              src={n.image}
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-sm flex-1">{n.text}</p>
          </div>

          {/* Bottom Row: Link (left) + Date (right) */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            {n.link ? (
              <a href={n.link} className="text-blue-500 hover:underline">
                View Details
              </a>
            ) : (
              <span></span> // placeholder for alignment
            )}
            <span>{n.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationBody;
