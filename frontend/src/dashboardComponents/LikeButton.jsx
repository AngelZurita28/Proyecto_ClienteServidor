// src/components/LikeButton.js
import React, { useState } from "react";
import axios from "axios";
import { HeartIcon as HeartSolid } from "@heroicons/react/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/outline";

function LikeButton({ itemId, itemType, itemName, itsliked }) {
  const [liked, setLiked] = useState(itsliked);
  const [hovered, setHovered] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  const handleLike = async () => {
    let action = 1;
    window.alert("El nombre es" + itemName + "  Y el id es: " + itemId);
    if (!userEmail) {
      alert("Por favor, inicia sesión para dar me gusta.");
      return;
    }

    if (liked) {
      action = -1;
    }
    window.alert(action);
    const apiUrl =
      itemType === "movie"
        ? "http://localhost:5070/api/likes/movie"
        : "http://localhost:5070/api/likes/marvel"; // Cambia la URL según corresponda
    window.alert(apiUrl);
    try {
      // Aquí pasamos el movieName (nombre de la película) en el cuerpo de la solicitud
      const response = await axios.post(apiUrl, {
        userEmail: userEmail,
        itemId: itemId,
        itemName: itemName,
        itemAction: action,
      });

      if (response.status === 200) {
        setLiked(!liked);
        alert(`Te ha gustado: ${itemName}`);
      }
    } catch (error) {
      console.error("Error al dar me gusta:", error);
      alert("Hubo un error al dar me gusta.");
    }
  };

  return (
    <>
      <button
        onClick={handleLike}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex items-center justify-center p-2 rounded-full 
                  transition duration-300 ease-in-out 
                  ${
                    liked
                      ? "bg-red-100 hover:bg-red-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
      >
        {liked ? (
          hovered ? (
            <HeartOutline className="w-6 h-6 text-red-500" />
          ) : (
            <HeartSolid className="w-6 h-6 text-red-500" />
          )
        ) : (
          <HeartOutline className="w-6 h-6 text-gray-500" />
        )}
      </button>
    </>
  );
}

export default LikeButton;
