import { Outlet } from "react-router-dom";
// import { useWeb3Auth } from "../hooks/useWeb3Auth";

function Layout() {
  return (
    <>
      <div className="flex overflow-y-scroll h-screen w-screen">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
