import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// import { useWeb3Auth } from "../hooks/useWeb3Auth";

function Layout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export default Layout;
