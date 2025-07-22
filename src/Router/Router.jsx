import {
  createBrowserRouter,

} from "react-router";
import HomePage from "../HomePage/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);