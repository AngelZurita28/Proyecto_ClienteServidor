using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient; // Asegúrate de usar MySql.Data
using BackendApi.Models; // Importa desde la carpeta Models
using BackendApi.Services;
using System.Net.NetworkInformation; // Para obtener la IP local

namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly string connectionString = "Server=localhost;Database=practica;User=root;Password=181117;"; // Tu cadena de conexión MySQL

        // Método para obtener la IP local
        private string GetLocalIP()
        {
            string ipAddress = string.Empty;
            foreach (var networkInterface in NetworkInterface.GetAllNetworkInterfaces())
            {
                var ipProperties = networkInterface.GetIPProperties();
                foreach (var ipAddressInfo in ipProperties.UnicastAddresses)
                {
                    if (ipAddressInfo.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork && !System.Net.IPAddress.IsLoopback(ipAddressInfo.Address))
                    {
                        ipAddress = ipAddressInfo.Address.ToString();
                        return ipAddress;
                    }
                }
            }
            return ipAddress;
        }

        // Ruta para login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            Console.WriteLine("Entrando al API");
            Console.WriteLine($"Email recibido: {loginRequest.Email}, Password recibido: {loginRequest.Password}");

            try
            {
                // Intentando establecer conexión a la base de datos
                using (var connection = new MySqlConnection(connectionString)) 
                {
                    Console.WriteLine("Intentando conectar a la base de datos...");
                    await connection.OpenAsync();
                    Console.WriteLine("Conexión a la base de datos establecida correctamente.");

                    // Realizamos una consulta simple para obtener las tablas en la base de datos
                    var showTablesQuery = "SHOW TABLES";
                    using (var showTablesCommand = new MySqlCommand(showTablesQuery, connection))
                    {
                        Console.WriteLine("Consultando las tablas en la base de datos...");
                        var reader = await showTablesCommand.ExecuteReaderAsync();
                        while (reader.Read())
                        {
                            Console.WriteLine($"Tabla encontrada: {reader[0]}");
                        }
                        reader.Close(); // Cerrar el lector después de procesar los resultados
                    }

                    var query = "SELECT * FROM usuario WHERE correo = @correo AND clave = SHA2(@clave, 256)";
                    using (var command = new MySqlCommand(query, connection)) 
                    {
                        command.Parameters.AddWithValue("@correo", loginRequest.Email);
                        command.Parameters.AddWithValue("@clave", loginRequest.Password);

                        Console.WriteLine("Ejecutando la consulta en la base de datos...");
                        var reader = await command.ExecuteReaderAsync();

                        if (!reader.HasRows)
                        {
                            Console.WriteLine("No se encontraron resultados en la base de datos.");
                            return NotFound(new { message = "Usuario no encontrado" });
                        }

                        // Si hay resultados, los leemos
                        reader.Read();
                        Console.WriteLine("Resultados de la consulta:");
                        Console.WriteLine($"Correo: {reader["correo"]}, Status: {reader["status"]}");

                        var status = reader["status"].ToString();
                        if (status == "0")
                        {
                            Console.WriteLine("Usuario desactivado.");
                            return Unauthorized(new { message = "Usuario desactivado" });
                        }

                        Console.WriteLine("Inicio de sesión exitoso.");
                        return Ok(new { message = "Inicio de sesión exitoso", email = loginRequest.Email });
                    }
                }
            }
            catch (Exception ex)
            {
                // En caso de error, imprimimos el mensaje de error
                Console.WriteLine($"Error al conectar a la base de datos: {ex.Message}");
                return StatusCode(500, new { message = "Error del servidor" });
            }
        }


        // Ruta para obtener la IP local
        [HttpGet("get-ip")]
        public IActionResult GetIp()
        {
            string localIp = GetLocalIP();
            return Ok(new { ip = localIp });
        }

        // Método para reactivar un usuario
        private async Task ReactivateUser(string email, string password)
        {
            try
            {
                using (var connection = new MySqlConnection(connectionString)) // Usamos MySqlConnection
                {
                    await connection.OpenAsync();
                    var updateQuery = "UPDATE usuario SET status = 1, clave = SHA2(@clave, 256) WHERE correo = @correo";
                    using (var command = new MySqlCommand(updateQuery, connection)) // Usamos MySqlCommand
                    {
                        command.Parameters.AddWithValue("@correo", email);
                        command.Parameters.AddWithValue("@clave", password); // Enviamos la contraseña directamente para que sea procesada en la consulta SQL

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                // Maneja el error si ocurre
                throw new Exception("Error al reactivar al usuario", ex);
            }
        }

        // Ruta para registro
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            Console.WriteLine("Entrando al proceso de registro");
            Console.WriteLine($"Email recibido: {registerRequest.Email}, Password recibido: {registerRequest.Password}");

            try
            {
                using (var connection = new MySqlConnection(connectionString))
                {
                    Console.WriteLine("Intentando conectar a la base de datos...");
                    await connection.OpenAsync();
                    Console.WriteLine("Conexión a la base de datos establecida correctamente.");

                    // Verificamos si el usuario ya existe
                    var query = "SELECT * FROM usuario WHERE correo = @correo";
                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@correo", registerRequest.Email);
                        Console.WriteLine("Ejecutando consulta para verificar si el usuario ya existe...");
                        var reader = await command.ExecuteReaderAsync();

                        if (reader.HasRows)
                        {
                            Console.WriteLine("Usuario encontrado en la base de datos.");
                            reader.Read();
                            var status = reader["status"].ToString();
                            Console.WriteLine($"Status del usuario: {status}");  // Imprimimos el valor de status

                            if (status == "False")
                            {
                                // Reactivamos el usuario si está desactivado
                                Console.WriteLine("Usuario desactivado, reactivando...");
                                reader.Close(); // Cerramos el lector antes de la actualización
                                var updateQuery = "UPDATE usuario SET status = True, clave = SHA2(@clave, 256) WHERE correo = @correo";
                                using (var updateCommand = new MySqlCommand(updateQuery, connection))
                                {
                                    updateCommand.Parameters.AddWithValue("@correo", registerRequest.Email);
                                    updateCommand.Parameters.AddWithValue("@clave", registerRequest.Password);
                                    await updateCommand.ExecuteNonQueryAsync();
                                    Console.WriteLine("Usuario reactivado exitosamente.");
                                }
                                return Ok(new { message = "Usuario reactivado exitosamente", email = registerRequest.Email });
                            }
                            else
                            {
                                Console.WriteLine("El usuario ya está activo.");
                                return BadRequest(new { message = "El usuario ya existe" });
                            }
                        }
                        else
                        {
                            Console.WriteLine("No se encontró el usuario, procediendo a crear uno nuevo.");
                        }
                        reader.Close(); // Cerramos el lector después de la consulta

                        // Si el usuario no existe, lo creamos
                        var insertQuery = "INSERT INTO usuario (correo, clave, status) VALUES (@correo, SHA2(@clave, 256), True)";
                        using (var insertCommand = new MySqlCommand(insertQuery, connection))
                        {
                            insertCommand.Parameters.AddWithValue("@correo", registerRequest.Email);
                            insertCommand.Parameters.AddWithValue("@clave", registerRequest.Password);
                            await insertCommand.ExecuteNonQueryAsync();
                            Console.WriteLine("Usuario creado exitosamente.");
                        }

                        return Ok(new { message = "Usuario registrado exitosamente", email = registerRequest.Email });
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al conectar a la base de datos: {ex.Message}");
                return StatusCode(500, new { message = "Error del servidor" });
            }
        }



        // Ruta para eliminar cuenta
        [HttpPost("delete-account")]
        public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest request)
        {
            try
            {
                using (var connection = new MySqlConnection(connectionString)) // Usamos MySqlConnection
                {
                    await connection.OpenAsync();
                    var query = "UPDATE usuario SET status = 0 WHERE correo = @correo";
                    using (var command = new MySqlCommand(query, connection)) // Usamos MySqlCommand
                    {
                        command.Parameters.AddWithValue("@correo", request.Email);
                        await command.ExecuteNonQueryAsync();
                    }
                    return Ok(new { message = "Cuenta desactivada exitosamente" });
                }
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Error del servidor" });
            }
        }

        private readonly EmailService emailService;
        private static Dictionary<string, (string code, DateTime expiry)> otpStore = new Dictionary<string, (string, DateTime)>();

        public AuthController(EmailService emailService)
        {
            this.emailService = emailService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            Console.WriteLine("Entrando a la ruta 'forgot-password'");
            try
            {
                var email = request.Email;
                Console.WriteLine($"Email recibido: {email}");

                using (var connection = new MySqlConnection(connectionString))
                {
                    Console.WriteLine("Intentando conectar a la base de datos...");
                    await connection.OpenAsync();
                    Console.WriteLine("Conexión a la base de datos establecida correctamente.");

                    // Verificar si el usuario existe
                    var query = "SELECT * FROM usuario WHERE correo = @correo";
                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@correo", email);
                        Console.WriteLine("Ejecutando consulta para verificar si el usuario existe...");
                        var reader = await command.ExecuteReaderAsync();

                        if (!reader.HasRows)
                        {
                            Console.WriteLine("Usuario no encontrado.");
                            return NotFound(new { message = "Usuario no encontrado" });
                        }
                        Console.WriteLine("Usuario encontrado.");
                        reader.Close();
                    }

                    // Generar OTP
                    var otp = new Random().Next(100000, 999999).ToString();
                    Console.WriteLine($"OTP generado: {otp}");

                    // Almacenar OTP con fecha de expiración
                    otpStore[email] = (otp, DateTime.Now.AddMinutes(15));
                    Console.WriteLine($"OTP almacenado para el email {email} con expiración en {otpStore[email].expiry}");

                    // Enviar el OTP por correo electrónico
                    Console.WriteLine("Enviando OTP por correo...");
                    await emailService.SendOTP(email, otp);
                    Console.WriteLine("Correo enviado exitosamente.");

                    return Ok(new { message = "Código de verificación enviado al correo" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al procesar la solicitud: {ex.Message}");
                return StatusCode(500, new { message = "Error al enviar el código de verificación", error = ex.Message });
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            Console.WriteLine("Entrando a la ruta 'verify-otp'");
            try
            {
                var email = request.Email;
                var otp = request.Otp;

                Console.WriteLine($"Email recibido: {email}, OTP recibido: {otp}");

                if (!otpStore.ContainsKey(email))
                {
                    Console.WriteLine("OTP no encontrado o expirado.");
                    return BadRequest(new { message = "Código expirado o inválido" });
                }

                var storedOtp = otpStore[email];
                Console.WriteLine($"OTP almacenado: {storedOtp.code}, Expiración: {storedOtp.expiry}");

                if (DateTime.Now > storedOtp.expiry)
                {
                    Console.WriteLine("OTP expirado.");
                    otpStore.Remove(email);
                    return BadRequest(new { message = "Código expirado" });
                }

                if (storedOtp.code != otp)
                {
                    Console.WriteLine("OTP incorrecto.");
                    return BadRequest(new { message = "Código incorrecto" });
                }

                Console.WriteLine("OTP verificado correctamente.");
                otpStore.Remove(email); // Limpiar OTP después de la verificación exitosa
                return Ok(new { message = "Código verificado correctamente" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al verificar el código: {ex.Message}");
                return StatusCode(500, new { message = "Error al verificar el código", error = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            Console.WriteLine("Entrando a la ruta 'reset-password'");
            try
            {
                var email = request.Email;
                var password = request.Password;
                Console.WriteLine($"Email recibido: {email}, Nueva contraseña recibida.");

                using (var connection = new MySqlConnection(connectionString))
                {
                    Console.WriteLine("Intentando conectar a la base de datos...");
                    await connection.OpenAsync();
                    Console.WriteLine("Conexión a la base de datos establecida correctamente.");

                    // Actualizar la contraseña en la base de datos
                    var query = "UPDATE usuario SET clave = SHA2(@clave, 256) WHERE correo = @correo";
                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@clave", password);
                        command.Parameters.AddWithValue("@correo", email);
                        Console.WriteLine("Ejecutando consulta para actualizar la contraseña...");
                        await command.ExecuteNonQueryAsync();
                        Console.WriteLine("Contraseña actualizada correctamente en la base de datos.");
                    }
                }

                return Ok(new { message = "Contraseña actualizada correctamente" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar la contraseña: {ex.Message}");
                return StatusCode(500, new { message = "Error al actualizar la contraseña", error = ex.Message });
            }
        }


    }
}
