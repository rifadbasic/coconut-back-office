import { createBrowserRouter } from "react-router";
import MainLayout from "../layoutes/MainLayout";
import Home  from "../pages/Home";




const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div>404 Not Found</div>,
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <div>About</div>,
      },
    ],
  },
]);

export default router;