// 🔹 URLs de la API Gateway para anuncios y comentarios
const API_URL_ANUNCIOS = "https://aqr1b678mg.execute-api.eu-west-1.amazonaws.com/v1/anunciosia"; 
const API_URL_COMENTARIOS = "https://aqr1b678mg.execute-api.eu-west-1.amazonaws.com/v1/comentariosia"; 

// 🔹 Función para cargar los anuncios desde la API
async function cargarAnuncios() {
    console.log("Ejecutando cargarAnuncios()...");

    try {
        const response = await fetch(API_URL_ANUNCIOS, { method: "GET" });

        if (!response.ok) throw new Error("Error al obtener anuncios");

        const data = await response.json();
        const anuncios = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

        console.log("Anuncios recibidos:", anuncios);

        if (!Array.isArray(anuncios)) {
            console.error("La API no devolvió un array:", anuncios);
            return;
        }

        const lista = document.getElementById("anuncios-list");

        if (!lista) {
            console.error("Elemento 'anuncios-list' no encontrado en index.html");
            return;
        }

        lista.innerHTML = anuncios.map(a => 
            `<li><strong>${a.title}</strong>: ${a.description} (ID: ${a.anuncioId})</li>`
        ).join('');

    } catch (error) {
        console.error("Error al cargar anuncios:", error);
    }
}

// 🔹 Función para publicar un nuevo anuncio
async function publicarAnuncio(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;

    const anuncio = {
        anuncioId: Date.now().toString(),
        title: titulo,
        description: descripcion
    };

    try {
        const response = await fetch(API_URL_ANUNCIOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(anuncio)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || `Error desconocido: ${JSON.stringify(data)}`);

        alert("Anuncio publicado con éxito");
        cargarAnuncios();
    } catch (error) {
        console.error("Error al publicar anuncio:", error);
        alert(`Hubo un error al publicar el anuncio: ${error.message}`);
    }
}

// 🔹 Función para cargar los comentarios desde la API
async function cargarComentarios() {
    console.log("Ejecutando cargarComentarios()...");

    try {
        const response = await fetch(API_URL_COMENTARIOS, { method: "GET" });

        if (!response.ok) throw new Error("Error al obtener comentarios");

        const data = await response.json();
        const comentarios = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

        console.log("Comentarios recibidos:", comentarios);

        if (!Array.isArray(comentarios)) {
            console.error("La API no devolvió un array:", comentarios);
            return;
        }

        const listaComentarios = document.getElementById("comentarios-list");

        if (!listaComentarios) {
            console.error("Elemento 'comentarios-list' no encontrado en index.html");
            return;
        }

        listaComentarios.innerHTML = comentarios.map(c => 
            `<li><strong>${c.autor}:</strong> ${c.texto} (Anuncio ID: ${c.anuncioId})</li>`
        ).join('');

    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}

// 🔹 Función para publicar un nuevo comentario
async function publicarComentario(event) {
    event.preventDefault();

    const autor = document.getElementById("autor").value;
    const texto = document.getElementById("texto").value;
    const anuncioId = document.getElementById("anuncioId").value;

    const comentario = {
        comentarioId: Date.now().toString(),
        anuncioId: anuncioId,
        autor: autor,
        texto: texto
    };

    try {
        const response = await fetch(API_URL_COMENTARIOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comentario)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || `Error desconocido: ${JSON.stringify(data)}`);

        alert("Comentario publicado con éxito");
        cargarComentarios();
    } catch (error) {
        console.error("Error al publicar comentario:", error);
        alert(`Hubo un error al publicar el comentario: ${error.message}`);
    }
}

// 🔹 Asegurar que las funciones se ejecuten cuando la página se cargue
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada, ejecutando cargarAnuncios() y cargarComentarios()...");
    cargarAnuncios();
    cargarComentarios();

    // Vincular eventos de formularios
    const anuncioForm = document.getElementById("anuncio-form");
    if (anuncioForm) {
        anuncioForm.addEventListener("submit", publicarAnuncio);
    } else {
        console.error("No se encontró el formulario con ID 'anuncio-form'");
    }

    const comentarioForm = document.getElementById("comentario-form");
    if (comentarioForm) {
        comentarioForm.addEventListener("submit", publicarComentario);
    } else {
        console.error("No se encontró el formulario con ID 'comentario-form'");
    }
});
