import { Outlet } from "react-router-dom";
import DashboardLayout from "../../components/Common/Layout/Dashboard";

const Dashboard = () => {
  return (
    <>
      <DashboardLayout />
      <div
        id="main-content"
        className="relative overflow-hidden ml-64 h-full mt-24"
      >
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
