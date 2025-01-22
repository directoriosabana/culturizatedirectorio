const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config(); // Cargar variables de entorno

// Inicializar Firebase con la clave del servidor
const serviceAccount = require("./service-account.json"); // Asegúrate de que este archivo está en la raíz del proyecto

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json()); // Middleware para procesar JSON

// Ruta para enviar notificaciones push
app.post("/enviar-notificacion", async (req, res) => {
    const { token, titulo, mensaje, url } = req.body;

    if (!token || !titulo || !mensaje) {
        return res.status(400).json({ error: "Faltan parámetros: token, titulo, mensaje" });
    }

    const message = {
        notification: {
            title: titulo,
            body: mensaje,
            click_action: url || "https://directoriosabana.github.io/directorio" // Redirige al usuario al hacer clic
        },
        token: token // Token único del usuario
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("✅ Notificación enviada:", response);
        res.json({ success: true, messageId: response });
    } catch (error) {
        console.error("❌ Error enviando notificación:", error);
        res.status(500).json({ error: "No se pudo enviar la notificación" });
    }
});

require("dotenv").config();
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
