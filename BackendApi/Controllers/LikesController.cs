using System;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly string connectionString =
            "Server=localhost;Database=practica;User=root;Password=181117;";

        // POST api/likes/movie
        [HttpGet("checklikes")]
        public IActionResult GetLikedMovies(string type, string email) 
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


        


        [HttpPost("movie")]
        public IActionResult LikeMovie([FromBody] LikeRequest request)
        {
            try
            {
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    // Obtener user_id con el email
                    var getUserIdCmd = new MySqlCommand(
                        "SELECT id FROM usuario WHERE correo = @Email",
                        connection
                    );
                    getUserIdCmd.Parameters.AddWithValue("@Email", request.UserEmail);
                    var userId = getUserIdCmd.ExecuteScalar() as int?;

                    if (!userId.HasValue)
                    {
                        return BadRequest("User not found");
                    }

                    var checkLikeExistsCmd = new MySqlCommand(
                        @"SELECT COUNT(1) FROM UserMovieLikes WHERE movie_id = @ItemId
                        AND user_id = @UserId AND action = @Action",
                        connection
                    );
                    checkLikeExistsCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                    checkLikeExistsCmd.Parameters.AddWithValue("@UserId", userId.Value);
                    checkLikeExistsCmd.Parameters.AddWithValue("@Action", request.ItemAction);
                    var likeExist = Convert.ToInt32(checkLikeExistsCmd.ExecuteScalar()) > 0;

                    // Verificar si la película ya está registrada en MovieLikes
                    var checkMovieExistsCmd = new MySqlCommand(
                        "SELECT COUNT(1) FROM MovieLikes WHERE movie_id = @ItemId",
                        connection
                    );
                    checkMovieExistsCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                    var movieExists = Convert.ToInt32(checkMovieExistsCmd.ExecuteScalar()) > 0;
                    
                    if(!likeExist)
                    {
                        if (!movieExists)
                        {
                            // Si la película no existe en MovieLikes, insertarla con like_count = 1 y movie_name
                            var insertMovieLikesCmd = new MySqlCommand(
                                "INSERT INTO MovieLikes (movie_id, like_count, movie_name) VALUES (@ItemId, 1, @ItemName)",
                                connection
                            );
                            insertMovieLikesCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                            insertMovieLikesCmd.Parameters.AddWithValue(
                                "@ItemName",
                                request.ItemName
                            );
                            insertMovieLikesCmd.ExecuteNonQuery();
                        }
                        else
                        {
                            
                            // Si la película ya existe, simplemente incrementar el like_count
                            var updateMovieLikesCmd = new MySqlCommand(
                                "UPDATE MovieLikes SET like_count = like_count + @action WHERE movie_id = @ItemId",
                                connection
                            );
                            Console.WriteLine("Elvalor de action es:" + request.ItemAction);
                            updateMovieLikesCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                            updateMovieLikesCmd.Parameters.AddWithValue("@action", request.ItemAction); 
                            updateMovieLikesCmd.ExecuteNonQuery();
                        }
                    }
                    

                    // Insertar o actualizar en UserMovieLikes
                    var insertLikeCmd = new MySqlCommand(
                        @"INSERT INTO UserMovieLikes (user_id, movie_id, movie_name, action)
                        VALUES (@UserId, @ItemId, @ItemName, @Action)
                        ON DUPLICATE KEY UPDATE action = @Action;",
                        connection
                    );
                    insertLikeCmd.Parameters.AddWithValue("@UserId", userId.Value);
                    insertLikeCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                    insertLikeCmd.Parameters.AddWithValue("@ItemName", request.ItemName);
                    if(request.ItemAction == 1)
                    { insertLikeCmd.Parameters.AddWithValue("@Action", 1);}
                    else { insertLikeCmd.Parameters.AddWithValue("@Action", 0);}

                    insertLikeCmd.ExecuteNonQuery();

                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("marvel")]
        public IActionResult LikeMarvel([FromBody] LikeRequest request)
        {
            Console.WriteLine("Empieza la API con el ID: " + request.ItemId);
            try
            {
                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    // Obtener user_id con el email
                    var getUserIdCmd = new MySqlCommand(
                        "SELECT id FROM usuario WHERE correo = @Email",
                        connection
                    );
                    getUserIdCmd.Parameters.AddWithValue("@Email", request.UserEmail);
                    var userId = getUserIdCmd.ExecuteScalar() as int?;

                    if (!userId.HasValue)
                    {
                        return BadRequest("User not found");
                    }

                    Console.WriteLine("Usuario obtenido: " + userId);

                    var checkLikeExistsCmd = new MySqlCommand(
                        @"SELECT COUNT(1) FROM UsercharacterLikes WHERE character_id = @ItemId
                        AND user_id = @UserId AND action = @Action",
                        connection
                    );
                    checkLikeExistsCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                    checkLikeExistsCmd.Parameters.AddWithValue("@UserId", userId.Value);
                    checkLikeExistsCmd.Parameters.AddWithValue("@Action", request.ItemAction);
                    var likeExist = Convert.ToInt32(checkLikeExistsCmd.ExecuteScalar()) > 0;

                    // Verificar si el personaje ya está registrado en characterLikes
                    var checkCharacterExistsCmd = new MySqlCommand(
                        "SELECT COUNT(1) FROM characterLikes WHERE character_id = @ItemId",
                        connection
                    );
                    checkCharacterExistsCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                    var characterExists = Convert.ToInt32(checkCharacterExistsCmd.ExecuteScalar()) > 0;
                    if(!likeExist)
                    {
                        if (!characterExists)
                        {
                            Console.WriteLine("El personaje no existe, se creará un nuevo registro.");
                            // Si el personaje no existe en characterLikes, insertarlo con like_count = 1 y character_name
                            var insertcharacterLikesCmd = new MySqlCommand(
                                "INSERT INTO characterLikes (character_id, like_count, character_name) VALUES (@ItemId, 1, @ItemName)",
                                connection
                            );
                            insertcharacterLikesCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                            insertcharacterLikesCmd.Parameters.AddWithValue("@ItemName", request.ItemName);
                            insertcharacterLikesCmd.ExecuteNonQuery();
                        }
                        else
                        {
                            Console.WriteLine("El personaje ya existe, se actualizará el like_count.");

                            // Si el personaje ya existe, simplemente actualizar el like_count
                            var updatecharacterLikesCmd = new MySqlCommand(
                                "UPDATE characterLikes SET like_count = like_count + @action WHERE character_id = @ItemId",
                                connection
                            );
                            updatecharacterLikesCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                            updatecharacterLikesCmd.Parameters.AddWithValue("@action", request.ItemAction);
                            updatecharacterLikesCmd.ExecuteNonQuery();
                            Console.WriteLine("se actualizo");
                        }
                    }
                    
                    Console.WriteLine("se hara insercion al usuario");
                    // Insertar o actualizar en UsercharacterLikes
                    var insertLikeCmd = new MySqlCommand(
                        @"INSERT INTO UsercharacterLikes (user_id, character_id, character_name, action)
                        VALUES (@UserId, @ItemId, @ItemName, @Action)
                        ON DUPLICATE KEY UPDATE action = @Action;",
                        connection
                    );
                    insertLikeCmd.Parameters.AddWithValue("@UserId", userId.Value);
                    insertLikeCmd.Parameters.AddWithValue("@ItemId", request.ItemId);
                    insertLikeCmd.Parameters.AddWithValue("@ItemName", request.ItemName);
                    insertLikeCmd.Parameters.AddWithValue("@Action", request.ItemAction == 1 ? 1 : 0);

                    insertLikeCmd.ExecuteNonQuery();
                    return Ok("Acción realizada correctamente.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
