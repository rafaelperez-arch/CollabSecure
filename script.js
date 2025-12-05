document.addEventListener('DOMContentLoaded', () => {
    /* =====================================================
       1. LÓGICA DE LOGIN Y SEGURIDAD
    ===================================================== */
    const loginForm = document.getElementById('login-form');
    const flashMsg = document.getElementById('flash');
    const loginSection = document.getElementById('login-section');
    const boardSection = document.getElementById('board-section');
    const navUser = document.getElementById('nav-user');
    const navLogout = document.getElementById('nav-logout');

    // Usuarios Demo (Simulación de Base de Datos)
    const USERS = { 
        'alice': 'password123', 
        'bob': 'secret456' 
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Capturar valores
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const privacyCheck = document.getElementById('accept-privacy');

        // VALIDACIÓN 1: ¿Aceptó la política de privacidad?
        if (!privacyCheck.checked) {
            showFlash('Debes aceptar la política de privacidad y uso de datos.', 'error');
            return; // Detiene el proceso si no está marcado
        }

        // VALIDACIÓN 2: Credenciales correctas
        if (USERS[username] && USERS[username] === password) {
            showFlash('¡Bienvenido! Ingresando al sistema...', 'success');
            
            // Simular carga y cambio de pantalla
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

    // Función auxiliar para mostrar mensajes (rojo o verde)
    function showFlash(msg, type) {
        flashMsg.textContent = msg;
        flashMsg.className = `flash-msg ${type}`;
        // Borrar mensaje a los 3 segundos
        setTimeout(() => { flashMsg.textContent = ''; flashMsg.className = 'flash-msg'; }, 3000);
    }

    // Botón de cerrar sesión
    navLogout.addEventListener('click', (e) => {
        e.preventDefault();
        location.reload(); // Recarga la página para limpiar todo
    });

    /* =====================================================
       2. LÓGICA DEL TABLERO Y CENSURA (FILTRO DE PALABRAS)
    ===================================================== */
    const postForm = document.getElementById('post-form');
    const messagesList = document.getElementById('messages');

    // LISTA NEGRA: Agrega aquí las palabras que quieras bloquear
    const BAD_WORDS = [
        'tonto', 'idiota', 'estupido', 'feo', 'odioso', 'inutil', 
        'perra', 'mierda', 'basura', 'puta'
    ];

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const recipient = document.getElementById('recipient').value || 'Todos';
        const rawContent = document.getElementById('content').value;

        // PASO CLAVE: Filtrar el texto antes de mostrarlo
        const safeContent = filterText(rawContent);

        // Crear y agregar la tarjeta al tablero
        addMessageToBoard(recipient, safeContent);

        // Limpiar el campo de texto
        document.getElementById('content').value = '';
    });

    // Función que reemplaza malas palabras por asteriscos
    function filterText(text) {
        let cleanText = text;
        BAD_WORDS.forEach(word => {
            // 'gi' significa: global (todas las veces que aparezca) e insensible a mayúsculas/minúsculas
            const regex = new RegExp(word, 'gi'); 
            const stars = '*'.repeat(word.length); // Crea tantos asteriscos como letras tenga la palabra
            cleanText = cleanText.replace(regex, stars);
        });
        return cleanText;
    }

    // Función para crear el HTML del mensaje
    function addMessageToBoard(to, text) {
        const msgDiv = document.createElement('div');
        
        // Estilos directos para la tarjeta del mensaje (para no complicar el CSS)
        msgDiv.style.border = "1px solid #ddd"; 
        msgDiv.style.padding = "15px";
        msgDiv.style.marginTop = "15px";
        msgDiv.style.borderRadius = "8px";
        msgDiv.style.backgroundColor = "#fff";
        msgDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";

        // Obtener hora actual
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Obtener usuario actual (o anonimo si fallara algo)
        const currentUser = document.getElementById('nav-user').textContent.replace('Usuario: ', '') || 'Anónimo';

        msgDiv.innerHTML = `
            <div style="margin-bottom: 8px; font-size: 0.9em; color: #555;">
                <strong>${currentUser}</strong> para <em>${to}</em>
                <span style="float:right; color:#999;">${time}</span>
            </div>
            <div style="font-size: 1.1em; color: #333;">${text}</div>
        `;

        // Prepend agrega el mensaje al PRIN
