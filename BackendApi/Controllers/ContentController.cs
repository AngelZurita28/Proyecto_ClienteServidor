using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using BackendApi.Models;
using System.Data;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        // Cadena de conexión a MySQL
        private readonly string connectionString = "Server=localhost;Database=practica;User=root;Password=181117;";

        // Modelo para la película

        // GET api/movies/{id}
        [HttpGet("movie/{id}")]
        public IActionResult GetMovie(int id)
        {
            Movie movie = null;

            // Establecer la conexión con MySQL
            using (var connection = new MySqlConnection(connectionString))
            {
                string query = "SELECT * FROM MovieLikes WHERE movie_id = @movie_id";
                MySqlCommand command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@movie_id", id);

                try
                {
                    connection.Open();

                    // Ejecutar la consulta y leer el resultado
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            movie = new Movie
                            {
                                MovieId = reader.GetInt32("movie_id"),
                                MovieName = reader.GetString("movie_name"),
                                LikeCount = reader.GetInt32("like_count")
                            };
                        }
                    }

                    // Si no se encuentra la película
                    if (movie == null)
                    {
                        return NotFound(new { message = "Película no encontrada" });
                    }

                    // Retornar la película encontrada
                    return Ok(movie);
                }
                catch (Exception ex)
                {
                    // Manejo de errores en caso de falla en la conexión
                    return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
                }
            }
        }
    }
}
