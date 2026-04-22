import emailjs from "@emailjs/browser";

// CONFIGURACIÓN DE EMAILJS
// Reemplaza los valores de TEMPLATE_ID y PUBLIC_KEY con los de tu cuenta de EmailJS

const SERVICE_ID = "service_ywn3z3b"; // El Service ID que me pasaste
const TEMPLATE_ID = "TU_TEMPLATE_ID_AQUI"; // Ej: template_xyz567
const PUBLIC_KEY = "TU_PUBLIC_KEY_AQUI"; // Ej: aBcdEfG1234567

/**
 * Función para enviar un correo de bienvenida con credenciales temporales.
 * @param {string} userEmail - El correo del usuario.
 * @param {string} tempPassword  - La contraseña temporal generada.
 */
export const sendWelcomeEmail = async (userEmail, tempPassword) => {
  try {
    const templateParams = {
      user_email: userEmail,
      temp_password: tempPassword,
      login_link: window.location.origin + "/login",
      nombre_iglesia: "IMPCH Pulmahue",
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY,
    );

    console.log("Correo enviado con éxito!", response.status, response.text);
    return response;
  } catch (error) {
    console.error("Error al enviar el correo con EmailJS:", error);
    throw error;
  }
};
