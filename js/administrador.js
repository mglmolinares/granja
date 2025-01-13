console.log("hola")
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    // Si no hay token, redirige al login
    window.location.href = "/web/html/login.html";
    return;
  }

  if (rol !== "administrador") {
    window.location.href = "/web/html/login.html";
  }

});
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");

  // Redirigir a la página de login
  window.location.href = "/web/html/login.html";
}

let idUsuarioSeleccionado = null;
const token = localStorage.getItem("token")

// Decodificacion de token
const parseJwt = (token) => {
  const base64Url = token.split('.')[1]; // Obtener la parte del payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazos para el formato base64
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload); // Convertir a objeto JSON
}
const userInfo = parseJwt(token);
console.log(userInfo)
let info = document.getElementById("info")
info.innerHTML = `Bienvenid@ : ${userInfo.usuario}`

document.addEventListener("DOMContentLoaded", () => {
  Swal.fire({
    position: "top-end",
    title: `Bienvenid@ : ${userInfo.usuario}`,
    html: `<img src="/web/img/hola.gif" alt="custom icon" style="width: 100px; height: 100px;">`, // Imagen personalizada
    showConfirmButton: false,
    timer: 1500
  });
});

const cerrar = () => {
  // Primera alerta de confirmación
  Swal.fire({
    title: "Seguro que desea salir?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      // Segunda alerta (confirmación de salida) con una acción adicional
      Swal.fire({
        title: "Adiós!",
        text: "Tu sesión se ha cerrado.",
        html: `<img src="/web/img/mano.gif" alt="custom icon" style="width: 100px; height: 100px;">`, // Imagen personalizada
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#28a745" // Cambiar el color si es necesario
      }).then(() => {
        logout()
      });
    }
  });
};



// // tablas
let infoForm = {};
var tablaUsuarios = document.getElementById("tablacontacs");
let tablaTareas = document.getElementById("taskTable");
let tablaLote = document.getElementById("tabla-lote");
let tablaGalpon = document.getElementById("tabla-galpones");


// // formularios
var formAdd = document.getElementById("formAdd");
var formTareas = document.getElementById("form-tareas");
var formLote = document.getElementById("form-lot");
var formGalpon = document.getElementById("form-addgalpon");
var formEditTareas = document.getElementById("edit-form-tareas");


const nickname = () => {
  let nombre = document.getElementById('nom').value.trim();
  let apellido = document.getElementById('apellido').value.trim();
  // Obtener la primera letra del nombre y convertirla a minúsculas
  let inicial = nombre.charAt(0).toLowerCase();

  // Concatenar la inicial con el apellido
  let nomuser = inicial + apellido.toLowerCase();

  // Asignar el valor generado al campo de usuario
  document.getElementById("usuario").value = nomuser;


}
const crearAlert = (elemento, id, mensaje) => {
  // Eliminar alertas previas si existen
  const existingAlert = document.getElementById(id);
  if (existingAlert) {
    existingAlert.remove();
  }

  // Obtén el elemento de entrada por su ID
  const inputElement = document.getElementById(elemento);

  // Obtén el div padre que contiene el label e input usando parentNode
  const parentDiv = inputElement.parentNode;

  // Crea un nuevo div
  const newDiv = document.createElement('div');
  newDiv.textContent = mensaje;

  // Agrega clases al nuevo div
  newDiv.classList.add('alert', 'alert-danger', 'text-center');

  // Agrega un ID al nuevo div
  newDiv.setAttribute('id', id);

  console.log("input :"+id)
  // Inserta el nuevo div como primer hijo del div padre, antes del label e input
  if (id==='alert-id_usuario') {
    parentDiv.parentNode.insertBefore(newDiv, parentDiv);
    
  }else{
    parentDiv.insertBefore(newDiv, parentDiv.firstChild);

  }

}
const ocultarAlert = (id) => {
  let elemento = document.getElementById(id);
  elemento.classList.add("d-none");
}


const togglePass = (button, contraseña) => {
  // Encontrar la celda que contiene la contraseña
  let celda = button.closest('td');

  // Verificar si actualmente la contraseña está oculta o visible
  if (button.classList.contains('bi-eye-fill')) {
    // Si está oculta, mostrar la contraseña
    celda.innerHTML = contraseña +
      ` <button class="btn bi bi-eye-slash-fill text-success fs-5 border-0 " onclick="togglePass(this, '${contraseña}')"></button>`;
  } else {
    // Si está visible, ocultarla de nuevo con puntos
    celda.innerHTML = '•'.repeat(contraseña.length) +
      ` <button class="btn bi bi-eye-fill text-success fs-5 border-0 " onclick="togglePass(this, '${contraseña}')"></button>`;
  }
};

const togglePassEdit = (button) => {
  var passwordInput = document.getElementById("edit-usuario-contraseña"); // Obtén el campo de la contraseña
  var icon = button; // Obtén el botón con el ícono del ojo

  // Verifica si la contraseña está oculta
  if (passwordInput.type === "password") {
    passwordInput.type = "text"; // Muestra la contraseña
    icon.classList.remove("bi-eye-fill"); // Cambia el ícono a ojo abierto
    icon.classList.add("bi-eye-slash-fill");
  } else {
    passwordInput.type = "password"; // Oculta la contraseña
    icon.classList.remove("bi-eye-slash-fill"); // Cambia el ícono a ojo cerrado
    icon.classList.add("bi-eye-fill");
  }
}






