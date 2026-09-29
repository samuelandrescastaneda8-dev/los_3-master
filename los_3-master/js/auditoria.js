document.addEventListener("DOMContentLoaded", function () {
    // 1. Validar permisos de administrador
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo || usuarioActivo.rol !== "administrador") {
        window.location.href = "index.html";
        return;
    }

    cargarBitacora();

    // 2. Botón para limpiar registros de auditoría
    const btnLimpiar = document.getElementById("btnLimpiarAuditoria");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", function () {
            if (confirm("¿Está seguro de vaciar el registro de la bitácora?")) {
                localStorage.removeItem("auditoriaUAM");
                cargarBitacora();
            }
        });
    }
});

function cargarBitacora() {
    const tabla = document.getElementById("tablaAuditoria");
    const registros = JSON.parse(localStorage.getItem("auditoriaUAM")) || [];

    if (registros.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" class="sin-datos">No hay eventos registrados en la bitácora.</td></tr>`;
        return;
    }

    tabla.innerHTML = "";
    // Mostrar los más recientes primero
    registros.reverse().forEach(reg => {
        const fila = document.createElement("tr");

        let claseTipo = "accion-registro";
        if (reg.tipo === "REPORTE") claseTipo = "accion-reporte";
        if (reg.tipo === "ADMIN") claseTipo = "accion-admin";
        if (reg.tipo === "MANTENIMIENTO") claseTipo = "accion-mantenimiento";

        fila.innerHTML = `
            <td>${reg.fecha}</td>
            <td><span class="etiqueta-accion ${claseTipo}">${reg.accion}</span></td>
            <td>${reg.usuario}</td>
            <td>${reg.detalle}</td>
        `;
        tabla.appendChild(fila);
    });
}

// Función global auxiliar para registrar eventos desde cualquier parte del sistema
function registrarAuditoria(tipo, accion, usuario, detalle) {
    const registros = JSON.parse(localStorage.getItem("auditoriaUAM")) || [];
    
    const ahora = new Date();
    const fechaFormateada = `${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`;

    registros.push({
        fecha: fechaFormateada,
        tipo: tipo, // REGISTRO, REPORTE, ADMIN, MANTENIMIENTO
        accion: accion,
        usuario: usuario,
        detalle: detalle
    });

    localStorage.setItem("auditoriaUAM", JSON.stringify(registros));
}