// import React, { useState, useEffect } from "react";
// import { Header } from "../dashboardComponents/Header";
// import { SearchBar } from "../dashboardComponents/SearchBar";
// import { MovieGrid } from "../dashboardComponents/MovieGrid";
// import { GameGrid } from "../dashboardComponents/GameGrid";
// import { MovieDetail } from "../dashboardComponents/MovieDetail";
// import { GameDetail } from "../dashboardComponents/GameDetail";
// import { ContentToggle } from "../dashboardComponents/ContentToggle";
// import { useMovieSearch } from "../hooks/useMovieSearch";
// import { useGameSearch } from "../hooks/useGameSearch";
// import { useTheme } from "../hooks/useTheme";
// import { useLikes } from "../hooks/useLikes";
// import useFetchGames from "../hooks/useFetchGames"; // Importamos el hook para obtener juegos

// export function LoggedInApp() {
//   const [contentType, setContentType] = useState("movies");
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const { theme, toggleTheme } = useTheme();
//   const { isLiked, toggleLike } = useLikes();
//   const {
//     searchQuery: movieSearchQuery,
//     setSearchQuery: setMovieSearchQuery,
//     filteredMovies,
//   } = useMovieSearch();
//   const {
//     searchQuery: gameSearchQuery,
//     setSearchQuery: setGameSearchQuery,
//     filteredGames,
//   } = useGameSearch();

//   // Usamos el hook para obtener los juegos mejor valorados
//   const { games, loading, error } = useFetchGames();

//   const handleMovieClick = (id) => {
//     const movie = filteredMovies.find((m) => m.id === id);
//     if (movie) setSelectedMovie(movie);
//   };

//   const handleGameClick = (id) => {
//     const game = filteredGames.find((g) => g.id === id);
//     if (game) setSelectedGame(game);
//   };

//   const getPageTitle = () => {
//     const searchQuery =
//       contentType === "movies" ? movieSearchQuery : gameSearchQuery;
//     const baseTitle =
//       contentType === "movies" ? "Top Rated Movies" : "Top Rated Games";
//     return searchQuery ? `Search Results: ${searchQuery}` : baseTitle;
//   };

//   return (
//     <div
//       className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors`}
//     >
//       <Header
//         title={getPageTitle()}
//         theme={theme}
//         onThemeToggle={toggleTheme}
//       />

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <ContentToggle activeType={contentType} onToggle={setContentType} />

//         <SearchBar
//           onSearch={
//             contentType === "movies" ? setMovieSearchQuery : setGameSearchQuery
//           }
//         />

//         {contentType === "movies" ? (
//           <MovieGrid
//             movies={filteredMovies}
//             onMovieClick={handleMovieClick}
//             isLiked={(id) => isLiked(`movie-${id}`)}
//             onToggleLike={(id) => toggleLike(`movie-${id}`)}
//           />
//         ) : (
//           // Usamos la lógica de juegos obtenidos
//           <div>
//             {loading && <div>Cargando juegos...</div>}
//             {error && <div>{error}</div>}
//             {!loading && !error && (
//               <GameGrid
//                 games={games} // Pasamos los juegos obtenidos al GameGrid
//                 onGameClick={handleGameClick}
//                 isLiked={(id) => isLiked(`game-${id}`)}
//                 onToggleLike={(id) => toggleLike(`game-${id}`)}
//               />
//             )}
//           </div>
//         )}
//       </main>

//       {selectedMovie && (
//         <MovieDetail
//           movie={selectedMovie}
//           onClose={() => setSelectedMovie(null)}
//           isLiked={isLiked(`movie-${selectedMovie.id}`)}
//           onToggleLike={() => toggleLike(`movie-${selectedMovie.id}`)}
//         />
//       )}

//       {selectedGame && (
//         <GameDetail
//           game={selectedGame}
//           onClose={() => setSelectedGame(null)}
//           isLiked={isLiked(`game-${selectedGame.id}`)}
//           onToggleLike={() => toggleLike(`game-${selectedGame.id}`)}
//         />
//       )}
//     </div>
//   );
// }
