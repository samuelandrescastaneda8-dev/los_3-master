document.addEventListener("DOMContentLoaded", function () {
    const formRegistro = document.getElementById("formRegistro");
    const mensaje = document.getElementById("mensajeRegistro");

    formRegistro.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombreRegistro").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim();
        const password = document.getElementById("passwordRegistro").value.trim();

        // Elementos de error específicos
        const errorNombre = document.getElementById("errorNombre");
        const errorCorreo = document.getElementById("errorCorreo");
        const errorPassword = document.getElementById("errorPassword");

        // Limpiar mensajes previos
        errorNombre.textContent = "";
        errorCorreo.textContent = "";
        errorPassword.textContent = "";
        mensaje.textContent = "";

        let esValido = true;

        // 1. Validar nombre (solo letras y espacios)
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexNombre.test(nombre)) {
            errorNombre.textContent = "El nombre solo debe contener letras.";
            esValido = false;
        }

        // 2. Validar correo institucional (debe terminar en los dominios oficiales de la UAM)
        if (!correo.endsWith("@uam.edu.co") && !correo.endsWith("@autonoma.edu.co")) {
            errorCorreo.textContent = "Debe usar un correo institucional válido (@uam.edu.co).";
            esValido = false;
        }

        // 3. Validar seguridad de la contraseña (Mínimo 8 caracteres, 1 mayúscula y 1 número)
        const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regexPassword.test(password)) {
            errorPassword.textContent = "Mínimo 8 caracteres, al menos una mayúscula y un número.";
            esValido = false;
        }

        if (!esValido) return;

        // 4. Verificar si el correo ya existe en localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuariosUAM")) || [];
        const existe = usuarios.some(u => u.correo === correo);

        if (existe) {
            mensaje.textContent = "Este correo ya se encuentra registrado.";
            mensaje.style.color = "#b34848";
            return;
        }

        // 5. Guardar nuevo usuario
        const nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            password: password,
            rol: "estudiante"
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuariosUAM", JSON.stringify(usuarios));

        mensaje.textContent = "¡Registro exitoso! Redirigiendo al inicio de sesión...";
        mensaje.style.color = "#4d7c55";
        formRegistro.reset();

        // Redirigir a index.html (el login) después de 1.5 segundos
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
});