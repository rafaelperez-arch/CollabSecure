document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       1. VARIABLES Y ELEMENTOS (Referencias al HTML)
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
    const USERS = { 
        'alice': 'password123', 
        'bob': 'secret456' 
    };

    // Lista de palabras prohibidas
    const BAD_WORDS = [
        'tonto', 'idiota', 'estupido', 'feo', 'odioso', 'inutil', 
        'perra', 'mierda', 'basura', 'puta'
    ];


    /* =====================================================
       2. LÓGICA DEL LOGIN (INICIAR SESIÓN)
    ===================================================== */
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const privacyCheck = document.getElementById('accept-privacy');

            // 1. Validar Checkbox de Privacidad
            if (!privacyCheck.checked) {
                showFlash('Debes aceptar la política de privacidad y uso de datos.', 'error');
                return;
            }

            // 2. Validar Usuario y Contraseña
            if (USERS[username] && USERS[username] === password) {
                showFlash('¡Bienvenido! Ingresando al sistema...', 'success');
                
                // Simular transición
                setTimeout(() => {
                    loginSection.style.display = 'none';
                    boardSection.style.display = 'block';
                    navUser.textContent = `Usuario: ${username}`;
                    navLogout.style.display = 'inline';
                }, 1000);

            } else {
                showFlash('Usuario o contraseña incorrectos.', 'error');
            }
        });
    }


    /* =====================================================
       3. LÓGICA DEL TABLERO (PUBLICAR MENSAJES)
    ===================================================== */
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const recipient = document.getElementById('recipient').value || 'Todos';
            const rawContent = document.getElementById('content').value;

            // Filtrar groserías antes de publicar
            const safeContent = filterText(rawContent);

            addMessageToBoard(recipient, safeContent);

            // Limpiar campo
            document.getElementById('content').value = '';
        });
    }


    /* =====================================================
       4. FUNCIONES AUXILIARES (Hacen que todo funcione)
    ===================================================== */

    // Función: Mostrar mensajes de alerta (rojo/verde)
    function showFlash(msg, type) {
        flashMsg.textContent = msg;
        flashMsg.className = `flash-msg ${type}`;
        setTimeout(() => { flashMsg.textContent = ''; flashMsg.className = 'flash-msg'; }, 3000);
    }

    // Función: Cerrar Sesión
    if (navLogout) {
        navLogout.addEventListener('click', (e) => {
            e.preventDefault();
            location.reload(); 
        });
    }

    // Función: Censurar palabras con asteriscos
    function filterText(text) {
        let cleanText = text;
        BAD_WORDS.forEach(word => {
            const regex = new RegExp(word, 'gi'); 
            const stars = '*'.repeat(word.length);
            cleanText = cleanText.replace(regex, stars);
        });
        return cleanText;
    }

    // Función: Crear la tarjeta visual del mensaje
    function addMessageToBoard(to, text) {
        const msgDiv = document.createElement('div');
        
        // Estilos para la tarjeta
        msgDiv.style.border = "1px solid #ddd"; 
        msgDiv.style.padding = "15px";
        msgDiv.style.marginTop = "15px";
        msgDiv.style.borderRadius = "8px";
        msgDiv.style.backgroundColor = "#fff";
        msgDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentUser = document.getElementById('nav-user').textContent.replace('Usuario: ', '') || 'Anónimo';

        msgDiv.innerHTML = `
            <div style="margin-bottom: 8px; font-size: 0.9em; color: #555;">
                <strong>${currentUser}</strong> para <em>${to}</em>
                <span style="float:right; color:#999;">${time}</span>
            </div>
            <div style="font-size: 1.1em; color: #333;">${text}</div>
        `;

        messagesList.prepend(msgDiv);
    }

}); // <--- ESTE CIERRE ES VITAL, NO LO BORRES
