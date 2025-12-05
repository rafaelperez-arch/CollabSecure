document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       1. VARIABLES Y ELEMENTOS
    ===================================================== */
    const loginForm = document.getElementById('login-form');
    const flashMsg = document.getElementById('flash');
    const loginSection = document.getElementById('login-section');
    const boardSection = document.getElementById('board-section');
    const navUser = document.getElementById('nav-user');
    const navLogout = document.getElementById('nav-logout');
    
    const postForm = document.getElementById('post-form');
    const messagesList = document.getElementById('messages');

    // Usuarios Demo
    const USERS = { 'alice': 'password123', 'bob': 'secret456' };

    // Lista negra (Censura)
    const BAD_WORDS = [
        'tonto', 'idiota', 'estupido', 'feo', 'odioso', 'inutil', 
        'perra', 'mierda', 'basura', 'puta'
    ];

    /* =====================================================
       2. LÓGICA DE INICIO (CARGAR DATOS)
    ===================================================== */
    // Verificar si ya hay una sesión activa (opcional, pero útil)
    const currentUser = localStorage.getItem('collab_user');
    if (currentUser) {
        showBoard(currentUser);
    }

    /* =====================================================
       3. LÓGICA DEL LOGIN
    ===================================================== */
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const privacyCheck = document.getElementById('accept-privacy');

            if (!privacyCheck.checked) {
                showFlash('Debes aceptar la política de privacidad.', 'error');
                return;
            }

            if (USERS[username] && USERS[username] === password) {
                // Guardar sesión en LocalStorage
                localStorage.setItem('collab_user', username);
                showFlash('¡Bienvenido! Ingresando...', 'success');
                setTimeout(() => showBoard(username), 1000);
            } else {
                showFlash('Usuario o contraseña incorrectos.', 'error');
            }
        });
    }

    function showBoard(username) {
        if(loginSection) loginSection.style.display = 'none';
        if(boardSection) boardSection.style.display = 'block';
        if(navUser) navUser.textContent = `Usuario: ${username}`;
        if(navLogout) navLogout.style.display = 'inline';
        
        // CARGAR MENSAJES GUARDADOS AL ENTRAR
        loadMessages();
    }

    /* =====================================================
       4. LÓGICA DEL TABLERO (PUBLICAR Y GUARDAR)
    ===================================================== */
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const recipient = document.getElementById('recipient').value || 'Todos';
            const rawContent = document.getElementById('content').value;
            const author = localStorage.getItem('collab_user') || 'Anónimo';

            // Filtrar groserías
            const safeContent = filterText(rawContent);

            // Crear objeto del mensaje
            const newMessage = {
                author: author,
                to: recipient,
                text: safeContent,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString()
            };

            // 1. Mostrar en pantalla
            addMessageToBoard(newMessage);
            // 2. Guardar en Memoria Persistente
            saveMessageToStorage(newMessage);

            document.getElementById('content').value = '';
        });
    }

    /* =====================================================
       5. GESTIÓN DE ALMACENAMIENTO (LOCALSTORAGE)
    ===================================================== */
    function saveMessageToStorage(msg) {
        // Obtener mensajes existentes o crear lista vacía
        let messages = JSON.parse(localStorage.getItem('collab_messages')) || [];
        messages.push(msg); // Agregar el nuevo
        localStorage.setItem('collab_messages', JSON.stringify(messages)); // Guardar
    }

    function loadMessages() {
        // Limpiar tablero actual para no duplicar
        messagesList.innerHTML = '';
        
        const messages = JSON.parse(localStorage.getItem('collab_messages')) || [];
        // Invertir orden para ver los nuevos arriba (opcional)
        messages.reverse().forEach(msg => addMessageToBoard(msg));
    }

    /* =====================================================
       6. FUNCIONES AUXILIARES
    ===================================================== */
    function showFlash(msg, type) {
        flashMsg.textContent = msg;
        flashMsg.className = `flash-msg ${type}`;
        setTimeout(() => { flashMsg.textContent = ''; flashMsg.className = 'flash-msg'; }, 3000);
    }

    if (navLogout) {
        navLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('collab_user'); // Borrar sesión activa
            location.reload(); 
        });
    }

    function filterText(text) {
        let cleanText = text;
        BAD_WORDS.forEach(word => {
            const regex = new RegExp(word, 'gi'); 
            const stars = '*'.repeat(word.length);
            cleanText = cleanText.replace(regex, stars);
        });
        return cleanText;
    }

    function addMessageToBoard(msgData) {
        const msgDiv = document.createElement('div');
        msgDiv.style.border = "1px solid #ddd"; 
        msgDiv.style.padding = "15px";
        msgDiv.style.marginTop = "15px";
        msgDiv.style.borderRadius = "8px";
        msgDiv.style.backgroundColor = "#fff";
        msgDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";

        msgDiv.innerHTML = `
            <div style="margin-bottom: 8px; font-size: 0.9em; color: #555;">
                <strong>${msgData.author}</strong> para <em>${msgData.to}</em>
                <span style="float:right; color:#999;">${msgData.date} - ${msgData.time}</span>
            </div>
            <div style="font-size: 1.1em; color: #333;">${msgData.text}</div>
        `;
        // Append simple porque ya invertimos el array al cargar, 
        // o Prepend si es un mensaje nuevo en vivo.
        // Para simplificar, usamos prepend siempre en la vista:
        messagesList.prepend(msgDiv); 
        // NOTA: Al cargar desde memoria (loadMessages) los invertimos, 
        // así que al hacer prepend quedan en orden correcto.
    }
});
