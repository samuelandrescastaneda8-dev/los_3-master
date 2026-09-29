document.addEventListener("DOMContentLoaded", function () {
    // 1. Si ya hay una sesión activa, redirigir directamente al panel correspondiente
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuarioActivo) {
        redirigirSegunRol(usuarioActivo.rol);
        return;
    }

    const formLogin = document.getElementById("formLogin");
    const mensaje = document.getElementById("mensajeLogin");

    // 2. Manejar el evento de inicio de sesión
    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const correo = document.getElementById("correoLogin").value.trim();
        const password = document.getElementById("passwordLogin").value.trim();

        // Cuenta por defecto del Administrador
        if (correo === "admin@uam.edu.co" && password === "Admin123*") {
            const adminUser = { nombre: "Administrador", correo: correo, rol: "administrador" };
            localStorage.setItem("usuarioActivo", JSON.stringify(adminUser));
            window.location.href = "admin.html";
            return;
        }

        // Buscar usuarios registrados en localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuariosUAM")) || [];
        const usuarioEncontrado = usuarios.find(u => u.correo === correo && u.password === password);

        if (usuarioEncontrado) {
            localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
            redirigirSegunRol(usuarioEncontrado.rol);
        } else {
            mensaje.textContent = "Correo o contraseña incorrectos.";
            mensaje.style.color = "#b34848";
        }
    });
});

function redirigirSegunRol(rol) {
    if (rol === "administrador") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "estudiante.html";
    }
}