// // Usuarios
const agregarUsuarios = (event) => {
  event.preventDefault();
  const id_usuario = document.getElementById('id-usuario').value.trim();
  const nombre = document.getElementById('nom').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const edad = document.getElementById('edad').value.trim();
  const sexoElement = document.querySelector('input[name="txtsexo"]:checked');
  const sexo = sexoElement ? sexoElement.value : null;
  const usuario = document.getElementById('usuario').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const rol = document.getElementById('rol').value.trim();



  // Validar nombre y apellido (solo letras y espacios)
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const usuarioRegex = /^[a-zA-Z]+$/; // Solo letras
  const passwordRegex = /^[a-zA-Z0-9]+$/; // Solo letras y números

  if (!nombre || !apellido || !edad || !sexo || !id_usuario || !usuario || !contraseña || !rol) {
    Swal.fire({
      title: "Debes completar todos los campos!",
      icon: "warning"
    });
    return;
  }

  // Validar nombre
  if (!nameRegex.test(nombre)) {
    crearAlert('nom', 'alert-nom', 'El nombre debe contener solo letras');
    setTimeout(() => {
      ocultarAlert("alert-nom");
    }, 3000);
    return;
  }

  // Validar apellido
  if (!nameRegex.test(apellido)) {
    crearAlert('apellido', 'alert-apellido', 'El apellido debe contener solo letras');
    setTimeout(() => {
      ocultarAlert("alert-apellido");
    }, 3000);
    return;
  }

  // Validar edad (debe ser un número positivo)
  if (isNaN(edad) || edad < 0 || edad > 90) {
    crearAlert('edad', 'alert-edad', 'Ingrese una edad válida');
    setTimeout(() => {
      ocultarAlert("alert-edad");
    }, 3000);
    return;
  }


  // Validar cédula (solo números y positivos)
  if (isNaN(id_usuario) || id_usuario < 0) {
    crearAlert('id-usuario', 'alert-id_usuario', 'Ingrese un número de cédula válido');
    setTimeout(() => {
      ocultarAlert("alert-id_usuario");
    }, 3000);
    return;
  }

  // Validar usuario (solo letras y longitud entre 3 y 20 caracteres)
  if (usuario.length < 3 || usuario.length > 20 || !usuarioRegex.test(usuario)) {
    crearAlert('usuario', 'alert-usuario', 'El usuario debe contener solo letras y tener entre 3 y 20 caracteres');
    setTimeout(() => {
      ocultarAlert("alert-usuario");
    }, 3000);
    return;
  }

  // Validar contraseña (solo letras y números, longitud entre 8 y 30 caracteres)
  if (contraseña.length < 8 || contraseña.length > 30 || !passwordRegex.test(contraseña)) {
    crearAlert('contraseña', 'alert-contraseña', 'La contraseña debe tener entre 8 y 30 caracteres y solo contener letras y números');
    setTimeout(() => {
      ocultarAlert("alert-contraseña");
    }, 3000);
    return;
  }

  // Validar rol (debe estar seleccionado)
  if (!rol) {
    crearAlert('rol', 'alert-rol', 'Debe seleccionar un rol');
    setTimeout(() => {
      ocultarAlert("alert-rol");
    }, 3000);
    return;
  }



  let data = {
    id_usuario: id_usuario,
    nombres: nombre,
    apellidos: apellido,
    edad: edad,
    sexo: sexo,
    usuario: usuario,
    contraseña: contraseña,
    id_rol: rol
  }
  console.log(data)
  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/nuevo_usuario', data,
  }).then(function (response) {
    // document.getElementById("mensaje").classList.remove("d-none")
    // document.getElementById("check").innerHTML = " "
    Swal.fire({
      title: "Usuario creado con éxito!",
      icon: "success"
    });
    // alert("Usuario Agregado ")
    formAdd.reset()
    cargarUsuarios()
  }).catch(err => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ocurrio un error al crear usuario!",
    });
    console.log('Error: ', err);
  })
}


