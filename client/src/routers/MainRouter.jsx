import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "../screens/Homepage";
import Register from "../screens/auth/Register";
import Error from "../screens/Error";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../screens/auth/Login";
import VerifyEmail from "../screens/auth/VerifyEmail";
import ForgotPassword from "../screens/auth/ForgotPassword";

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:verificationCode" element={<VerifyEmail />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}
