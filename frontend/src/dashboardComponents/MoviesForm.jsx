import React, { useEffect, useState } from "react";
import axios from "axios";
import LikeButton from "./LikeButton";
// import image from "../assets/portrait_uncanny.jpg";

export default function MoviesForm() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "b2797cf10c3438c91e2d495177d040e8";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w342";
  const IMAGE_DEFAULT = ".";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";

    // Obtenemos el correo del usuario desde localStorage
    const userEmail = localStorage.getItem("userEmail");

    // Hacemos la solicitud para obtener las películas "likeadas"
    const likedMoviesResponse = await axios.get(
      `http://localhost:5070/api/likes/checklikes?type=movie&email=${userEmail}`
    );
    const likedMovieIds = likedMoviesResponse.data; // Esto es un array de IDs de películas likeadas

    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    // Modificamos las películas para agregarles la propiedad "itsliked"
    const updatedMovies = results.map((movie) => ({
      ...movie,
      itsliked: likedMovieIds.includes(movie.id), // Verificamos si el ID de la película está en la lista de películas likeadas
    }));

    setMovies(updatedMovies);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey); // Llamamos a fetchMovies con el searchKey
  };

  useEffect(() => {
    fetchMovies(""); // Por defecto, traemos películas sin filtrar al cargar el componente
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Formulario de búsqueda */}
      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={searchMovies}
          className="flex justify-center items-center mb-8"
        >
          <input
            type="text"
            placeholder="Buscar película"
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-full max-w-md p-2 rounded-l-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-r-lg hover:bg-red-600 transition duration-300"
          >
            Buscar
          </button>
        </form>

        {/* Grid de películas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 shadow-md rounded-lg overflow-hidden transition transform hover:scale-105 duration-300"
            >
              <img
                src={`${IMAGE_PATH + movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto object-cover"
                onError={(e) => (e.target.src = "/src/assets/image.jpg")} // Cambia a la imagen por defecto si no carga
              />
              <div className="p-4 text-center">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {movie.title}
                </h4>
                <LikeButton
                  itemId={movie.id}
                  itemType="movie"
                  itemName={movie.title}
                  itsliked={movie.itsliked}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
