document.addEventListener("DOMContentLoaded", function () {
    // 1. Verificar sesión
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo || usuarioActivo.rol !== "estudiante") {
        window.location.href = "index.html";
        return;
    }

    // Mostrar nombre del usuario
    const nombreEstudianteElem = document.getElementById("nombreEstudiante");
    if (nombreEstudianteElem) {
        nombreEstudianteElem.textContent = `Hola, ${usuarioActivo.nombre}`;
    }

    // 2. Manejo de envío del formulario
    const formReporte = document.getElementById("formReporte");
    formReporte.addEventListener("submit", function (e) {
        e.preventDefault();

        const categoria = document.getElementById("tipoDano").value;
        const edificio = document.getElementById("edificio").value;
        const ubicacionEspecifica = document.getElementById("ubicacionEspecifica").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const mensaje = document.getElementById("mensajeReporte");

        if (!categoria || !edificio || !ubicacionEspecifica || !descripcion) {
            mensaje.textContent = "Por favor complete todos los campos requeridos.";
            mensaje.style.color = "#b34848";
            return;
        }

        // Obtener la fecha actual
        const hoy = new Date();
        const fechaFormateada = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;

        // Crear el nuevo objeto de reporte (sin tipoRegistro)
        const nuevoReporte = {
            id: Date.now(),
            correo: usuarioActivo.correo,
            estudiante: usuarioActivo.nombre,
            tipo: categoria,
            ubicacion: `${edificio} - ${ubicacionEspecifica}`,
            descripcion: descripcion,
            fecha: fechaFormateada,
            estado: "Pendiente"
        };

        // Guardar en localStorage
        const reportesExistentes = JSON.parse(localStorage.getItem("reportesUAM")) || [];
        reportesExistentes.push(nuevoReporte);
        localStorage.setItem("reportesUAM", JSON.stringify(reportesExistentes));

        mensaje.textContent = "¡Reporte enviado exitosamente!";
        mensaje.style.color = "#4d7c55";
        formReporte.reset();

        // Redirigir de regreso al panel tras 1.5 segundos
        setTimeout(() => {
            window.location.href = "estudiante.html";
        }, 1500);
    });
});