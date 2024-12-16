import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../loginComponents/LoginForm";
import RegisterForm from "../loginComponents/RegisterForm";
import Dashboard from "../loginComponents/Dashboard";
import ForgotPassword from "../loginComponents/ForgotPassword";
import VerifyOTP from "../loginComponents/VerifyOTP";
import ResetPassword from "../loginComponents/ResetPassword";

export function LoggedOutApp({ onLogin }) {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}
