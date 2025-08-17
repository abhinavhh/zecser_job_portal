import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Home } from "../pages";
import { SearchPage } from "../pages";
import JobResults from "../pages/JobResults";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchPage />}/>
      <Route path="/jobs" element={<JobResults />} />
      <Route element={<ProtectedRoute />}>
        {/* All protected routes should be here */}
        
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