const cargarUsuarios = () => {


  const tbody = document.querySelector('#tablacontacs tbody'); // Seleccionar el tbody de la tabla

  /////////////////////// Cantidad de usuarios /////////////////////////////////
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/total_usuarios',
  })
    .then(function (response) {
      console.log(response.data)
      document.getElementById('num_usuarios').innerHTML = `${response.data.total} Usuarios Registrados`;
    })
    .catch(err => console.log('Error: ', err));

  ////////////////////////////////////////////////////////////////////////

  //////////////////////// CONSULTA TODOS LOS USUARIOS ///////////////////////////////
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/obtener_usuarios',
  })
    .then(function (response) {
      console.log(response.data)

      const tabla = $('#tablacontacs').DataTable(); // Acceder a la tabla DataTable
      tabla.clear(); // Limpiar las filas actuales de DataTables

      response.data.forEach(user => {
        tabla.row.add([
          user.id_usuario,
          user.nombres,
          user.apellidos,
          user.usuario,
          // Mostrar puntos al principio y el botón de "ojo"
          '•'.repeat(user.contraseña.length) +
          ` <button class="btn bi bi-eye-fill text-success fs-5 border-0" onclick="togglePass(this, '${user.contraseña}')"></button>`,
          user.tipo_usuario,
          `<a class="bi bi-pencil-square btn btn-warning mx-5" data-bs-toggle="modal" data-bs-target="#modalEditarUsuario" onclick="editarUsuarios(this)"></a>`
        ]).draw(false);  // Añadir la fila y redibujar
      });



    })
    .catch(err => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ha ocurrido un error al obtener los usuarios",

      });

      console.log('Error: ', err)
    })
};
const editarUsuarios = (button) => {
  const row = button.parentNode.parentNode;
  const id = row.cells[0].innerText;

  axios.get(`http://127.0.0.1:3000/obtener_usuario/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => {
      const user = response.data;
      document.getElementById('edit-id-usuario').value = user.id_usuario;
      document.getElementById('edit-nombre-usuario').value = user.nombres;
      document.getElementById('edit-apellido-usuario').value = user.apellidos;
      document.getElementById('edit-edad-usuario').value = user.edad;

      // Seleccionar el radio button de sexo según el valor recuperado
      if (user.sexo === "M") {
        document.getElementById('edit-masculino').checked = true;
      } else if (user.sexo === "F") {
        document.getElementById('edit-femenino').checked = true;
      } else {
        document.getElementById('edit-masculino').checked = false;
        document.getElementById('edit-femenino').checked = false;


      }

      document.getElementById('edit-usuario-username').value = user.usuario;
      document.getElementById('edit-usuario-contraseña').value = user.contraseña;
      document.getElementById('edit-usuario-rol').value = user.id_rol;

      console.log(user);

      // Mostrar el modal de edición (si aplica)
      // const modal = new bootstrap.Modal(document.getElementById('modalEdit'));
      // modal.show();
    })
    .catch(err => {
      console.log('Error: ', err);
      alert('Ocurrió un error al obtener los datos del usuario');
    });
}
const guardarCambiosUsuarios = () => {
  const id = parseInt(document.getElementById('edit-id-usuario').value.trim())
  const nombre = document.getElementById('edit-nombre-usuario').value.trim();
  const apellido = document.getElementById('edit-apellido-usuario').value.trim();
  const edad = parseInt(document.getElementById('edit-edad-usuario').value.trim());
  const sexo = document.querySelector('input[name="edit-sexo-usuario"]:checked').value;
  const usuario = document.getElementById('edit-usuario-username').value.trim();
  const contraseña = document.getElementById('edit-usuario-contraseña').value.trim();
  const rol = parseInt(document.getElementById('edit-usuario-rol').value.trim());



  if (!nombre || !apellido || !edad || !sexo || !id || !usuario || !contraseña || !rol) {
    Swal.fire({
      title: "Debes completar todos los campos!",
      icon: "warning"
    });
    return;
  }


  // Validar nombre y apellido (solo letras y espacios)
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(nombre)) {
    crearAlert('edit-nombre-usuario', 'alert-nom', 'El nombre debe contener solo letras');
    setTimeout(() => {
      ocultarAlert("alert-nom");
    }, 3000);
    return;
  }
  if (!nameRegex.test(apellido)) {

    crearAlert('edit-apellido-usuario', 'alert-apellido', 'El apellido debe contener solo letras')
    setTimeout(() => {
      ocultarAlert("alert-apellido");
    }, 3000);
    return;

  }
  if (edad > 90) {
    crearAlert('edit-edad-usuario', 'alert-edad', 'Ingrese una edad valida')
    setTimeout(() => {
      ocultarAlert("alert-edad");
    }, 3000);
    return;
  }

  // Validar edad (debe ser un número positivo)
  if (isNaN(edad) || edad < 0) {
    crearAlert('edit-edad-usuario', 'alert-edad', 'Ingrese una edad valida')
    setTimeout(() => {
      ocultarAlert("alert-edad");
    }, 3000);
    return;

  }
  if (sexo == null) {
    crearAlert('edit-sexo-usuario', 'alert-sexo', 'Seleccione un genero')
    setTimeout(() => {
      ocultarAlert("alert-sexo");
    }, 3000);
    return;

  }

  // Validar cédula (solo números y positivos)
  if (isNaN(id) || id < 0) {
    crearAlert('edit-id-usuario', 'alert-id', 'Ingrese un número de cédula valido')
    setTimeout(() => {
      ocultarAlert("alert-id");
    }, 3000);
    return;

  }

  // Validar usuario (solo letras y números, longitud entre 6 y 20 caracteres)
  if (usuario.length < 3 || usuario.length > 20) {
    crearAlert('edit-usuario-usuario', 'alert-usuario', 'El usuario debe contar entre 3 y 20 caracteres')
    setTimeout(() => {
      ocultarAlert("alert-usuario");
    }, 3000);
    return;

  }
  const usuarioRegex = /^[a-zA-Z0-9]+$/; // Solo letras y números
  if (!usuarioRegex.test(usuario)) {
    crearAlert('edit-usuario-usuario', 'alert-usuario', 'El usuario solo puede contener letras y números')
    setTimeout(() => {
      ocultarAlert("alert-usuario");
    }, 3000);
    return;

  }

  // Validar contraseña (solo letras y números, longitud entre 8 y 30 caracteres)
  if (contraseña.length < 8 || contraseña.length > 30) {
    crearAlert('edit-contraseña-usuario', 'alert-contraseña', 'La contraseña debe contar entre 8 y 30 caracteres')
    setTimeout(() => {
      ocultarAlert("alert-contraseña");
    }, 3000);
    return;

  }
  const passwordRegex = /^[a-zA-Z0-9]+$/; // Solo letras y números
  if (!passwordRegex.test(contraseña)) {
    crearAlert('edit-contraseña-usuario', 'alert-contraseña', 'La contraseña debe contar entre 8 y 30 caracteres')
    setTimeout(() => {
      ocultarAlert("alert-contraseña");
    }, 3000);
    return;


  }


  const data = {
    id_usuario: id,
    nombres: nombre,
    apellidos: apellido,
    edad: edad,
    sexo: sexo,
    usuario: usuario,
    contraseña: contraseña,
    id_rol: rol
  };
  console.log(typeof (edad));
  console.log(typeof (rol));
  console.log(typeof (id));

  console.log(data)


  axios.put(`http://127.0.0.1:3000/editar_usuario/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    }
  })
    .then(function (response) {
      cargarUsuarios();
      Swal.fire({
        icon: "success",
        title: response.data.informacion,
        showConfirmButton: false,
        timer: 1500
      });
    })
    .catch(err => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrio un error al actualizar!",
      });
      console.log('Error: ', err);
    });
}
// // Tareas
const cargarTareas = () => {

  const tbodyt = document.querySelector('#taskTable tbody'); // Seleccionar el tbody de la tabla

  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/obtener_tareas',

  }).then(function (response) {
    console.log(response.data)

    const tabla = $('#taskTable').DataTable(); // Acceder a la tabla DataTable
    tabla.clear(); // Limpiar las filas actuales de DataTables

    response.data.forEach(tarea => {
      tabla.row.add([
        tarea.id_tareas,
        tarea.descripcion,
        tarea.fecha_asignacion,
        tarea.estado,
        tarea.nombres,
        `<a class="bi bi-pencil-square btn btn-warning mx-5" data-bs-toggle="modal" data-bs-target="#modalEditTarea" onClick="editarTareas(this)"></a>`
      ]).draw(false);  // Añadir la fila y redibujar
    });


  }).catch(err => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ocurrio un error al cargar las tareas!",
      
  });
  console.log('Error: ', err)
  })
}







