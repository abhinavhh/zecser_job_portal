import type { FilterOptions } from "../hooks/useFilter";

interface Props {
  selectedFilter: FilterOptions;
  filterNotifications: typeof import("../data/mock.data").mockNotifications;
}
const NotificationBody = ({ selectedFilter, filterNotifications }: Props) => {
  return (
    <div className="p-4 space-y-4">
      <div
        className={` ${
          selectedFilter === "all"
            ? "flex items-center justify-end w-full text-muted-foreground pr-4"
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
          className="flex flex-col gap-2 p-6 rounded-lg shadow-md"
        >
          {/* Top Row: Image + Text */}
          <div className="flex items-center gap-6 justify-center">
            <img
              src={n.image}
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-lg flex-1">{n.text}</p>
          </div>

          {/* Bottom Row: Link (left) + Date (right) */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1 ml-16">
            {n.link  && n.type === "post" ? (
              <a href={n.link} className="text-blue-500 hover:underline">
                View Details
              </a>
              
            ) : n.type === "preference" ? (
              <button className="border border-primary py-1 px-3 rounded-xl text-foreground text-sm font-normal">Apply</button> // placeholder for alignment
            ) : (
              <span></span>
            )}
            <span>{n.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationBody;
