import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home";
import Chart from "../pages/chart";
import Layout from "../pages/Layout";
import ApplyLoan from "../pages/ApplyLoan";

const browserRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/apply-loan",
        element: <ApplyLoan />,
      },
      {
        path: "/chart",
        element: <Chart />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={browserRouter} />;
};

export default AppRouter;
