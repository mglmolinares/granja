
const formAdmin = document.getElementById("form-login-admin");
const formTb = document.getElementById("form-login-trabajador");
const formVt = document.getElementById("form-login-veterinario");

// Función para el login del administrador
const loginAdmin = (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuarioAdmin').value.trim();
    const contraseña = document.getElementById('contraseñaAdmin').value.trim();

    if (usuario === "" || contraseña === "") {
        alert("Por favor, complete todos los campos");
        return;
    }

    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }

    fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, contraseña })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token && data.rol === "administrador") {
                // Si el rol es administrador, guarda el token y redirige
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                formAdmin.reset();
                window.location.href = '/html/administrador.html';
            } else {
                alert("Credenciales Incorrectas o acceso no autorizado");
            }
        })
        .catch(error => console.error('Error en login:', error));
};

// Función para el login del trabajador
const loginTb = (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuarioTrabajador').value.trim();
    const contraseña = document.getElementById('contraseñaTrabajador').value.trim();

    if (usuario === "" || contraseña === "") {
        alert("Por favor, complete todos los campos");
        return;
    }

    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }

    fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, contraseña })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token && data.rol === "trabajador") {
                // Si el rol es trabajador, guarda el token y redirige
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                formTb.reset();
                window.location.href = '/html/trabajador.html';
            } else {
                alert("Credenciales Incorrectas o acceso no autorizado");
            }
        })
        .catch(error => console.error('Error en login:', error));
};
// Función para el login del veterinario
const loginVt = (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuarioVeterinario').value.trim();
    const contraseña = document.getElementById('contraseñaVeterinario').value.trim();

    if (usuario === "" || contraseña === "") {
        alert("Por favor, complete todos los campos");
        return;
    }

    if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }

    fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, contraseña })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token && data.rol === "veterinario") {
                // Si el rol es veterinario, guarda el token y redirige
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                formVt.reset();
                window.location.href = '/html/veterinario.html';
            } else {
                alert("Credenciales Incorrectas o acceso no autorizado");
            }
        })
        .catch(error => console.error('Error en login:', error));
};

// Agregar listeners para los formularios
formAdmin.addEventListener("submit", loginAdmin);
formTb.addEventListener("submit", loginTb);
formVt.addEventListener("submit", loginVt);
