import {
  createBrowserRouter,

} from "react-router";
import HomePage from "../HomePage/HomePage";
import HomeLayout from "../HomePage/HomeLayout";
import LogIn from "../Components/NavBar/LogIn/LogIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout/>,
    children: [
        {
            path: "/",
            element: <HomePage />
        },
        {
            path: 'login',
            element: <LogIn></LogIn>
        }
    ],
  },
]);