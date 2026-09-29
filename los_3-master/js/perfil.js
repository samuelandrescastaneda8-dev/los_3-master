document.addEventListener("DOMContentLoaded", function () {
    // 1. Validar sesión de estudiante
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo || usuarioActivo.rol !== "estudiante") {
        window.location.href = "index.html";
        return;
    }

    // 2. Rellenar campos con los datos actuales
    const inputNombre = document.getElementById("nombrePerfil");
    const inputCorreo = document.getElementById("correoPerfil");
    const nombreEstudianteElem = document.getElementById("nombreEstudiante");

    inputNombre.value = usuarioActivo.nombre;
    inputCorreo.value = usuarioActivo.correo;
    nombreEstudianteElem.textContent = `Hola, ${usuarioActivo.nombre}`;

    // 3. Manejar la actualización de datos
    const formPerfil = document.getElementById("formPerfil");
    formPerfil.addEventListener("submit", function (e) {
        e.preventDefault();

        const nuevoNombre = inputNombre.value.trim();
        const nuevaPassword = document.getElementById("passwordPerfil").value.trim();
        
        const errorNombre = document.getElementById("errorNombre");
        const errorPassword = document.getElementById("errorPassword");
        const mensaje = document.getElementById("mensajePerfil");

        errorNombre.textContent = "";
        errorPassword.textContent = "";
        mensaje.textContent = "";

        let esValido = true;

        // Validar nombre
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexNombre.test(nuevoNombre)) {
            errorNombre.textContent = "El nombre solo debe contener letras.";
            esValido = false;
        }

        // Validar contraseña solo si el usuario escribió algo
        if (nuevaPassword !== "") {
            const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!regexPassword.test(nuevaPassword)) {
                errorPassword.textContent = "Mínimo 8 caracteres, al menos una mayúscula y un número.";
                esValido = false;
            }
        }

        if (!esValido) return;

        // Actualizar en el objeto de sesión activa
        usuarioActivo.nombre = nuevoNombre;
        if (nuevaPassword !== "") {
            usuarioActivo.password = nuevaPassword;
        }

        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));

        // Actualizar también en la lista general de usuarios (usuariosUAM)
        let usuarios = JSON.parse(localStorage.getItem("usuariosUAM")) || [];
        usuarios = usuarios.map(u => {
            if (u.correo === usuarioActivo.correo) {
                u.nombre = nuevoNombre;
                if (nuevaPassword !== "") u.password = nuevaPassword;
            }
            return u;
        });
        localStorage.setItem("usuariosUAM", JSON.stringify(usuarios));

        mensaje.textContent = "¡Perfil actualizado con éxito!";
        mensaje.style.color = "#4d7c55";

        // Actualizar saludo superior
        nombreEstudianteElem.textContent = `Hola, ${nuevoNombre}`;

        setTimeout(() => {
            document.getElementById("passwordPerfil").value = "";
        }, 1500);
    });
});