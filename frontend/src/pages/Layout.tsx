import { Outlet } from "react-router-dom";
// import { useWeb3Auth } from "../hooks/useWeb3Auth";

function Layout() {
  return (
    <>
      <div className="flex flex-col overflow-y-scroll h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
