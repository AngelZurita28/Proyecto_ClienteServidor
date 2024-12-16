using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class IGDBService
{
    private readonly HttpClient _httpClient;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private string _accessToken;

    public IGDBService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _clientId = configuration["IGDB:ClientId"];
        _clientSecret = configuration["IGDB:ClientSecret"];
    }

    // Método para obtener el token de acceso
    public async Task<string> FetchTwitchTokenAsync()
    {
        var requestBody = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("client_id", _clientId),
            new KeyValuePair<string, string>("client_secret", _clientSecret),
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        });

        var response = await _httpClient.PostAsync("https://id.twitch.tv/oauth2/token", requestBody);
        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();
        var token = JsonDocument.Parse(jsonResponse).RootElement.GetProperty("access_token").GetString();

        _accessToken = token;
        return token;
    }

    // Método para obtener juegos de IGDB
    public async Task<string> FetchGamesAsync(string query = "")
    {
        if (string.IsNullOrEmpty(_accessToken))
        {
            await FetchTwitchTokenAsync();
        }

        var gameQuery = string.IsNullOrEmpty(query)
            ? "fields name, cover.url, summary; sort popularity desc; limit 10;"
            : $"search \"{query}\"; fields name, cover.url, summary; limit 10;";

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.igdb.com/v4/games")
        {
            Content = new StringContent(gameQuery)
        };
        request.Headers.Add("Client-ID", _clientId);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();
        return jsonResponse;
    }
}
