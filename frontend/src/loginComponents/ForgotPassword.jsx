import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://${localStorage.getItem(
          "localIp"
        )}:5070/api/auth/forgot-password`,
        {
          email,
        }
      );
      localStorage.setItem("resetEmail", email);
      setSuccess("Código enviado al correo");
      setTimeout(() => {
        navigate("/verify-otp");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error al enviar el código");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-100">
          Recuperar Contraseña
        </h2>

        {error && (
          <div
            className="p-2 text-sm text-red-700 bg-red-500 rounded"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="p-2 text-sm text-green-700 bg-green-500 rounded"
            role="alert"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-sm border rounded-md shadow-sm bg-gray-700 text-gray-100 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enviar Código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
