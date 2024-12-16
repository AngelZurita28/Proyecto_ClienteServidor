using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace BackendApi.Services
{
    public class MovieService
    {
        private readonly HttpClient _httpClient;
        private const string ApiKey = "b2797cf10c3438c91e2d495177d040e8";
        private const string BaseUrl = "https://api.themoviedb.org/3/";

        public MovieService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<JObject> FetchMoviesAsync(string? searchKey = null)
        {
            var type = string.IsNullOrEmpty(searchKey) ? "discover" : "search";
            var url = $"{BaseUrl}{type}/movie?api_key={ApiKey}&query={searchKey}";

            var response = await _httpClient.GetStringAsync(url);
            var data = JObject.Parse(response);

            // Devuelve el objeto completo en lugar de solo "results"
            return data;
        }

    }
}
