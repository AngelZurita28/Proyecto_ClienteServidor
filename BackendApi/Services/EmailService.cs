using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;
namespace BackendApi.Services{

    public class EmailService
    {
        private readonly string _emailAddress = "af3392976@gmail.com";  // Tu correo electrónico
        private readonly string _emailPassword = "cart hedh diax mljo"; // Tu contraseña de aplicación

        public async Task SendOTP(string recipientEmail, string otp)
        {
            try
            {
                // Crea el mensaje del correo
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Soporte", _emailAddress));
                message.To.Add(new MailboxAddress("", recipientEmail));
                message.Subject = "Código de recuperación de contraseña";

                // Crea el cuerpo del correo (HTML)
                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <h1>Recuperación de Contraseña</h1>
                        <p>Tu código de verificación es: <strong>{otp}</strong></p>
                        <p>Este código expirará en 15 minutos.</p>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                // Configura el cliente SMTP
                using (var client = new SmtpClient())
                {
                    // Conecta al servidor SMTP de Gmail
                    await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_emailAddress, _emailPassword);

                    // Envía el mensaje
                    await client.SendAsync(message);

                    // Desconectar del servidor SMTP
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine("Correo enviado exitosamente.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo: {ex.Message}");
            }
        }
    }
}

