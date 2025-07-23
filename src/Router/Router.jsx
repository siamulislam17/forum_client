import {
  createBrowserRouter,

} from "react-router";
import HomePage from "../HomePage/HomePage";
import HomeLayout from "../HomePage/HomeLayout";
import LogIn from "../Components/NavBar/LogIn/LogIn";
import SignUp from "../Components/SignUp/SignUp";
import PrivateRoute from "../PrivateRoutes/PrivateRouteUser/PrivateRoute";
import Membership from "../Pages/Membership/Membersip";
import DashBoardLayOut from "../DashBoard/DashBoardLayOut/DashBoardLayOut";

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
        },
        {
            path: 'membership',
            element: <PrivateRoute>
                <Membership></Membership>
                
            </PrivateRoute>
        }
    ],
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashBoardLayOut></DashBoardLayOut></PrivateRoute>,
    children:[
        {

        }
    ]
  }
]);