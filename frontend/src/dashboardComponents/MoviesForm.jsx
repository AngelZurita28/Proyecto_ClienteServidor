// src/components/MoviesForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import LikeButton from "./LikeButton"; // Importar el componente de LikeButton

export default function MoviesForm() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "b2797cf10c3438c91e2d495177d040e8";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    setMovies(results);
    setMovie(results[0]);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <form onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button>search</button>
      </form>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt={movie.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-4">
                <h4 className="text-center text-lg font-semibold text-gray-800">
                  {movie.title}
                </h4>
                <LikeButton
                  itemId={movie.id}
                  itemType="movie" // Definimos que es una película
                  itemTitle={movie.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
