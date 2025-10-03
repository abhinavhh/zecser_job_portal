import { Bell, ChevronLeft, Funnel } from "lucide-react";

const NotificationHeader = () => {
  return (
    <div className="flex justify-around py-6 items-center">
      <ChevronLeft size={25} className="text-" />
      <div className="flex justify-center gap-1">
        <Bell size={25} className="fill-black"/>
        <h1 className="font-medium text-[16px]">Notification</h1>
      </div>
      <button className="flex gap-1 bg-gray-400 px-4 py-2 rounded-xl">
        <p className="text-xs font-400">Filter</p>
        <Funnel size={16} className="fill-black"/>
      </button>
    </div>
  );
};

export default NotificationHeader;
