import { createBrowserRouter } from "react-router";
import MainLayout from "../layoutes/MainLayout";
import Home  from "../pages/Home";
import Products from "../pages/products/Products";
import Order from './../pages/order/Order';
import AddProduct from "../pages/products/AddProduct";
import NotFound from "../pages/NotFound";




const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/add-product",
        element: <AddProduct/>,
      },
      {
        path: "/orders",
        element: <Order />,
      },
    ],
  },
]);

export default router;