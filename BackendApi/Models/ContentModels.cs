namespace BackendApi.Models
{
    public class Movie
    {
        public int MovieId { get; set; }
        public string? MovieName { get; set; }
        public int LikeCount { get; set; }
    }

    public class LikeRequest
    {
        public string? UserEmail { get; set; }
        public int ItemId { get; set; }
        public string? ItemName { get; set; } // Nueva propiedad para el nombre de la película
        public int ItemAction { get; set; }
    
    }

}
