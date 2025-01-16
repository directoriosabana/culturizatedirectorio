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

// 2. Smooth scrolling for navigation links
const smoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Toggle the visibility of the navbar
function toggleNavbar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

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
// Obtener elementos del DOM
const searchButton = document.getElementById('searchButton');
const closeSearchModal = document.getElementById('closeSearchModal');
const searchModal = document.getElementById('searchModal');
const startSearchBtn = document.getElementById('startSearchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Lista de páginas donde buscar IDs (ajústala según la estructura de tu sitio)
const pagesToSearch = [
    'index.html',
    'business/categories.html',
    'categories/vestuario.html',
    'categories/vestuario/ac-boutique.html',
    'categories/vestuario/dulcey-sport.html',
    'categories/vestuario/templo-precios-bajos.html'
];

// Función para abrir el modal de búsqueda
searchButton.addEventListener('click', () => {
    searchModal.style.display = 'flex';
});

// Función para cerrar el modal de búsqueda
closeSearchModal.addEventListener('click', () => {
    searchModal.style.display = 'none';
});

// Cerrar el modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.style.display = 'none';
    }
});

// Normalizar IDs (eliminar espacios y convertir a minúsculas)
function normalizeId(id) {
    return id.toLowerCase().replace(/\s+/g, '');
}

// Buscar ID en múltiples páginas
async function searchIdInPages(query) {
    searchResults.innerHTML = "<p>Buscando...</p>";
    const normalizedQuery = normalizeId(query);
    let results = [];

    for (const page of pagesToSearch) {
        try {
            const response = await fetch(page);
            if (!response.ok) continue; // Si la página no carga, saltar

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Buscar todos los elementos con un ID en la página
            const allElements = doc.querySelectorAll('[id]');
            allElements.forEach(el => {
                if (normalizeId(el.id) === normalizedQuery) {
                    results.push(`<li><a href="${page}">${page}</a> - ID encontrado: <strong>${el.id}</strong></li>`);
                }
            });

        } catch (error) {
            console.error(`Error al cargar ${page}:`, error);
        }
    }

    // Mostrar los resultados en el modal
    searchResults.innerHTML = results.length > 0 
        ? `<ul>${results.join('')}</ul>` 
        : "<p>No se encontró el ID en ninguna página.</p>";
}

// Evento al hacer clic en "Iniciar Búsqueda"
startSearchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchIdInPages(query);
    } else {
        alert('Por favor, ingresa un término de búsqueda.');
    }
});


let deferredPrompt;

        // Capture the "beforeinstallprompt" event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the default mini-infobar
            e.preventDefault();
            deferredPrompt = e;

            // Show the modal
            const overlay = document.getElementById('overlay');
            const addToHomeModal = document.getElementById('addToHomeModal');
            overlay.style.display = 'block';
            addToHomeModal.style.display = 'block';
        });

        // Handle "Add" button click
        document.getElementById('installButton').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt(); // Show the prompt
                const { outcome } = await deferredPrompt.userChoice; // Wait for the user's response
                if (outcome === 'accepted') {
                    console.log('App installed');
                } else {
                    console.log('App installation dismissed');
                }
                deferredPrompt = null; // Reset the prompt
            }

            closeModal(); // Close the modal
        });

        // Handle "Close" button click
        document.getElementById('closeModal').addEventListener('click', closeModal);

        // Function to close the modal
        function closeModal() {
            const overlay = document.getElementById('overlay');
            const addToHomeModal = document.getElementById('addToHomeModal');
            overlay.style.display = 'none';
            addToHomeModal.style.display = 'none';
        }


// 3. Modal functionality for card buttons
const setupModals = () => {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const modalContent = `
                <div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="infoModalLabel">Información de la Empresa</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <div class="modal-body">
                                Más detalles sobre la empresa serán mostrados aquí.
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalContent);
            const modal = new bootstrap.Modal(document.getElementById('infoModal'));
            modal.show();

            modal._element.addEventListener('hidden.bs.modal', () => {
                modal._element.remove();
            });
        });
    });
};

// Initialize all functions
smoothScroll();
setupModals();
