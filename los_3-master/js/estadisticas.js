document.addEventListener("DOMContentLoaded", function () {
    // 1. Validar que haya un usuario logueado
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
        window.location.href = "index.html";
        return;
    }

    // Mostrar nombre del usuario
    const nombreUsuarioElem = document.getElementById("nombreUsuario");
    if (nombreUsuarioElem) {
        nombreUsuarioElem.textContent = `Hola, ${usuarioActivo.nombre}`;
    }

    // 2. Cargar datos desde localStorage
    const reportes = JSON.parse(localStorage.getItem("reportesUAM")) || [];

    // 3. Calcular métricas generales
    const total = reportes.length;
    const pendientes = reportes.filter(r => r.estado === "Pendiente").length;
    const proceso = reportes.filter(r => r.estado === "En proceso").length;
    const resueltos = reportes.filter(r => r.estado === "Resuelto").length;

    // Actualizar números en pantalla
    document.getElementById("statTotal").textContent = total;
    document.getElementById("statPendientes").textContent = pendientes;
    document.getElementById("statProceso").textContent = proceso;
    document.getElementById("statResueltos").textContent = resueltos;

    // Calcular Porcentaje de Efectividad
    const porcentaje = total > 0 ? Math.round((resueltos / total) * 100) : 0;
    document.getElementById("porcentajeEfectividad").textContent = `${porcentaje}%`;

    // 4. Generar barras por categoría
    cargarCategorias(reportes);
});

function cargarCategorias(reportes) {
    const contenedor = document.getElementById("listaCategorias");
    if (reportes.length === 0) {
        contenedor.innerHTML = `<p class="sin-datos">No hay datos suficientes para mostrar estadísticas.</p>`;
        return;
    }

    // Contar reportes por categoría
    const conteoCategorias = {};
    reportes.forEach(r => {
        const cat = r.tipo || "Otro";
        conteoCategorias[cat] = (conteoCategorias[cat] || 0) + 1;
    });

    contenedor.innerHTML = "";
    const totalReportes = reportes.length;

    for (const [categoria, cantidad] of Object.entries(conteoCategorias)) {
        const porcentaje = Math.round((cantidad / totalReportes) * 100);

        const item = document.createElement("div");
        item.className = "barra-item";
        item.innerHTML = `
            <div class="barra-info">
                <span>${categoria}</span>
                <span>${cantidad} (${porcentaje}%)</span>
            </div>
            <div class="barra-fondo">
                <div class="barra-progreso" style="width: ${porcentaje}%"></div>
            </div>
        `;
        contenedor.appendChild(item);
    }
}