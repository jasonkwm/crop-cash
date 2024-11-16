import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import { useWeb3Auth } from "../hooks/useWeb3Auth";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Layout;
