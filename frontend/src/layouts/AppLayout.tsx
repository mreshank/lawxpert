import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col gap-8 items-center--x justify-center--x bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