// var id_tareasGlobal;
const editarTareas = (button) => {
  // Obtener la fila correspondiente al botón clicado
  const row = button.parentNode.parentNode;
  let fila_id_tareas = row.cells[0].innerText; // Capturar el ID de la tarea
  let id = parseInt(fila_id_tareas)
  let usuario = row.cells[4].innerText; // Capturar el nombre del usuario

  // Hacer la solicitud GET para obtener los detalles de la tarea
  axios.get(`http://127.0.0.1:3000/obtener_tareas_id/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Si usas autenticación con tokens
    }
  })
    .then(response => {
      // Asumiendo que `response.data` es una lista, tomamos el primer elemento
      const report = response.data;


      if (report) {
        // Asignar los valores obtenidos a los campos de un formulario de edición
        document.getElementById('id-tarea').value = report.id_tareas;  // Usar 'id_tareas' según la estructura de tu tabla
        let select = document.getElementById('edit-estado').value;
        select = report.estado;
        document.getElementById('edit-descripcion').value = report.descripcion;
        document.getElementById('edit-fecha_asignacion').value = report.fecha_asignacion;
        document.getElementById('edit-buscar').value = usuario;
        idUsuarioSeleccionado = report.id_usuario

        // Mostrar información en la consola para verificar
        console.log("ultimo log..................")
        console.log(`id_tareas: ${report.id_tareas}, descripcion: ${report.descripcion}, fecha de asignacion: ${report.fecha_asignacion}, estado: ${report.estado}, id_usuario: ${report.id_usuario}`);
      } else {
        alert('No se encontró la tarea.');
      }
    })
    .catch(err => {
      console.log('Error: ', err);
      alert('Ocurrió un error al obtener los datos del reporte');
    });
};

const guardarCambiosTareas = () => {
  const id = parseInt(document.getElementById('id-tarea').value);
  const descripcion = document.getElementById('edit-descripcion').value;
  const fecha_asignacion = document.getElementById('edit-fecha_asignacion').value;
  const estado = document.getElementById('edit-estado').value;
  const id_usuario = parseInt(idUsuarioSeleccionado);
  console.log(id, descripcion, fecha_asignacion, estado, id_usuario)

  if (descripcion === "") {
    crearAlert('edit-descripcion', 'alert-edit-descripcion', 'Por favor, seleccione una descripción')
    setTimeout(() => {
      ocultarAlert("alert-edit-descripcion");
      }, 3000);
      return;


  }

  if (fecha_asignacion === "") {
    crearAlert('edit-fecha_asignacion', 'alert-edit-fecha_asignacion',
      'Por favor, seleccione una fecha de asignación')
      setTimeout(() => {
        ocultarAlert("alert-edit-fecha_asignacion");
        }, 3000);
        return;

  }

  if (estado === "") {
    crearAlert('edit-estado', 'alert-edit-estado',
      'Por favor, seleccione un estado')
      setTimeout(() => {
        ocultarAlert("alert-edit-estado");
        }, 3000);
        return;
 
  }

  if (!id_usuario) {
    crearAlert('id-tarea', 'alert-id-tarea', 'Por favor, seleccione un usuario')
    setTimeout(() => {
      ocultarAlert("alert-id-tarea");
      }, 3000);
      return;

  }
  axios({
    method: 'PUT',
    url: `http://127.0.0.1:3000/editar_tarea/${id}`,
    data: {

      descripcion: descripcion,
      fecha_asignacion: fecha_asignacion,
      estado: estado,
      id_usuario: id_usuario
    },

    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    }
  })
    .then(function (response) {
      Swal.fire({
        title: "Tarea actualizada",
        icon: "success"
      });
      // alert(response.data.informacion);

      cargarTareas();
    })
    .catch(err => {
      Swal.fire({
        title: "Error",
        text: "Ocurrio un error al actualizar",
        icon: "error"
      });
      console.log('Error: ', err);

    })
}


