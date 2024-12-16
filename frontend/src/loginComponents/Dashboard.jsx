import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.post(
        `http://${localStorage.getItem(
          "localIp"
        )}:3000/api/auth/delete-account`,
        {
          email,
        }
      );
      localStorage.removeItem("userEmail");
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212]">
      <div className="card shadow-lg w-[24rem] bg-[#1e1e1e] text-[#e0e0e0] border-none">
        <div className="card-body text-center">
          <h2 className="card-title mb-4 text-white">Bienvenido {email}</h2>
          <div className="grid gap-3">
            <button
              onClick={handleLogout}
              className="btn bg-[#3a3a3a] text-white border-none py-2"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={handleDeleteAccount}
              className="btn bg-[#d32f2f] text-white border-none py-2"
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
