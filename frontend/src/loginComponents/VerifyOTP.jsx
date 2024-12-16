import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Verifica si el valor ingresado es un dígito
    if (/^\d{0,1}$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Si se ingresó un valor, mueve el foco al siguiente input
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convierte el arreglo otp en una cadena de texto
    const otpString = otp.join("");

    try {
      // Envia la solicitud con la cadena de OTP
      await axios.post(
        `http://${localStorage.getItem("localIp")}:5070/api/auth/verify-otp`,
        {
          email,
          otp: otpString, // Envia el OTP como una cadena
        }
      );
      navigate("/reset-password");
    } catch (error) {
      setError(error.response?.data?.message || "Error al verificar el código");
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212]">
      <div className="w-full max-w-md bg-[#1e1e1e] text-[#e0e0e0] rounded-xl p-5 shadow-lg">
        <div className="text-center">
          <h2 className="text-white mb-4 text-2xl font-bold">
            Verificar Código
          </h2>

          {error && (
            <div className="bg-[#ff0000] border-[#ff3333] text-white px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className="mb-4 flex gap-2">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={otp[index] || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  maxLength="1"
                  className="w-[40px] h-[40px] text-center text-[#e0e0e0] bg-[#2d2d2d] font-size-[20px] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#6441a5] transition-all duration-300"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isOtpComplete}
              className={`${
                isOtpComplete
                  ? "bg-[#6441a5] cursor-pointer"
                  : "bg-[#3a3a3a] cursor-not-allowed"
              } text-white py-3 rounded-lg font-bold w-full mt-4 transition-all duration-300`}
              style={{
                opacity: isOtpComplete ? 1 : 0.6,
              }}
            >
              Verificar Código
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
