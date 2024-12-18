import React, { useEffect, useState } from "react";
import axios from "axios";
import LikeButton from "./LikeButton";

export default function LikedMoviesForm() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "b2797cf10c3438c91e2d495177d040e8";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w342";

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLikedMovies = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      try {
        // Obtenemos los IDs de las películas likeadas desde la API local
        const likedMoviesResponse = await axios.get(
          `http://localhost:5070/api/likes/checklikes?type=movie&email=${userEmail}`
        );
        const likedMovieIds = likedMoviesResponse.data; // Lista de IDs de películas likeadas

        // Realizamos la solicitud para obtener los detalles de las películas likeadas
        const {
          data: { results },
        } = await axios.get(`${API_URL}/discover/movie`, {
          params: {
            api_key: API_KEY,
          },
        });

        // Filtramos las películas para que solo se muestren las likeadas
        const likedMovies = results.filter((movie) =>
          likedMovieIds.includes(movie.id)
        );

        setMovies(likedMovies);
      } catch (error) {
        console.error("Error fetching liked movies:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLikedMovies(); // Cargamos las películas likeadas al montar el componente
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-center text-red-500 font-semibold">Cargando...</p>
        ) : (
          <>
            {movies.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">
                No tienes películas likeadas.
              </p>
            ) : (
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
                    />
                    <div className="p-4 text-center">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {movie.title}
                      </h4>
                      <LikeButton
                        itemId={movie.id}
                        itemType="movie"
                        itemName={movie.title}
                        itsliked={true} // Dado que todas las películas mostradas son likeadas
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