const agregarTareas = (event) => {
  event.preventDefault();
  const descripcion = document.getElementById('descripcion').value.trim();
  const fecha_asignacion = document.getElementById('fecha_asignacion').value.trim();
  const estado = document.getElementById('estado').value;
  let id_usuario = parseInt(idUsuarioSeleccionado);
  // const inptBuscar=document.getElementById("buscar")



  if (descripcion === "") {
    crearAlert('descripcion', 'alert-descripcion', 'Por favor, seleccione una descripción')
    setTimeout(() => {
      ocultarAlert("alert-descripcion");
      }, 3000);
      return;

  }

  if (fecha_asignacion === "") {
    crearAlert('fecha_asignacion', 'alert-fecha_asignacion', 'Por favor seleccione una fecha de asignación')
    setTimeout(() => {
      ocultarAlert("alert-fecha_asignacion");
      }, 3000);
      return;
   
  }


  if (!id_usuario ) {
    crearAlert('buscar', 'alert-id_usuario', 'Por favor seleccione un usuario')
    setTimeout(() => {
      ocultarAlert("alert-id_usuario");
      }, 3000);
      return;

  }
  const data = {
    descripcion: descripcion,
    fecha_asignacion: fecha_asignacion,
    estado: estado,
    id_usuario: id_usuario
  }
  console.log(data)
  console.log(typeof (id_usuario))
  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/agregar_tarea', data,
  }
  ).then(function (response) {
    Swal.fire({
      title: "Tarea Agregada exitosamente!",
      icon: "success"
    });
    cargarTareas()
    formTareas.reset();
  }).catch(err =>{
    Swal.fire({
      title: "Error",
      text: "Error al agregar tarea",
      icon: "error"
    });
    console.log('Error: ', err)
  }) 
}
// //Mi Granja
// // Lotes
const cargarLote = () => {
  const tbody = document.querySelector('#tabla-lote tbody'); // Seleccionar el tbody de la tabla

  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/obtener_lotes',

  }).then(function (response) {

    const tabla = $('#tabla-lote').DataTable(); // Acceder a la tabla DataTable
    tabla.clear(); // Limpiar las filas actuales de DataTables

    response.data.forEach(lotes => {
      tabla.row.add([
        lotes.id_lote,
        lotes.num_aves,
        lotes.fecha_ingreso,
        lotes.id_galpon,
        `<a class="bi bi-pencil-square btn btn-warning mx-5 " data-bs-toggle="modal" data-bs-target="#modalEditLote"  onClick="editarLote(this)"></a>`
      ]).draw(false);  // Añadir la fila y redibujar
    });



  }).catch(err => {
    Swal.fire({
      title: "Error",
      text: "Error al cargar lotes",
      icon: "error"
    });
    console.log('Error: ', err)
  })
}



