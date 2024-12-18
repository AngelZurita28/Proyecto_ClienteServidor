import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getLocalIp = async () => {
    try {
      const response = await axios.get(
        "http://10.103.4.180:5070/api/auth/get-ip"
      );
      return response.data.ip;
    } catch (error) {
      console.error("Error al obtener la IP local", error);
      return "localhost"; // Valor por defecto si hay un error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localIp = await getLocalIp();
    localStorage.setItem("localIp", localIp);
    window.alert(localStorage.getItem("localIp"));
    try {
      const response = await axios.post(
        `http://${localStorage.getItem("localIp")}:5070/api/auth/register`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("userEmail", email);
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-100">
          Registrarse
        </h2>

        {error && (
          <div
            className="p-2 text-sm text-red-700 bg-red-500 rounded"
            role="alert"
          >
            {error}
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-sm border rounded-md shadow-sm bg-gray-700 text-gray-100 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Registrarse
            </button>
          </div>

          <div className="text-center mt-3">
            <a href="/" className="text-sm text-blue-400 hover:underline">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
