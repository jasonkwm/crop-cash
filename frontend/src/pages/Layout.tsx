import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function Layout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export default Layout;
