// src/components/LikeButton.js
import React, { useState } from "react";
import axios from "axios";

function LikeButton({ itemId, itemType, itemTitle }) {
  const [liked, setLiked] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  const handleLike = async () => {
    if (!userEmail) {
      alert("Por favor, inicia sesión para dar me gusta.");
      return;
    }

    try {
      const apiUrl =
        itemType === "movie"
          ? "http://localhost:5070/api/likes/movie"
          : "http://localhost:5070/api/likes/marvel"; // Cambia la URL según corresponda

      // Aquí pasamos el movieName (nombre de la película) en el cuerpo de la solicitud
      const response = await axios.post(apiUrl, {
        userEmail: userEmail,
        movieId: itemType === "movie" ? itemId : undefined,
        movieName: itemType === "movie" ? itemTitle : undefined, // Enviar el nombre de la película
        marvelCharacterId: itemType === "marvel" ? itemId : undefined,
      });

      if (response.status === 200) {
        setLiked(true);
        alert(`Te ha gustado: ${itemTitle}`);
      }
    } catch (error) {
      console.error("Error al dar me gusta:", error);
      alert("Hubo un error al dar me gusta.");
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded-lg ${
        liked ? "bg-green-500" : "bg-gray-300"
      }`}
      disabled={liked}
    >
      {liked ? "¡Te gusta!" : "Dar Me Gusta"}
    </button>
  );
}

export default LikeButton;
