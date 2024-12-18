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

        [HttpGet("movie/")]
        public IActionResult GetMovie()
        {
            Movie movie = null;

            // Establecer la conexión con MySQL
            using (var connection = new MySqlConnection(connectionString))
            {
                string query = "SELECT * FROM MovieLikes"; // Consulta para obtener todos los datos de la tabla MovieLikes
                MySqlCommand command = new MySqlCommand(query, connection);

                try
                {
                    connection.Open();

                    var liked = new List<Dictionary<string, object>>(); // Lista para almacenar los datos de cada fila como diccionarios

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var row = new Dictionary<string, object>();

                            // Leer todos los campos de la fila
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.GetValue(i); // Añadir el campo y su valor a un diccionario
                            }

                            liked.Add(row); // Añadir la fila (diccionario) a la lista
                        }
                    }

                    // Devolver la lista de elementos en formato JSON
                    return Ok(liked);
                }
                catch (Exception ex)
                {
                    // Manejo de errores en caso de falla en la conexión
                    return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
                }
            }
        }

        [HttpGet("likes/{type}")]
        public IActionResult GetLikedMovies(string type, [FromQuery] string email) 
        {
            // Verifica si la cadena de conexión está configurada
            if (string.IsNullOrEmpty(connectionString))
            {
                return StatusCode(500, "Connection string no configurada.");
            }

            // Validar el tipo de tabla para evitar inyección SQL
            var validTypes = new HashSet<string> { "movie", "character" }; // Ahora los tipos válidos son "movie" y "character"
            if (!validTypes.Contains(type.ToLower())) // Convertir a minúsculas para asegurar comparación sin importar el caso
            {
                return BadRequest("Tipo no válido.");
            }

            try
            {
                // Establecer la conexión con MySQL
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open(); // Asegúrate de abrir la conexión

                    // Obtener el id del usuario con el correo proporcionado
                    var getUserIdCmd = new MySqlCommand(
                        "SELECT id FROM usuario WHERE correo = @Email",
                        connection
                    );
                    getUserIdCmd.Parameters.AddWithValue("@Email", email);
                    var userId = getUserIdCmd.ExecuteScalar() as int?;

                    if (userId == null)
                    {
                        return NotFound("El usuario no fue encontrado.");
                    }

                    // Construcción dinámica de la consulta SQL usando el tipo
                    var query = $@"SELECT {type}_id FROM User{char.ToUpper(type[0]) + type.Substring(1)}Likes WHERE user_id = @UserId AND action = 1";

                    // Obtener los elementos (películas o personajes) "liked"
                    var command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@UserId", userId);

                    // Ejecutar la consulta y leer los resultados
                    var liked = new List<int>();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            liked.Add(reader.GetInt32($"{type}_id")); // Leer el valor de movie_id o character_id
                        }
                    }

                    // Devolver la lista de elementos en formato JSON
                    return Ok(liked);
                }
            }
            catch (Exception ex)
            {
                // Manejo de excepciones
                return StatusCode(500, $"Ocurrió un error: {ex.Message}");
            }
        }
    }
}
