using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Threading.Tasks;

[ApiController]
[Route("api/movies")]
public class MoviesController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private const string ApiKey = "b2797cf10c3438c91e2d495177d040e8";
    private const string BaseUrl = "https://api.themoviedb.org/3/";

    public MoviesController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchMovies([FromQuery] string? query = null)
    {
        var type = string.IsNullOrEmpty(query) ? "discover" : "search";
        var url = $"{BaseUrl}{type}/movie?api_key={ApiKey}&query={query}";

        try
        {
            // Realizar la solicitud HTTP directamente desde el controlador
            var response = await _httpClient.GetStringAsync(url);
            var data = JObject.Parse(response);

            // Retornar el objeto completo recibido de la API externa
            return Ok(data);
        }
        catch (HttpRequestException ex)
        {
            // Manejo de errores en caso de problemas con la solicitud HTTP
            return StatusCode(500, $"Error fetching movies: {ex.Message}");
        }
    }
}
