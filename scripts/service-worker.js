importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 🔥 Configuración de Firebase (Reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyDIK_peZhnzuqxNApeoavvjZg0RxLd-xcI",
  authDomain: "directorio-culturizatesdt.firebaseapp.com",
  projectId: "directorio-culturizatesdt",
  storageBucket: "directorio-culturizatesdt.firebasestorage.app",
  messagingSenderId: "269074889422",
  appId: "1:269074889422:web:0f823667e930d719562e9f",
  measurementId: "G-0KL5HQ40K2"
};

const messaging = firebase.messaging();

// 📌 Evento de instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('✅ Service Worker instalado.');
    self.skipWaiting(); // Activa el SW inmediatamente sin esperar al próximo reload
});

// 📌 Evento de activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activado.');
    return self.clients.claim(); // Toma control de todas las pestañas inmediatamente
});

// 📌 Evento para interceptar peticiones (puedes usar esto para cache)
self.addEventListener('fetch', (event) => {
    console.log('🌐 Interceptando petición a:', event.request.url);
});

// 📌 Evento para recibir notificaciones push
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        console.log('📩 Notificación recibida:', data);

        const options = {
            body: data.body || 'Tienes una nueva notificación.',
            icon: 'favicon.png',
            badge: 'favicon.png',
            data: { url: data.click_action || '/' }
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'Nueva Notificación', options)
        );
    }
});

// 📌 Evento para manejar clics en la notificación
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                // Si hay pestañas abiertas, lleva a la primera
                return clientList[0].focus();
            }
            // Si no hay pestañas abiertas, abre una nueva
            return clients.openWindow(event.notification.data.url);
        })
    );
});
