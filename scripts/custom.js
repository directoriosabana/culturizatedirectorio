// File: scripts.js

// 1. Fade-in effect on scroll
document.addEventListener("DOMContentLoaded", () => {
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    fadeInElements.forEach(element => observer.observe(element));
});

// Obtener elementos del DOM
const searchButton = document.getElementById('searchButton');
const closeSearchModal = document.getElementById('closeSearchModal');
const searchModal = document.getElementById('searchModal');
const startSearchBtn = document.getElementById('startSearchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Asegurar que el modal esté oculto al cargar la página
if (searchModal) {
    searchModal.style.display = 'none';
}

// Lista de páginas donde buscar IDs
const pagesToSearch = [
    '../business/categories/vestuario.html',
    '../business/categories/comida.html',
    '../business/categories/comida/guadalupe.html',
    '../business/categories/belleza.html',
    '../business/categories/bebidas.html',
    '../business/categories/gimnasio.html',
    '../business/categories/drogueria.html',
    '../business/categories/entretenimiento.html',
    '../business/categories/mascotas.html',
    '../business/categories/mecanica.html',
    '../business/categories/inmobiliaria.html',
    '../business/categories/hotel.html',
    '../business/categories/tecnologia.html',
    '../business/categories/transporte.html',
    '../business/categories/deportes.html',
    '../business/categories/ferreteria.html',
    '../business/categories/profesionales.html',
    '../business/categories/publicos.html',
    '../business/categories.html',
];

// Añadir la página actual al array de páginas a buscar
pagesToSearch.push(window.location.pathname); // Agrega la página actual al array

// Verificar si los elementos existen antes de añadir eventos
if (searchButton && searchModal) {
    searchButton.addEventListener('click', () => {
        searchModal.style.display = 'flex';
    });

    closeSearchModal.addEventListener('click', () => {
        searchModal.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
        }
    });
}

// Normalizar IDs (eliminar espacios y convertir a minúsculas)
function normalizeId(id) {
    return id ? id.toLowerCase().replace(/\s+/g, '') : '';
}

// Buscar ID en múltiples páginas con coincidencias parciales y mejor presentación
async function searchIdInPages(query) {
    if (!searchResults) return;
    
    searchResults.innerHTML = "<p>🔍 Buscando...</p>";
    const normalizedQuery = normalizeId(query);
    let results = [];

    console.log("🔎 Iniciando búsqueda de:", normalizedQuery);

    for (const page of pagesToSearch) {
        try {
            console.log(`📄 Buscando en: ${page}...`);
            const response = await fetch(page);
            if (!response.ok) {
                console.warn(`⚠️ No se pudo cargar ${page}`);
                continue; // Si la página no carga, saltar
            }

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Buscar todos los elementos con ID
            const allElements = doc.querySelectorAll('[id]');
            console.log(`🔍 Encontrados ${allElements.length} elementos`);

            allElements.forEach(el => {
                if (normalizeId(el.id).includes(normalizedQuery)) { // 🔥 Ahora busca coincidencias parciales
                    console.log(`✅ Coincidencia encontrada`);

                    // Obtener el nombre del archivo actual (sin extensión .html)
                    const fileName = page.split('/').pop().replace('.html', '');

                    results.push(`
                        <div class="result-item">
                            <a href="${page}#${el.id}" class="result-link" onclick="closeSearchModalFunction()">
                                <strong>${el.id.toUpperCase()}</strong> en ${fileName.toUpperCase()}
                            </a>
                        </div>
                    `);
                }
            });

        } catch (error) {
            console.error(`❌ Error al cargar ${page}:`, error);
        }
    }

    // Mostrar los resultados en el modal con mejor diseño
    searchResults.innerHTML = results.length > 0 
        ? results.join('') 
        : "<p>❌ No se encontró ningún resultado.</p>";
}

// Función para cerrar el modal al hacer clic en un resultado
function closeSearchModalFunction() {
    if (searchModal) {
        searchModal.style.display = 'none';
    }
}

// Evento al hacer clic en "Iniciar Búsqueda"
if (startSearchBtn && searchInput) {
    startSearchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchIdInPages(query);
        } else {
            alert('Por favor, ingresa un término de búsqueda.');
        }
    });
}



// 1Carousel
document.addEventListener("DOMContentLoaded", function () {
    const carouselItems = document.querySelectorAll(".carousel-item");
    let currentIndex = 0; // Índice de la tarjeta central
    const totalItems = carouselItems.length;
    const animationDelay = 3000; // Tiempo entre movimientos automáticos (en milisegundos)
    let autoSlideInterval;

    // Función para actualizar posiciones del carrusel
    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            const offset = (index - currentIndex + totalItems) % totalItems; // Desplazamiento circular
            item.style.transition = "transform 0.8s ease, z-index 0.8s ease"; // Animación
            item.classList.remove("active"); // Quitar clase activa de todas las tarjetas

            if (offset === 0) {
                // Tarjeta central
                item.style.transform = "translate(-50%, -50%) scale(1)";
                item.style.zIndex = "3";
                item.classList.add("active"); // Agregar clase activa a la tarjeta central
            } else if (offset === 1 || offset === totalItems - 1) {
                // Laterales visibles
                const direction = offset === 1 ? 50 : -150;
                item.style.transform = `translate(${direction}%, -50%) scale(0.8)`;
                item.style.zIndex = "2";
            } else if (offset === 2 || offset === totalItems - 2) {
                // Laterales ocultas
                const direction = offset === 2 ? 150 : -250;
                item.style.transform = `translate(${direction}%, -50%) scale(0.8)`;
                item.style.zIndex = "1";
            } else {
                // Ocultar tarjetas fuera del rango
                item.style.transform = "translate(0, -50%) scale(0)";
                item.style.zIndex = "0";
            }
        });
    }

    // Navegar hacia la izquierda
    function moveLeft() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
        resetAutoSlide(); // Reinicia el temporizador automático
    }

    // Navegar hacia la derecha
    function moveRight() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
        resetAutoSlide(); // Reinicia el temporizador automático
    }

    // Configurar botones
    document.getElementById("carousel-prev").addEventListener("click", moveLeft);
    document.getElementById("carousel-next").addEventListener("click", moveRight);

    // Movimiento automático del carrusel
    function startAutoSlide() {
        autoSlideInterval = setInterval(moveRight, animationDelay);
    }

    // Reiniciar el movimiento automático después de interacción manual
    function resetAutoSlide() {
        clearInterval(autoSlideInterval); // Detener temporizador existente
        startAutoSlide(); // Iniciar nuevo temporizador
    }

    // Inicializar carrusel y movimiento automático
    updateCarousel();
    startAutoSlide();
});

// Toggle the visibility of the navbar
function toggleNavbar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Toggle the visibility of the navbar and overlay
function toggleNavbar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    sidebar.classList.toggle('active'); // Activa/desactiva el navbar
    overlay.classList.toggle('active'); // Activa/desactiva el fondo
}

// Close the navbar when clicking on the overlay
function closeNavbar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    sidebar.classList.remove('active'); // Oculta el navbar
    overlay.classList.remove('active'); // Oculta el fondo
}

let deferredPrompt;

// Selecciona el botón que activará la instalación manualmente
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.style.display = 'block'; // Muestra el botón si es posible instalar
});

// Evento al hacer clic en el botón de instalación
installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            console.log('Usuario instaló la PWA');
        } else {
            console.log('Usuario canceló la instalación');
        }

        deferredPrompt = null; // Reinicia la variable
    }
});





function setupModals() {
    console.log("Modales listos");
}
// Initialize all functions
smoothScroll();
setupModals();
