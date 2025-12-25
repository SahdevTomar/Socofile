import React from "react";
import LeftSidebar from "./LeftSidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">
      <LeftSidebar />

      {/* 👇 All child pages (Home, Profile, etc) will render here */}
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
