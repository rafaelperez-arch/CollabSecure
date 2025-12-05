document.addEventListener('DOMContentLoaded', () => {
    /* -----------------------------------------------------
       1. LÓGICA DE LOGIN (Lo que ya tenías)
    ----------------------------------------------------- */
    const loginForm = document.getElementById('login-form');
    const flashMsg = document.getElementById('flash');
    const loginSection = document.getElementById('login-section');
    const boardSection = document.getElementById('board-section');
    const navUser = document.getElementById('nav-user');
    const navLogout = document.getElementById('nav-logout');

    // Usuarios Demo
    const USERS = { 'alice': 'password123', 'bob': 'secret456' };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const privacyCheck = document.getElementById('accept-privacy');

        // Validación de Checkbox
        if (!privacyCheck.checked) {
            showFlash('Debes aceptar la política de privacidad.', 'error');
            return;
        }

        // Validación de Credenciales
        if (USERS[username] && USERS[username] === password) {
            showFlash('¡Bienvenido! Ingresando al sistema...', 'success');
            setTimeout(() => {
                loginSection.style.display = 'none';
                boardSection.style.display = 'block';
                navUser.textContent = `Usuario: ${username}`;
                navLogout.style.display = 'inline';
            }, 1000);
        } else {
            showFlash('Credenciales incorrectas.', 'error');
        }
    });

    function showFlash(msg, type) {
        flashMsg.textContent = msg;
        flashMsg.className = `flash-msg ${type}`;
        setTimeout(() => { flashMsg.textContent = ''; flashMsg.className = 'flash-msg'; }, 3000);
    }

    navLogout.addEventListener('click', (e) => {
        e.preventDefault();
        location.reload();
    });

    /* -----------------------------------------------------
       2. LÓGICA DEL TABLERO Y FILTRO DE CONTENIDO (NUEVO)
    ----------------------------------------------------- */
    const postForm = document.getElementById('post-form');
    const messagesList = document.getElementById('messages');

    // Lista de palabras prohibidas (puedes agregar más)
    const BAD_WORDS = ['tonto', 'idiota', 'estupido', 'feo', 'odioso', 'inutil'];

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const recipient = document.getElementById('recipient').value || 'Todos';
        const rawContent = document.getElementById('content').value;

        // APLICAR FILTRO: Reemplaza groserías con asteriscos
        const safeContent = filterText(rawContent);

        // Crear el elemento visual del mensaje
        addMessageToBoard(recipient, safeContent);

        // Limpiar formulario
        document.getElementById('content').value = '';
    });

    function filterText(text) {
        let cleanText = text;
        BAD_WORDS.forEach(word => {
            // Crea una expresión regular para buscar la palabra sin importar mayúsculas/minúsculas
            const regex = new RegExp(word, 'gi'); 
            // Reemplaza con asteriscos del mismo largo (ej: tonto -> *****)
            const stars = '*'.repeat(word.length);
            cleanText = cleanText.replace(regex, stars);
        });
        return cleanText;
    }

    function addMessageToBoard(to, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-card'; // Asegúrate de tener estilo para esto o usa un estilo simple
        msgDiv.style.border = "1px solid #ddd"; 
        msgDiv.style.padding = "10px";
        msgDiv.style.marginTop = "10px";
        msgDiv.style.borderRadius = "5px";
        msgDiv.style.backgroundColor = "#f9f9f9";

        // Obtener hora actual
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgDiv.innerHTML = `
            <div style="font-weight: bold; color: #0056b3;">Para: ${to} <span style="font-size:0.8em; color:#666; float:right;">${time}</span></div>
            <div style="margin-top: 5px;">${text}</div>
        `;

        // Agregar al principio de la lista
        messagesList.prepend(msgDiv);
    }
});
