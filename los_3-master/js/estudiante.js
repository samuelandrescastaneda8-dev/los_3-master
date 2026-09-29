document.addEventListener("DOMContentLoaded", function () {
    // 1. Validar inicio de sesión
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo || usuarioActivo.rol !== "estudiante") {
        // Si no está logueado o es admin, redirige al login
        window.location.href = "index.html";
        return;
    }

    // 2. Mostrar nombre de usuario logueado
    const nombreEstudianteElem = document.getElementById("nombreEstudiante");
    if (nombreEstudianteElem) {
        nombreEstudianteElem.textContent = `Hola, ${usuarioActivo.nombre}`;
    }

    // 3. Botón para cerrar sesión
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function () {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "index.html";
        });
    }

    // 4. Cargar Reportes del Estudiante desde localStorage
    cargarReportesEstudiante(usuarioActivo.correo);

    // 5. Cargar Historial General de Mantenimiento desde localStorage
    cargarHistorialMantenimiento();
});

function cargarReportesEstudiante(correoUsuario) {
    const tablaReportes = document.getElementById("tablaReportes");
    const todosLosReportes = JSON.parse(localStorage.getItem("reportesUAM")) || [];
    
    // Filtrar únicamente los reportes creados por el usuario actual
    const misReportes = todosLosReportes.filter(reporte => reporte.correo === correoUsuario);

    if (misReportes.length === 0) {
        tablaReportes.innerHTML = `<tr><td colspan="4" class="sin-datos">No has realizado reportes aún.</td></tr>`;
        return;
    }

    tablaReportes.innerHTML = "";
    misReportes.forEach(reporte => {
        const fila = document.createElement("tr");
        
        let claseEstado = "estado-pendiente";
        if (reporte.estado === "En proceso") claseEstado = "estado-proceso";
        if (reporte.estado === "Resuelto") claseEstado = "estado-resuelto";

        fila.innerHTML = `
            <td>${reporte.fecha || 'N/A'}</td>
            <td>${reporte.tipo}</td>
            <td>${reporte.ubicacion}</td>
            <td class="${claseEstado}">${reporte.estado || 'Pendiente'}</td>
        `;
        tablaReportes.appendChild(fila);
    });
}

function cargarHistorialMantenimiento() {
    const tablaMantenimiento = document.getElementById("tablaMantenimiento");
    const mantenimientos = JSON.parse(localStorage.getItem("mantenimientosUAM")) || [];

    if (mantenimientos.length === 0) {
        tablaMantenimiento.innerHTML = `<tr><td colspan="3" class="sin-datos">No hay registros de mantenimiento.</td></tr>`;
        return;
    }

    tablaMantenimiento.innerHTML = "";
    mantenimientos.forEach(mantenimiento => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${mantenimiento.edificio}</td>
            <td>${mantenimiento.detalle}</td>
            <td class="estado-resuelto">${mantenimiento.estado}</td>
        `;
        tablaMantenimiento.appendChild(fila);
    });
}