document.addEventListener("DOMContentLoaded", function () {
    // 1. Validar que sea Administrador
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo || usuarioActivo.rol !== "administrador") {
        window.location.href = "index.html";
        return;
    }

    // 2. Cargar técnicos guardados
    cargarTecnicos();

    // 3. Registrar nuevo técnico
    const formTecnico = document.getElementById("formTecnico");
    formTecnico.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombreTecnico").value.trim();
        const especialidad = document.getElementById("especialidadTecnico").value;

        if (!nombre || !especialidad) return;

        const nuevoTecnico = {
            id: Date.now(),
            nombre: nombre,
            especialidad: especialidad,
            estado: "Disponible"
        };

        const tecnicos = JSON.parse(localStorage.getItem("tecnicosUAM")) || [];
        tecnicos.push(nuevoTecnico);
        localStorage.setItem("tecnicosUAM", JSON.stringify(tecnicos));

        formTecnico.reset();
        cargarTecnicos();
        alert("Técnico registrado con éxito.");
    });
});

function cargarTecnicos() {
    const tabla = document.getElementById("tablaTecnicos");
    const tecnicos = JSON.parse(localStorage.getItem("tecnicosUAM")) || [];

    if (tecnicos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" class="sin-datos">No hay personal técnico registrado.</td></tr>`;
        return;
    }

    tabla.innerHTML = "";
    tecnicos.forEach(tecnico => {
        const fila = document.createElement("tr");

        let claseEstado = tecnico.estado === "Disponible" ? "estado-disponible" : "estado-ocupado";

        fila.innerHTML = `
            <td>${tecnico.nombre}</td>
            <td>${tecnico.especialidad}</td>
            <td class="${claseEstado}">${tecnico.estado}</td>
            <td>
                <button onclick="eliminarTecnico(${tecnico.id})" class="boton-salir" style="padding: 4px 8px; font-size: 12px;">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function eliminarTecnico(id) {
    if (!confirm("¿Está seguro de eliminar a este técnico del sistema?")) return;

    let tecnicos = JSON.parse(localStorage.getItem("tecnicosUAM")) || [];
    tecnicos = tecnicos.filter(t => t.id !== id);

    localStorage.setItem("tecnicosUAM", JSON.stringify(tecnicos));
    cargarTecnicos();
}