import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
     
        <MainLayout />
      
    ),
    children: [
      {
        path: "/",
        element: (
        <Home />
        ),
      },
      {
        path: "/profile/:id",
        element: (
          
            <Profile />
          
        ),
      },
      {
        path: "/account/edit",
        element: (
          
            <EditProfile />
         
        ),
      },
      {
        path: "/chat",
        element: (
        
            <ChatPage />
       
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