const agregarLote = (event) => {
  event.preventDefault();
  const id_galpon = document.getElementById('id_galpon').value.trim();
  const fecha_ingreso = document.getElementById('fecha_ingreso').value.trim();
  const num_aves_lote = document.getElementById('num_aves_lote').value.trim();

  // Validaciones
  if (!num_aves_lote) {
    crearAlert("num_aves_lote", "alert-aves", "Debe ingresar un número de aves")
    setTimeout(() => {
      ocultarAlert("alert-aves");
    }, 3000);
    return;
  }
  if (isNaN(num_aves_lote) || num_aves_lote < 0) {
    crearAlert("num_aves_lote", "alert-aves", "El número de aves debe contener solo números positivos")
    setTimeout(() => {
      ocultarAlert("alert-aves");
    }, 3000);
    return;
  }
  if (!fecha_ingreso) {
    crearAlert("fecha_ingreso", "f_ingreso", "Debe ingresar una fecha de ingreso")
    setTimeout(() => {
      ocultarAlert("f_ingreso");
    }, 3000);
    return;
  }
  if (!id_galpon) {
    crearAlert("id_galpon", "id_gal", "Debe seleccionar un galpón")
    setTimeout(() => {
      ocultarAlert("id_gal");
    }, 3000);
    return;
  }
  if (isNaN(id_galpon) || id_galpon < 0) {
    crearAlert("id_galpon", "id_gal", "El galpón debe contener solo números positivos")
    setTimeout(() => {
      ocultarAlert("id_gal");
    }, 3000);
    return;
  }


  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/crear_lote',
    data: {
      id_galpon: id_galpon,
      fecha_ingreso: fecha_ingreso,
      num_aves: num_aves_lote
    },
  }
  ).then(function (response) {
    cargarLote()
    Swal.fire({
      title: "Exito",
      text: "Lote creado correctamente!",
      icon: "success"
    });

    formLote.reset();
  }).catch(err => {
    Swal.fire({
      title: "Error",
      text: "Ocurrio un error al agregar el lote",
      icon: "error"
    });
    console.log('Error: ', err)
  })
}
const editarLote = (button) => {
  const row = button.parentNode.parentNode;
  const id_lote = row.cells[0].innerText;
  const num_aves_lote = row.cells[1].innerText;
  const fecha_ingreso = row.cells[2].innerText;
  const id_galpon = row.cells[3].innerText;

  document.getElementById('edit-id_lote').value = id_lote;
  document.getElementById('edit-num_aves_lote').value = num_aves_lote;
  document.getElementById('edit-fecha_ingreso').value = fecha_ingreso;
  document.getElementById('edit-id_galpon').value = id_galpon;

}
const guardarCambiosLote = () => {
  const id_lote = document.getElementById("edit-id_lote").value;
  const num_aves_lote = document.getElementById('edit-num_aves_lote').value;
  const fecha_ingreso = document.getElementById('edit-fecha_ingreso').value;
  const id_galpon = document.getElementById('edit-id_galpon').value;
  // Validaciones
  if (!num_aves_lote) {
    crearAlert("edit-num_aves_lote", "alert-aves", "Debe ingresar un número de aves")
    setTimeout(() => {
      ocultarAlert("alert-aves");
    }, 3000);
    return;
  }
  if (isNaN(num_aves_lote) || num_aves_lote < 0) {
    crearAlert("edit-num_aves_lote", "alert-aves", "El número de aves debe contener solo números positivos")
    setTimeout(() => {
      ocultarAlert("alert-aves");
    }, 3000);
    return;
  }
  if (!fecha_ingreso) {
    crearAlert("edit-fecha_ingreso", "f_ingreso", "Debe ingresar una fecha de ingreso")
    setTimeout(() => {
      ocultarAlert("f_ingreso");
    }, 3000);
    return;
  }
  if (!id_galpon) {
    crearAlert("edit-id_galpon", "id_gal", "Debe seleccionar un galpón")
    setTimeout(() => {
      ocultarAlert("id_gal");
    }, 3000);
    return;
  }
  if (isNaN(id_galpon) || id_galpon < 0) {
    crearAlert("edit-id_galpon", "id_gal", "El galpón debe contener solo números positivos")
    setTimeout(() => {
      ocultarAlert("id_gal");
    }, 3000);
    return;
  }

  axios({
    method: 'PUT',
    url: `http://127.0.0.1:3000/actualizar_lote/${id_lote}`,
    data: {
      num_aves: num_aves_lote,
      fecha_ingreso: fecha_ingreso,
      id_galpon: id_galpon
    },
    // headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}`
    //   }
  })
    .then(function (response) {
      Swal.fire({
        title: "Exito",
        text: response.data.informacion + "!",
        icon: "success"
      });

    })
    .catch(err => {
      Swal.fire({
        title: "Error",
        text: "Ocurrio un error al actualizar",
        icon: "error"
      });
      console.log('Error: ', err)
    });
}

