import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Home } from "../pages";
// import { SearchPage } from "../pages";
import JobResults from "../pages/JobPage";
import DateFilterSheet from "../features/jobs/components/DateFilterSheet";
import NotificationPage from "../pages/NotificationPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/search" element={<SearchPage />}/> */}
      <Route path="/jobs" element={<JobResults />} />
      <Route
        path="/filter/date"
        element={
          <DateFilterSheet
            isOpen={true}
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
            onApply={function (selected: string): void {
              throw new Error("Function not implemented.");
            }}
          />
        }
      />
      <Route path="/notification" element={<NotificationPage />} />
      <Route element={<ProtectedRoute />}>
        {/* All protected routes should be here */}

        {/* <Route path="/profile" element={<Profile />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
