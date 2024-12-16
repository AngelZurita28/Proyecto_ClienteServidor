import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post(
        `http://${localStorage.getItem(
          "localIp"
        )}:5070/api/auth/reset-password`,
        {
          email,
          password,
        }
      );

      localStorage.removeItem("resetEmail");
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al actualizar la contraseña"
      );
    }
  };

  // Validación para habilitar el botón
  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [password, confirmPassword]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212]">
      <div className="w-full max-w-md bg-[#1e1e1e] text-[#e0e0e0] rounded-xl p-5 shadow-lg">
        <div className="text-center">
          <h2 className="text-white mb-4 text-2xl font-bold">
            Nueva Contraseña
          </h2>

          {error && (
            <div className="bg-[#f44336] border border-[#d32f2f] text-white px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2 text-[#e0e0e0]"
              >
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2d2d2d] text-[#e0e0e0] text-center rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition duration-300"
                required
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold mb-2 text-[#e0e0e0]"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2d2d2d] text-[#e0e0e0] text-center rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`${
                isFormValid
                  ? "bg-[#4CAF50] cursor-pointer"
                  : "bg-[#2d2d2d] cursor-not-allowed"
              } text-white py-2 px-4 rounded-lg font-bold w-full mt-4 transition duration-300`}
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
