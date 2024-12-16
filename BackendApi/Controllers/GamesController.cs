using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGDBService _igdbService;

    public GamesController(IGDBService igdbService)
    {
        _igdbService = igdbService;
    }

    [HttpGet]
    public async Task<IActionResult> GetGames([FromQuery] string query)
    {
        var games = await _igdbService.FetchGamesAsync(query);
        return Ok(games);
    }
}
