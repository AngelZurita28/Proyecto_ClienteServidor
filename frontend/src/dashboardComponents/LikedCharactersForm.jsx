import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import LikeButton from "./LikeButton";

export default function LikedMarvelCharacters() {
  const API_URL = "https://gateway.marvel.com/v1/public";
  const API_KEY = "c1fc1fbcf5ce40c32bfbf0ed1969312f";
  const PRIVATE_KEY = "8aa6e6b65defb4953bf9805e6a3e970878eb5a9f";

  const [likedCharacters, setLikedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateHash = () => {
    const timestamp = new Date().getTime();
    const hash = CryptoJS.MD5(timestamp + PRIVATE_KEY + API_KEY).toString();
    return { timestamp, hash };
  };

  const fetchLikedCharacters = async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      try {
        // Llamada a la API local para obtener los IDs de los personajes likeados
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

  const fetchMarvelCharacterDetails = async (characterIds) => {
    const { timestamp, hash } = generateHash();
    const params = {
      apikey: API_KEY,
      hash,
      ts: timestamp,
    };

    try {
      // Realizamos solicitudes individuales por cada ID de personaje likeado
      const characterDetails = await Promise.all(
        characterIds.map(async (id) => {
          try {
            const {
              data: {
                data: { results },
              },
            } = await axios.get(`${API_URL}/characters/${id}`, { params });
            return results[0]; // Devuelve el primer resultado (solo un personaje por ID)
          } catch (error) {
            console.error(
              `Error fetching character details for ID ${id}:`,
              error
            );
            return null;
          }
        })
      );

      // Filtra los resultados para eliminar cualquier valor nulo
      const validCharacters = characterDetails.filter(
        (character) => character !== null
      );

      setLikedCharacters(validCharacters); // Establece los personajes liked con su información detallada
    } catch (error) {
      console.error("Error fetching Marvel characters details:", error);
    }
  };

  useEffect(() => {
    const loadLikedCharacters = async () => {
      setIsLoading(true);
      const likedCharacterIds = await fetchLikedCharacters();
      if (likedCharacterIds.length > 0) {
        await fetchMarvelCharacterDetails(likedCharacterIds);
      }
      setIsLoading(false);
    };
    loadLikedCharacters();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-center text-red-500 font-semibold">Cargando...</p>
        ) : (
          <>
            {likedCharacters.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">
                No tienes personajes likeados.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {likedCharacters.map((character) => (
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
                        itsliked={true}
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
