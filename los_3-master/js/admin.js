document.addEventListener("DOMContentLoaded", function () {
    // 1. Validar si el usuario activo es Administrador
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo || usuarioActivo.rol !== "administrador") {
        window.location.href = "index.html";
        return;
    }

    // 2. Botón de cerrar sesión
    const btnCerrarSesion = document.getElementById("btnCerrarSesionAdmin");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", function () {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "index.html";
        });
    }

    // 3. Cargar datos iniciales
    cargarGestionReportes();

    // 4. Formulario de agregar mantenimiento
    const formMantenimiento = document.getElementById("formMantenimiento");
    formMantenimiento.addEventListener("submit", function (e) {
        e.preventDefault();

        const edificio = document.getElementById("mantoEdificio").value.trim();
        const detalle = document.getElementById("mantoDetalle").value.trim();

        if (!edificio || !detalle) return;

        const nuevoMantenimiento = {
            id: Date.now(),
            edificio: edificio,
            detalle: detalle,
            estado: "Completado"
        };

        const mantenimientos = JSON.parse(localStorage.getItem("mantenimientosUAM")) || [];
        mantenimientos.push(nuevoMantenimiento);
        localStorage.setItem("mantenimientosUAM", JSON.stringify(mantenimientos));

        formMantenimiento.reset();
        alert("Trabajo de mantenimiento registrado con éxito.");
    });
});

function cargarGestionReportes() {
    const tabla = document.getElementById("tablaAdminReportes");
    const reportes = JSON.parse(localStorage.getItem("reportesUAM")) || [];

    // Actualizar Contadores KPI
    actualizarKPIs(reportes);

    if (reportes.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="sin-datos">No hay reportes ni solicitudes registradas.</td></tr>`;
        return;
    }

    tabla.innerHTML = "";
    reportes.forEach((reporte, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${reporte.estudiante || 'Anónimo'}</td>
            <td>${reporte.tipo}</td>
            <td>${reporte.ubicacion}</td>
            <td>${reporte.descripcion}</td>
            <td>${reporte.fecha || 'N/A'}</td>
            <td>
                <select class="select-estado" onchange="cambiarEstado(${reporte.id}, this.value)">
                    <option value="Pendiente" ${reporte.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="En proceso" ${reporte.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
                    <option value="Resuelto" ${reporte.estado === 'Resuelto' ? 'selected' : ''}>Resuelto</option>
                </select>
            </td>
            <td>
                <button onclick="eliminarReporte(${reporte.id})" class="boton-salir" style="padding: 4px 8px; font-size: 12px;">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function cambiarEstado(id, nuevoEstado) {
    let reportes = JSON.parse(localStorage.getItem("reportesUAM")) || [];
    reportes = reportes.map(rep => {
        if (rep.id === id) {
            rep.estado = nuevoEstado;
        }
        return rep;
    });

    localStorage.setItem("reportesUAM", JSON.stringify(reportes));
    cargarGestionReportes();
}

function eliminarReporte(id) {
    if (!confirm("¿Está seguro de eliminar este reporte?")) return;

    let reportes = JSON.parse(localStorage.getItem("reportesUAM")) || [];
    reportes = reportes.filter(rep => rep.id !== id);

    localStorage.setItem("reportesUAM", JSON.stringify(reportes));
    cargarGestionReportes();
}

function actualizarKPIs(reportes) {
    document.getElementById("totalReportes").textContent = reportes.length;
    document.getElementById("totalPendientes").textContent = reportes.filter(r => r.estado === "Pendiente").length;
    document.getElementById("totalProceso").textContent = reportes.filter(r => r.estado === "En proceso").length;
    document.getElementById("totalResueltos").textContent = reportes.filter(r => r.estado === "Resuelto").length;
}