import React, { useState } from "react";
import { FilmIcon, UserIcon, HeartIcon } from "@heroicons/react/solid"; // Importamos íconos adicionales
import MoviesForm from "../dashboardComponents/MoviesForm";
import MarvelForm from "../dashboardComponents/MarvelForm";
import LikedCharactersForm from "../dashboardComponents/LikedCharactersForm"; // Importa el nuevo componente
import LikedMoviesForm from "../dashboardComponents/LikedMoviesForm"; // Importamos el nuevo formulario de películas likeadas

export function LoggedInApp() {
  const [activeForm, setActiveForm] = useState("movies"); // Puede ser "movies", "marvel", "liked_characters", "liked_movies"

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
      {/* Encabezado */}
      <div className="container mx-auto px-4 flex justify-between items-center mb-8">
        {/* Sección de Movies y Characters */}
        <div className="relative flex w-1/3 bg-gray-800 rounded-full">
          <button
            onClick={() => setActiveForm("movies")}
            className={`relative z-10 flex items-center justify-center w-1/2 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
              activeForm === "movies"
                ? "bg-blue-500 text-white"
                : "bg-gray-600 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <FilmIcon className="w-5 h-5 mr-2" />
            Movies
          </button>
          <button
            onClick={() => setActiveForm("marvel")}
            className={`relative z-10 flex items-center justify-center w-1/2 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
              activeForm === "marvel"
                ? "bg-blue-500 text-white"
                : "bg-gray-600 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <UserIcon className="w-5 h-5 mr-2" />
            Characters
          </button>
        </div>

        {/* Sección de Liked Characters y Liked Movies */}
        <div className="relative flex w-1/3 bg-gray-800 rounded-full">
          <button
            onClick={() => setActiveForm("liked_characters")}
            className={`relative z-10 flex items-center justify-center w-1/2 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
              activeForm === "liked_characters"
                ? "bg-red-500 text-white"
                : "bg-gray-600 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <HeartIcon className="w-5 h-5 mr-2" />
            Liked Characters
          </button>
          <button
            onClick={() => setActiveForm("liked_movies")}
            className={`relative z-10 flex items-center justify-center w-1/2 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
              activeForm === "liked_movies"
                ? "bg-red-500 text-white"
                : "bg-gray-600 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <HeartIcon className="w-5 h-5 mr-2" />
            Liked Movies
          </button>
        </div>

        {/* Botón de cerrar sesión (al final, alineado a la derecha) */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Contenido dinámico */}
      <div className="container mx-auto px-4">
        {activeForm === "movies" && <MoviesForm />}
        {activeForm === "marvel" && <MarvelForm />}
        {activeForm === "liked_characters" && <LikedCharactersForm />}
        {activeForm === "liked_movies" && <LikedMoviesForm />}
      </div>
    </div>
  );
}
