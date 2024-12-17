using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Data;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly string connectionString = "Server=localhost;Database=practica;User=root;Password=181117;";

        // POST api/likes/movie
       [HttpPost("movie")]
public IActionResult LikeMovie([FromBody] LikeRequest request)
{
    try
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            connection.Open();

            // Obtener user_id con el email
            var getUserIdCmd = new MySqlCommand("SELECT id FROM usuario WHERE correo = @Email", connection);
            getUserIdCmd.Parameters.AddWithValue("@Email", request.UserEmail);
            var userId = getUserIdCmd.ExecuteScalar() as int?;

            if (!userId.HasValue)
            {
                return BadRequest("User not found");
            }

            // Verificar si la película ya está registrada en MovieLikes
            var checkMovieExistsCmd = new MySqlCommand(
                "SELECT COUNT(1) FROM MovieLikes WHERE movie_id = @MovieId", connection);
            checkMovieExistsCmd.Parameters.AddWithValue("@MovieId", request.MovieId);
            var movieExists = Convert.ToInt32(checkMovieExistsCmd.ExecuteScalar()) > 0;

            if (!movieExists)
            {
                // Si la película no existe en MovieLikes, insertarla con like_count = 1 y movie_name
                var insertMovieLikesCmd = new MySqlCommand(
                    "INSERT INTO MovieLikes (movie_id, like_count, movie_name) VALUES (@MovieId, 1, @MovieName)", connection);
                insertMovieLikesCmd.Parameters.AddWithValue("@MovieId", request.MovieId);
                insertMovieLikesCmd.Parameters.AddWithValue("@MovieName", request.MovieName);
                insertMovieLikesCmd.ExecuteNonQuery();
            }
            else
            {
                // Si la película ya existe, simplemente incrementar el like_count
                var updateMovieLikesCmd = new MySqlCommand(
                    "UPDATE MovieLikes SET like_count = like_count + 1 WHERE movie_id = @MovieId", connection);
                updateMovieLikesCmd.Parameters.AddWithValue("@MovieId", request.MovieId);
                updateMovieLikesCmd.ExecuteNonQuery();
            }

            // Insertar o actualizar en UserMovieLikes
            var insertLikeCmd = new MySqlCommand(
                @"INSERT INTO UserMovieLikes (user_id, movie_id)
                  SELECT @UserId, @MovieId
                  WHERE NOT EXISTS (SELECT 1 FROM UserMovieLikes WHERE user_id = @UserId AND movie_id = @MovieId);", connection);
            insertLikeCmd.Parameters.AddWithValue("@UserId", userId.Value);
            insertLikeCmd.Parameters.AddWithValue("@MovieId", request.MovieId);
            insertLikeCmd.ExecuteNonQuery();

            return Ok();
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}
    }

    public class LikeRequest
{
    public string UserEmail { get; set; }
    public int MovieId { get; set; }
    public string MovieName { get; set; }  // Nueva propiedad para el nombre de la película
}

}
