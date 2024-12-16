import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

export default function MarvelCharacters() {
  const API_URL = "https://gateway.marvel.com/v1/public";
  const API_KEY = "c1fc1fbcf5ce40c32bfbf0ed1969312f"; // Tu public key
  const PRIVATE_KEY = "8aa6e6b65defb4953bf9805e6a3e970878eb5a9f"; // Tu private key

  const [characters, setCharacters] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  // Función para generar el hash necesario para las solicitudes a la API de Marvel
  const generateHash = () => {
    const timestamp = new Date().getTime(); // Obtener el timestamp actual
    const hash = CryptoJS.MD5(timestamp + PRIVATE_KEY + API_KEY).toString(); // Generar el hash
    return { timestamp, hash };
  };

  const fetchCharacters = async (searchKey) => {
    const { timestamp, hash } = generateHash(); // Obtener timestamp y hash

    const params = {
      apikey: API_KEY,
      hash,
      ts: timestamp, // Timestamp
      limit: 10, // Limitar los resultados a 10 personajes
    };

    if (searchKey) {
      params.nameStartsWith = searchKey; // Buscar personajes que comiencen con el nombre proporcionado
    }

    try {
      const {
        data: {
          data: { results },
        },
      } = await axios.get(`${API_URL}/characters`, { params });
      setCharacters(results);
    } catch (error) {
      console.error("Error fetching Marvel characters:", error);
    }
  };

  const searchCharacters = (e) => {
    e.preventDefault();
    fetchCharacters(searchKey);
  };

  useEffect(() => {
    fetchCharacters(""); // Obtén personajes populares al cargar el componente
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <form onSubmit={searchCharacters}>
        <input
          type="text"
          placeholder="Buscar personaje"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                alt={character.name}
                className="w-full h-96 object-cover"
              />
              <div className="p-4">
                <h4 className="text-center text-lg font-semibold text-gray-800">
                  {character.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
