using BackendApi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using BackendApi.Services; // Asegúrate de que el namespace del servicio sea el correcto
using BackendApi.Models;
using BackendApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Configura los servicios para la aplicación
builder.Services.AddControllers(); // Agrega soporte para controladores

// Agrega la configuración de la base de datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

// Registra el servicio de correo electrónico
builder.Services.AddSingleton<EmailService>();

// Configura CORS para permitir peticiones de otros orígenes (si es necesario)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddHttpClient<IGDBService>();
builder.Services.AddHttpClient<MovieService>();


// Configura la autenticación y otros servicios necesarios aquí (por ejemplo, JWT, Identity, etc.)
// builder.Services.AddAuthentication(...);

var app = builder.Build();

// Configura el pipeline de middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Configura CORS (si es necesario)
app.UseCors("AllowAllOrigins");


// Usa routing y endpoints de controladores
app.UseRouting();

// app.UseAuthorization();

app.MapControllers(); // Mapea los controladores a las rutas definidas

// Ejecuta la aplicación
app.Run("http://192.168.1.74::5070");
