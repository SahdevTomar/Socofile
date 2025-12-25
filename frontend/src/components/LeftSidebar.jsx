import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUpDown } from 'lucide-react/dist/cjs/lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';




export default function LeftSidebar() {
  
const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUpDown />, text: "Trending" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Likes" },
  { icon: <PlusSquare />, text: "Home" },
  {
    icon: (
      <Avatar className="w-6 h-6">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: " Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];

const navigate = useNavigate();
const logoutHandler = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/v1/user/logout");
    if (res.data.success) {
      navigate("/login");
      toast.success(res.data.message);
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
  };
  
  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
   }
}
  return (
    <div className='"fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
      <div className="flex flex-col ">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
