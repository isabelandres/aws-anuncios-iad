// 🔹 Reemplaza con la URL de tu API Gateway
const API_URL = "https://tu-api-gateway.execute-api.us-east-1.amazonaws.com/prod"; 

// Función para cargar los anuncios desde la API
async function cargarAnuncios() {
    try {
        const response = await fetch(`${API_URL}/anuncios`);
        if (!response.ok) throw new Error("Error al obtener anuncios");
        
        const anuncios = await response.json();
        const lista = document.getElementById("anuncios-list");
        lista.innerHTML = anuncios.map(a => 
            `<li><strong>${a.title}</strong>: ${a.description}</li>`
        ).join('');
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para publicar un nuevo anuncio
async function publicarAnuncio(event) {
    event.preventDefault(); // Evita recargar la página

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;

    const anuncio = {
        anuncioId: Date.now().toString(), // ID único basado en la fecha
        title: titulo,
        description: descripcion
    };

    try {
        const response = await fetch(`${API_URL}/anuncios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(anuncio)
        });

        if (!response.ok) throw new Error("Error al crear el anuncio");

        alert("Anuncio publicado con éxito");
        cargarAnuncios(); // Recargar la lista
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al publicar el anuncio");
    }
}

// Vincular eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarAnuncios();
    document.getElementById("anuncio-form").addEventListener("submit", publicarAnuncio);
});
