// import React, { useState, useEffect } from "react";
// import "./index.css";
// import { BrowserRouter as Router } from "react-router-dom";
// import { LoggedInApp } from "./components/loggedInApp";
// import { LoggedOutApp } from "./components/loggedOutApp";

// function App() {
// const [isLoggedIn, setIsLoggedIn] = useState();

// const check = () => {
//   if (
//     localStorage.getItem("userEmail") &&
//     localStorage.getItem("userEmail").length > 2
//   ) {
//     window.alert(localStorage.getItem("userEmail"));
//     return true;
//   }
//   return false;
// };

// const handleCleanStorage = () => {
//   localStorage.clear();
//   window.location.reload();
// };

// return (
//   <Router>
//     {check() ? <LoggedInApp /> : <LoggedOutApp />}
//     <button onClick={handleCleanStorage} className="button button-primary">
//       {"borrar localstorage "}
//     </button>
//   </Router>
// );
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./loginComponents/LoginForm";
import RegisterForm from "./loginComponents/RegisterForm";
import Dashboard from "./loginComponents/Dashboard";
import ForgotPassword from "./loginComponents/ForgotPassword";
import VerifyOTP from "./loginComponents/VerifyOTP";
import ResetPassword from "./loginComponents/ResetPassword";
import { LoggedOutApp } from "./components/loggedOutApp";
import { LoggedInApp } from "./components/loggedInApp";

function App() {
  const check = () => {
    if (
      localStorage.getItem("userEmail") &&
      localStorage.getItem("userEmail").length > 2
    ) {
      // window.alert(localStorage.getItem("userEmail"));
      return true;
    }
    return false;
  };

  const handleCleanStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {check() ? (
        <LoggedInApp />
      ) : (
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
      )}

      <button onClick={handleCleanStorage}> limpiar storage</button>
    </>
  );
}

export default App;
