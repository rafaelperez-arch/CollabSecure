document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const flashMsg = document.getElementById('flash');

    // Credenciales Demo (En una app real, esto vendría del Backend)
    const USERS = {
        'alice': 'password123',
        'bob': 'secret456'
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // 1. Capturar valores
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const privacyCheck = document.getElementById('accept-privacy');

        // 2. VALIDACIÓN: ¿Aceptó la política? (Esto es lo que nos faltaba)
        if (!privacyCheck.checked) {
            showFlash('Debes aceptar la política de privacidad para continuar.', 'error');
            return; // Detiene el proceso aquí
        }

        // 3. Simulación de Hashing y Validación
        // (Verificamos si el usuario existe y la contraseña coincide)
        if (USERS[username] && USERS[username] === password) {
            showFlash('¡Autenticación exitosa! Redirigiendo...', 'success');
            
            // Simular redirección al dashboard (ocultar login, mostrar tablero)
            setTimeout(() => {
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('board-section').style.display = 'block';
                document.getElementById('nav-user').textContent = `Hola, ${username}`;
                document.getElementById('nav-logout').style.display = 'inline';
            }, 1000);

        } else {
            showFlash('Usuario o contraseña incorrectos.', 'error');
        }
    });

    // Función para mostrar mensajes de alerta
    function showFlash(message, type) {
        flashMsg.textContent = message;
        flashMsg.className = `flash-msg ${type}`; // 'error' o 'success'
        
        // Borrar mensaje después de 3 segundos
        setTimeout(() => {
            flashMsg.textContent = '';
            flashMsg.className = 'flash-msg';
        }, 3000);
    }

    // Botón de cerrar sesión (opcional)
    document.getElementById('nav-logout').addEventListener('click', (e) => {
        e.preventDefault();
        location.reload(); // Recarga la página para salir
    });
});
