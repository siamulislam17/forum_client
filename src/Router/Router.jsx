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
import AddPost from "../DashBoard/AddPost/AddPost";
import MyPosts from "../DashBoard/MyPost/MyPost";
import PostDetail from "../Pages/PostDetails/PostDetails";
import CommentPage from "../DashBoard/CommentFidbackPage/CommentFeedback";

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
        },
        {
            path: '/post/:id',
            element: <PostDetail></PostDetail>
        }
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashBoardLayOut></DashBoardLayOut></PrivateRoute>,
    children:[
        {
            path: 'add-post',
            element: <AddPost></AddPost>
        },
        {
            path: 'my-posts',
            element: <MyPosts></MyPosts>
        },
        {
            path: 'comment/:id',
            element: <CommentPage></CommentPage>
        }
    ]
  }
]);