import React, { useState } from "react";
import MovieSearch from "../dashboardComponents/MoviesForm";
import MarvelCharacters from "../dashboardComponents/MarvelForm";

export function LoggedInApp() {
  // Estado para determinar qué formulario mostrar
  const [activeForm, setActiveForm] = useState("marvel"); // "movies" o "marvel"

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Botones para cambiar entre los formularios */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setActiveForm("movies")}
          className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 transform ${
            activeForm === "movies"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          Películas
        </button>
        <button
          onClick={() => setActiveForm("marvel")}
          className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors duration-300 transform ${
            activeForm === "marvel"
              ? "bg-red-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-red-100"
          }`}
        >
          Personajes Marvel
        </button>
      </div>

      {/* Renderiza el formulario activo */}
      <div className="mt-8">
        {activeForm === "movies" ? <MovieSearch /> : <MarvelCharacters />}
      </div>
    </div>
  );
}
