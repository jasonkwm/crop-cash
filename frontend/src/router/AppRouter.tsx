import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home";
import Layout from "../pages/Layout";

const browserRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={browserRouter} />;
};

export default AppRouter;
