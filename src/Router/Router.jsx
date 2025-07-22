import {
  createBrowserRouter,

} from "react-router";
import HomePage from "../HomePage/HomePage";
import HomeLayout from "../HomePage/HomeLayout";
import LogIn from "../Components/NavBar/LogIn/LogIn";
import SignUp from "../Components/SignUp/SignUp";

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
        },
        {
            path: 'signup',
            element: <SignUp></SignUp>
        }
    ],
  },
]);