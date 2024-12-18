import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import LikeButton from "./LikeButton";

export default function MarvelCharacters() {
  const API_URL = "https://gateway.marvel.com/v1/public";
  const API_KEY = "c1fc1fbcf5ce40c32bfbf0ed1969312f";
  const PRIVATE_KEY = "8aa6e6b65defb4953bf9805e6a3e970878eb5a9f";

  const [characters, setCharacters] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const generateHash = () => {
    const timestamp = new Date().getTime();
    const hash = CryptoJS.MD5(timestamp + PRIVATE_KEY + API_KEY).toString();
    return { timestamp, hash };
  };

  const fetchLikedCharacters = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      try {
        const likedCharactersResponse = await axios.get(
          `http://localhost:5070/api/likes/checklikes?type=character&email=${userEmail}`
        );
        return likedCharactersResponse.data; // Lista de IDs de personajes likeados
      } catch (error) {
        console.error("Error fetching liked characters:", error);
      }
    }
    return [];
  };

  const fetchCharacters = async (newSearchKey = "", newOffset = 0) => {
    setIsLoading(true);
    const { timestamp, hash } = generateHash();

    const params = {
      apikey: API_KEY,
      hash,
      ts: timestamp,
      limit: 10,
      offset: newOffset,
    };

    if (newSearchKey) {
      params.nameStartsWith = newSearchKey;
    }

    try {
      const {
        data: {
          data: { results, total },
        },
      } = await axios.get(`${API_URL}/characters`, { params });

      // Obtenemos los personajes likeados
      const likedCharacterIds = await fetchLikedCharacters();

      // Actualizamos los personajes con el estado de "like"
      const updatedCharacters = results.map((character) => ({
        ...character,
        itsliked: likedCharacterIds.includes(character.id), // Verificamos si está en la lista de personajes likeados
      }));

      // Si el offset es 0 (nueva búsqueda), reemplazamos los personajes
      if (newOffset === 0) {
        setCharacters(updatedCharacters);
      } else {
        setCharacters((prevCharacters) => [
          ...prevCharacters,
          ...updatedCharacters,
        ]);
      }

      setTotalResults(total);
    } catch (error) {
      console.error("Error fetching Marvel characters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCharacters = (e) => {
    e.preventDefault();
    setOffset(0);
    fetchCharacters(searchKey, 0);
  };

  const loadMoreCharacters = () => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    fetchCharacters(searchKey, newOffset);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={searchCharacters}
          className="flex justify-center items-center mb-8"
        >
          <input
            type="text"
            placeholder="Buscar personaje"
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

        {isLoading && offset === 0 && (
          <p className="text-center text-red-500 font-semibold">Cargando...</p>
        )}

        {!isLoading && characters.length === 0 && (
          <p className="text-center text-gray-400 text-lg">
            No se encontraron personajes. Intenta otra búsqueda.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-gray-800 shadow-md rounded-lg overflow-hidden transition transform hover:scale-105 duration-300"
            >
              <img
                src={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
                alt={character.name}
                className="w-full h-84 object-cover"
              />
              <div className="p-4 text-center">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {character.name}
                </h4>
                <LikeButton
                  itemId={character.id}
                  itemType="marvel"
                  itemName={character.name}
                  itsliked={character.itsliked}
                />
              </div>
            </div>
          ))}
        </div>

        {!isLoading &&
          characters.length > 0 &&
          characters.length < totalResults && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreCharacters}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Cargar más
              </button>
            </div>
          )}

        {isLoading && offset > 0 && (
          <div className="text-center mt-4 text-red-500">Cargando más...</div>
        )}
      </div>
    </div>
  );
}