// Galpones
const agregarGalpon = (event) => {
  event.preventDefault();
  const capacidad = document.getElementById('capacidadgal').value;
  const numAves = document.getElementById('numaves').value;

  if (!capacidad) {
    crearAlert("capacidadgal", "capacidad_g", "Debe ingresar la capacida del galpon")
    setTimeout(() => {
      ocultarAlert("capacidad_g");
    }, 3000);
    return;
  }
  if (isNaN(capacidad) || capacidad < 0) {
    crearAlert("capacidadgal", "capacidad_g", "Este campo debe contener solo números positivos")
    setTimeout(() => {
      ocultarAlert("capacidad_g");
    }, 3000);
    return;
  }
  if (!numAves) {
    crearAlert("numaves", "numAves", "Debe ingresar el numero de aves del galpón")
    setTimeout(() => {
      ocultarAlert("numAves");
    }, 3000);
    return;
  }
  if (isNaN(numAves) || numAves < 0) {
    crearAlert("numaves", "numAves", "Este campo debe contener solo números positivos")
    setTimeout(() => {
      ocultarAlert("numAves");
    }, 3000);
    return;
  }

  axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/crear_galpon',
    data: {
      capacidad: capacidad,
      aves: numAves
    },
  }
  ).then(function (response) {
    cargarGalpones()
    Swal.fire({
      title: "Exito",
      text: "Galpon creado correctamente!",
      icon: "success"
    });
    formGalpon.reset();
  }).catch(err => {
    Swal.fire({
      title: "Error",
      text: "Ocurrio un error al agregar el galpón",
      icon: "error"
    });
    console.log('Error: ', err)
  })
}
const cargarGalpones = () => {
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/obtener_galpones',

  }).then(function (response) {

    const tabla = $('#tabla-galpones').DataTable(); // Acceder a la tabla DataTable
    tabla.clear(); // Limpiar las filas actuales de DataTables

    response.data.forEach(galpon => {
      tabla.row.add([
        galpon.id_galpon,
        galpon.capacidad,
        galpon.aves,
        `<a class="bi bi-pencil-square btn btn-warning mx-5 " data-bs-toggle="modal" data-bs-target="#modalEditGalpon"  onClick="editarGalpon(this)"></a>`
      ]).draw(false);  // Añadir la fila y redibujar
    });
  }).catch(err => console.log('Error: ', err))
}
const editarGalpon = (button) => {
  const row = button.parentNode.parentNode;
  const id_galpon = row.cells[0].innerText;
  const capacidad = row.cells[1].innerText;
  const num_aves = row.cells[2].innerText;

  document.getElementById('edit-idgalpon').value = id_galpon;
  document.getElementById('edit-capacidad').value = capacidad;
  document.getElementById('edit-num_aves').value = num_aves;

}
const guardarCambiosGalpon = () => {
  const id_galpon = document.getElementById('edit-idgalpon').value;
  const capacidad = document.getElementById('edit-capacidad').value;
  const num_aves = document.getElementById('edit-num_aves').value;
  if (!capacidad) {
    crearAlert("edit-capacidad", "capacidad", "Debe ingresar la capacidad del galpón")
    setTimeout(() => {
      ocultarAlert("capacidad");
    }, 3000);

    return;
  }
  if (isNaN(capacidad) || capacidad < 0) {
    crearAlert("edit-capacidad", "capacidad", "solo se admiten números positivos")
    setTimeout(() => {
      ocultarAlert("capacidad");
    }, 3000);

    return;
  }
  if (!num_aves) {
    crearAlert("edit-num_aves", "num_aves", "Debe ingresar el numero de aves del galpón")
    setTimeout(() => {
      ocultarAlert("num_aves");
    }, 3000);
    return;
  }
  if (isNaN(num_aves) || num_aves < 0) {
    crearAlert("edit-num_aves", "num_aves", "solo se admiten números positivos")
    setTimeout(() => {
      ocultarAlert("num_aves");
    }, 3000);
    return;
  }
  axios({
    method: 'PUT',
    url: `http://127.0.0.1:3000/actualizar_galpon/${id_galpon}`,
    data: {
      capacidad: capacidad,
      aves: num_aves
    },
    // headers: {
    //     'Content-Type': 'application/json',
    //     // 'Authorization': `Bearer ${token}`
    //   }
  })
    .then(function (response) {
      Swal.fire({
        title: "Exito",
        text: "Galpon actualizado correctamente",
        icon: "success"
      });
      cargarGalpones();
    })
    .catch(err => {
      Swal.fire({
        title: "Error",
        text: "Ocurrio un error al actualizar",
        icon: "error"
      });
      console.log('Error: ', err)

    });
}
const buscarUsuarioEdit = async () => {

  const busqueda = inputEditBuscar.value.trim();
  console.log(busqueda)
  // / Mostrar el spinner
  const spinner = document.getElementById("spinner-edit"); // Asegúrate de que el spinner tenga este ID
  spinner.classList.remove("d-none"); // Muestra el spinner
  // Ocultar la tabla antes de la búsqueda
  const tablaBuscar = document.getElementById('div-edit-buscar');
  tablaBuscar.classList.add("collapse"); // Oculta la tabla

  try {
    const response = await axios.get(`http://127.0.0.1:3000/buscar_usuario_tb/${busqueda}`);
    const userData = response.data;

    if (userData.informacion === 'Usuario no encontrado') {
      alert('Usuario no encontrado');
    } else {
      console.log(userData);

      // Display the search results in the table
      const tablaBuscar = document.getElementById('div-edit-buscar');
      const tbody = tablaBuscar.querySelector('tbody');
      tbody.innerHTML = '';

      userData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id_usuario}</td>
          <td>${user.nombres}</td>
          <td>${user.apellidos}</td>                
          <td><a onclick="editSeleccionar(this)" class="btn btn-success">Seleccionar</a> </td>
        `;
        tbody.appendChild(row);
      });
      initDataTable("#tabla-edit-buscar", dataTableOptionsTablaEditBuscar);

      // tablaBuscar.classList.remove("collapse")
    }
  } catch (error) {
    console.error(error);
    alert('Error al buscar usuario');
  } finally {
    // Ocultar el spinner después de un retraso
    setTimeout(() => {
      spinner.classList.add("d-none"); // Oculta el spinner
      tablaBuscar.classList.remove("collapse"); // Muestra la tabla
    }, 300);
  };
}

const buscarUsuario = async () => {
  const busqueda = inputBuscar.value.trim();

  console.log(busqueda);
  if (!busqueda) {
    document.getElementById("alertusuario").innerHTML = "Por favor, seleccione un usuario"
    document.getElementById("alertusuario").classList.remove("d-none")
  } else {

    // Mostrar el spinner
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("d-none"); // Muestra el spinner


    // Ocultar la tabla antes de la búsqueda
    let tablaBuscardiv = document.getElementById("cont-tabla");
    tablaBuscardiv.classList.add("collapse"); // Oculta la tabla

    try {
      // Cambia la URL aquí
      const response = await axios.get(`http://127.0.0.1:3000/buscar_usuario_tb/${busqueda}`);
      const userData = response.data;
      console.log(userData);

      if (userData.informacion === 'Usuario no encontrado') {
        alert('Usuario no encontrado');
      } else {
        console.log(userData);

        // Mostrar los resultados de búsqueda en la tabla
        const tablaBuscar = document.getElementById('tabla-buscar');
        const tbody = tablaBuscar.querySelector('tbody');
        tbody.innerHTML = '';

        userData.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <td>${user.id_usuario}</td>
          <td>${user.nombres}</td>
          <td>${user.apellidos}</td>                
          <td><a onclick="Seleccionar(this)" class="btn btn-success">Seleccionar</a></td>
        `;
          tbody.appendChild(row);
        });

        initDataTable("#tabla-buscar", dataTableOptionsTablaBuscar);
      }
    } catch (error) {
      console.error(error);
      alert('Error al buscar usuario');
    } finally {
      // Ocultar el spinner después de un retraso
      setTimeout(() => {
        spinner.classList.add("d-none"); // Oculta el spinner
        tablaBuscardiv.classList.remove("collapse"); // Muestra la tabla
      }, 300); // Retraso de 1000 ms (1 segundo)
    }
  }
};

const Seleccionar = (elemento) => {
  const fila = elemento.parentNode.parentNode;
  const idUsuario = fila.cells[0].textContent;
  idUsuarioSeleccionado = idUsuario;

  console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
  tablaBuscar.classList.add("collapse")
}
const editSeleccionar = (elemento) => {
  const fila = elemento.parentNode.parentNode;
  const idUsuario = fila.cells[0].textContent;


  idUsuarioSeleccionado = idUsuario;
  console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
  edittablaBuscar.classList.add("collapse")
}

// }
document.addEventListener('DOMContentLoaded', function () {
  cargarUsuarios();
  cargarTareas();
  cargarLote()
  cargarGalpones();
});

const inputBuscar = document.getElementById('buscar');
const inputB = (div_id) => {
  div_id.classList.add("collapse")
}
inputBuscar.addEventListener("click", () => inputB(tablaBuscar));

const btnBuscar = document.getElementById('btn-buscar');

btnBuscar.addEventListener('click', buscarUsuario)

let tablaBuscar = document.getElementById("cont-tabla");

const edit_input_Buscar = document.getElementById('edit-buscar');
let edittablaBuscar = document.getElementById("div-edit-buscar");
edit_input_Buscar.addEventListener("click", () => inputB(edittablaBuscar));
const inputEditBuscar = document.getElementById('edit-buscar');
const btnEditBuscar = document.getElementById('btn-edit-buscar');
btnEditBuscar.addEventListener('click', buscarUsuarioEdit)
// document.getElementById('salir').addEventListener('click', logout);
formAdd.addEventListener("submit", agregarUsuarios);
formTareas.addEventListener("submit", agregarTareas);
formLote.addEventListener("submit", agregarLote);
formGalpon.addEventListener("submit", agregarGalpon);
// DataTables options
let dataTables = {};  // Para almacenar las instancias de DataTables por cada tabla
let dataTableIsInitialized = {};
const dataTableOptions = {
  lengthMenu: [10, 15, 20, 100, 200, 500],
  pageLength: 10,
  destroy: true,
  language: {
    lengthMenu: "Mostrar _MENU_ registros por página",
    zeroRecords: "Ningún usuario encontrado",
    info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
    infoEmpty: "Ningún usuario encontrado",
    infoFiltered: "(filtrados desde _MAX_ registros totales)",
    loadingRecords: "Cargando...",
    paginate: {
      first: "Primero",
      last: "Último",
      next: "Siguiente",
      previous: "Anterior"
    }
  },
  searching: false,
  ordering: false
};

const dataTableOptionsUsuarios = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] }
  ]
};

const dataTableOptionsTareas = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3, 4] }
  ]
};

const dataTableOptionsLote = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3] }
  ]
};

const dataTableOptionsGalpones = {
  ...dataTableOptions,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2] }
  ]
};
const initDataTable = (selector, options) => {
  if (dataTableIsInitialized[selector]) {
    dataTables[selector].destroy();
  }

  dataTables[selector] = $(selector).DataTable(options);
  dataTableIsInitialized[selector] = true;
};
const dataTableOptionsTablaBuscar = {
  ...dataTableOptions,
  searching: false,
  ordering: false,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3] }
  ]
};
const dataTableOptionsTablaEditBuscar = {
  ...dataTableOptions,
  searching: false,
  ordering: false,
  columnDefs: [
    { className: "centered", targets: [0, 1, 2, 3] }
  ]
};

