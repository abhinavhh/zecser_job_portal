import NotificationBody from "../features/notifications/components/NotificationBody";
import NotificationHeader from "../features/notifications/components/NotificationHeader";
import { useFilter } from "../features/notifications/hooks/useFilter";

const NotificationPage = () => {
    const filter = useFilter();
  return (
    <div className="bg-accent">
      <NotificationHeader {...filter}/>
      <NotificationBody {...filter}/>
    </div>
  );
};

export default NotificationPage;
