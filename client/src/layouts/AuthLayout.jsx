import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4 bg-chatapp">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8 bg-white">
        <div className="text-center">
          <Link to="/">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/nnmondaychatapp.appspot.com/o/NNMonday_ChatApp_Logo.png?alt=media&token=b2676d57-5e2f-4ca9-b9ef-7e2c0a65e699"
              alt="logo"
              className="w-40 inline-block"
              width={46.5}
              height={34.9}
            />
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
