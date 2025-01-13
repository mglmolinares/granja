console.log("hola")
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (!token) {
        // Si no hay token, redirige al login
        window.location.href = "/web/html/login.html";
        return;
    }

    // Verifica si el rol es el de veterinario
    if (rol !== "veterinario") {
        window.location.href = "/web/html/login.html";
    }
});

const token = localStorage.getItem("token")
function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Obtener la parte del payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazos para el formato base64
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // Convertir a objeto JSON
}
const userInfo = parseJwt(token);
console.log(userInfo); // Aquí estará la información del usuario (id, rol, etc.)
let info = document.getElementById("info")
info.innerHTML = `Bienvenid@ : ${userInfo.usuario}`
var idUsuarioSeleccionado = null;
var formReporte = document.getElementById("form-reportes")
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    // Redirigir a la página de login
    window.location.href = "/web/html/login.html";
}
document.addEventListener("DOMContentLoaded", () => {
    Swal.fire({
        position: "top-end",
        title: `Bienvenid@ : ${userInfo.usuario}`,
        html: `<img src="/web/img/hola.gif" alt="custom icon" style="width: 100px; height: 100px;">`, // Imagen personalizada
        showConfirmButton: false,
        timer: 1500
    });
});
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
    newDiv.classList.add('alert', 'alert-danger', 'text-center', "col-12");

    // Agrega un ID al nuevo div
    newDiv.setAttribute('id', id);

    // Inserta el nuevo div como primer hijo del div padre, antes del label e input
    parentDiv.insertBefore(newDiv, parentDiv.firstChild);
}
const ocultarAlert = (id) => {
    let elemento = document.getElementById(id);
    elemento.classList.add("d-none");
}
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

const agregarReporte = (event) => {
    event.preventDefault();
    const id_usuario = parseInt(idUsuarioSeleccionado);
    const fecha_registro = document.getElementById('fecha-registro').value.trim();
    const id_lote = document.getElementById('id-lote').value.trim();
    const estado_general = document.getElementById('estado-general').value.trim();
    const diagnostico = document.getElementById('diagnostico').value.trim();
    const tratamiento_prescrito = document.getElementById('t-prescrito').value.trim();
    const dosis = document.getElementById('dosis').value.trim();
    const frecuencia = document.getElementById('frecuencia-tratamiento').value.trim();
    const fecha_inicio_tratamiento = document.getElementById('fecha-inicio-tratamiento').value.trim();
    const fecha_fin_tratamiento = document.getElementById('fecha-fin-tratamiento').value.trim();
    // // Verificar que los campos estén completos
    // if (!id_usuario || !fecha_registro || !id_lote || !estado_general || !diagnostico || !tratamiento_prescrito || !dosis || !frecuencia || !fecha_inicio_tratamiento || !fecha_fin_tratamiento) {
    //     // alert('');
    //     return;
    // }

    // // Verificar que el ID del usuario sea válido
    // if (isNaN(id_usuario) || id_usuario < 0) {
    //     crearAlert("buscar","id_user","El ID del usuario es inválido")
    //     setTimeout(() => {
    //         ocultarAlert("id_user");
    //     }, 3000);
    //     return;
    // }

    // // Verificar que las fechas sean válidas
    // const fechaInicio = new Date(fecha_inicio_tratamiento);
    // const fechaFin = new Date(fecha_fin_tratamiento);
    // if (isNaN(fechaInicio) || isNaN(fechaFin) || fechaInicio > fechaFin) {
    //     crearAlert("fecha-registro","alert","Las fechas de inicio y fin de tratamiento son inválidas")
    //     setTimeout(() => {
    //         ocultarAlert("alert");
    //     }, 3000);
    //     return;
    // }
    // Expresiones regulares
    // const regexSoloLetras = /^[a-zA-Z]*$/; // Sin letras
    const regexSinLetras = /^[^a-zA-Z]*$/; // Sin letras
    const regexSinNumeros = /^[^0-9]*$/; // Sin números
    const regexSinCaracteres = /^[^!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~]*$/; // Sin caracteres especiales

    // Validar campos
    if (!id_usuario) {
        crearAlert("buscar", "alert", "Debes seleccionar un usuario")
        setTimeout(() => {
            ocultarAlert("alert");
        }, 3000);
        return;
    }

    if (!fecha_registro) {
        crearAlert('fecha-registro', 'alert-fecha-registro', 'Debe completar la fecha de registro.');
        setTimeout(() => {
            ocultarAlert("alert-fecha-registro");
        }, 3000);
        return;
    }
    if (!id_lote) {
        crearAlert('id-lote', 'alert-id-lote', 'Debe completar el id del lote.');
        setTimeout(() => {
            ocultarAlert("alert-id-lote");
        }, 3000);
        return;
    }
    if (!estado_general) {
        crearAlert('estado-general', 'alert-estado-general', 'Debe completar el estado general.');
        setTimeout(() => {
            ocultarAlert("alert-estado-general");
        }, 3000);
        return;
    }
    if (!diagnostico) {
        crearAlert('diagnostico', 'alert-diagnostico', 'Debe completar el diagnostico.');
        setTimeout(() => {
            ocultarAlert("alert-diagnostico");
        }, 3000);
        return;
    }
    if (!tratamiento_prescrito) {
        crearAlert('t-prescrito', 'alert-t-prescrito', 'Debe completar el tratamiento prescrito.');
        setTimeout(() => {
            ocultarAlert("alert-t-prescrito");
        }, 3000);
        return;
    }
    if (!dosis) {
        crearAlert('dosis', 'alert-dosis', 'Debe completar la dosis.');
        setTimeout(() => {
            ocultarAlert("alert-dosis");
        }, 3000);
        return;
    }
    if (!frecuencia) {
        crearAlert('frecuencia-tratamiento', 'alert-frecuencia', 'Debe completar la frecuencia.');
        setTimeout(() => {
            ocultarAlert("alert-frecuencia");
        }, 3000);
        return;
    }
    if (!fecha_inicio_tratamiento) {
        crearAlert('fecha-inicio-tratamiento', 'alert-fecha-inicio', 'Debe completar la fecha de inicio del tratamiento.');
        setTimeout(() => {
            ocultarAlert("alert-fecha-inicio");
        }, 3000);
        return;
    }
    if (!fecha_fin_tratamiento) {
        crearAlert('fecha-fin-tratamiento', 'alert-fecha-fin', 'Debe completar la fecha de fin del tratamiento.');
        setTimeout(() => {
            ocultarAlert("alert-fecha-fin");
        }, 3000);
        return;
    }
    if (!regexSinLetras.test(id_lote)) {
        crearAlert('id-lote', 'alert-id-lote', 'ID de lote inválido. No se permiten letras ni caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-id-lote");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(estado_general)) {
        crearAlert('estado-general', 'alert-estado-general', 'Estado general inválido. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-estado-general");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(diagnostico)) {
        crearAlert('diagnostico', 'alert-diagnostico', 'Diagnóstico inválido. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-diagnostico");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(tratamiento_prescrito)) {
        crearAlert('t-prescrito', 'alert-tratamiento-prescrito', 'Tratamiento prescrito inválido. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-tratamiento-prescrito");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(dosis)) {
        crearAlert('dosis', 'alert-dosis', ' No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-dosis");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(frecuencia)) {
        crearAlert('frecuencia-tratamiento', 'alert-frecuencia', 'Frecuencia inválida. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-frecuencia");
        }, 3000);
        return;
    }

    let data = {
        id_usuario: idUsuarioSeleccionado,
        fecha_registro: fecha_registro,
        id_lote: id_lote,
        estado_general: estado_general,
        diagnostico: diagnostico,
        tratamiento_prescrito: tratamiento_prescrito,
        dosis: dosis,
        frecuencia_tratamiento: frecuencia,
        fecha_inicio_tratamiento: fecha_inicio_tratamiento,
        fecha_fin_tratamiento: fecha_fin_tratamiento
    }
    axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/crear_reporte',
        data,
    }).then(function (response) {
        Swal.fire({
            title: "Reporte creado con éxito!",
            icon: "success"
        });
        formReporte.reset()
        cargarReportes();
    }).catch(err => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurrio un error al crear reporte!",
        });
        console.log('Error: ', err)

    })

}
const cargarReportes = () => {
    axios({
        method: 'GET',
        url: 'http://127.0.0.1:3000/obtener_reportes',
    }).then(function (response) {
        // Check if the DataTable is already initialized
        let tabla;
        if ($.fn.dataTable.isDataTable('#tabla-reportes')) {
            tabla = $('#tabla-reportes').DataTable();
            tabla.clear(); // Clear existing data
        } else {
            // Initialize DataTable if not already initialized
            tabla = $('#tabla-reportes').DataTable({
                // Your DataTable options here
                lengthMenu: [5, 10, 15, 20, 100, 200, 500],
                columnDefs: [
                    { className: "centered", targets: [0, 1, 2, 3, 4] },
                    { orderable: false, targets: [4] },
                    { searchable: false, targets: [1] }
                ],
                pageLength: 10,
                language: {
                    lengthMenu: "Mostrar _MENU_ registros por página",
                    zeroRecords: "Ningún usuario encontrado",
                    info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
                    infoEmpty: "Ningún usuario encontrado",
                    infoFiltered: "(filtrados desde _MAX_ registros totales)",
                    search: "Buscar:",
                    loadingRecords: "Cargando...",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    }
                }
            });
        }

        // Verifica si response.data es un array

        // let data = response.data;
        console.log(response.data)

        // Recorre el array de datos
        response.data.forEach(item => {
            // Formatear la fecha en "YYYY-MM-DD"
            // const fechaRegistro = new Date(item.fecha_registro).toISOString().split('T')[0];

            // Agrega los datos a la tabla
            tabla.row.add([
                item.id_reporte,  // primer elemento
                item.id_lote,     // segundo elemento
                item.fecha_registro,    // fecha formateada
                item.nombres,      // cuarto elemento
                `<a class="bi bi-pencil-square btn btn-warning mx-5" data-bs-toggle="modal" data-bs-target="#editModal" onClick="editReportes(this)"></a>`
            ]).draw(); // Agregar la fila y actualizar la tabla
        });


    }).catch(err => console.log('Error: ', err));
}


const editReportes = (button) => {
    const row = button.parentNode.parentNode;
    const id = row.cells[0].innerText;
    const nombre = row.cells[3].innerText;

    // Llamada a Axios para obtener el reporte
    axios.get(`http://127.0.0.1:3000/obtener_reporte/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            const report = response.data;

            // Asignar los valores del reporte a los campos del formulario
            document.getElementById('edit-id-reporte').value = report.id_reporte;
            // document.getElementById('edit-id-usuario').value = report.id_usuario;
            document.getElementById('edit-buscar').value = nombre;
            document.getElementById('edit-fecha-registro').value = report.fecha_registro;
            document.getElementById('edit-id-lote').value = report.id_lote;
            document.getElementById('edit-estado-general').value = report.estado_general;
            document.getElementById('edit-diagnostico').value = report.diagnostico;
            document.getElementById('edit-t-prescrito').value = report.tratamiento_prescrito;
            document.getElementById('edit-dosis').value = report.dosis;
            document.getElementById('edit-frecuencia-tratamiento').value = report.frecuencia_tratamiento;
            document.getElementById('edit-fecha-inicio-tratamiento').value = report.fecha_inicio_tratamiento;
            document.getElementById('edit-fecha-fin-tratamiento').value = report.fecha_fin_tratamiento;

            console.log(report);

            // Cargar reportes después de obtener los datos
            cargarReportes();
        })
        .catch(err => {
            console.log('Error: ', err);
            alert('Ocurrió un error al obtener los datos del reporte');
        });
}

const guardarCambiosReportes = () => {
    const id_reporte = document.getElementById('edit-id-reporte').value;
    const id_usuario = idUsuarioSeleccionado;
    const fecha_registro = document.getElementById('edit-fecha-registro').value;
    const id_lote = document.getElementById('edit-id-lote').value;
    const estado_general = document.getElementById('edit-estado-general').value;
    const diagnostico = document.getElementById('edit-diagnostico').value;
    const tratamiento_prescrito = document.getElementById('edit-t-prescrito').value;
    const dosis = document.getElementById('edit-dosis').value;
    const frecuencia_tratamiento = document.getElementById('edit-frecuencia-tratamiento').value;
    const fecha_inicio_tratamiento = document.getElementById('edit-fecha-inicio-tratamiento').value;
    const fecha_fin_tratamiento = document.getElementById('edit-fecha-fin-tratamiento').value;
    const regexSinLetras = /^[^a-zA-Z]*$/; // Sin letras
    const regexSinNumeros = /^[^0-9]*$/; // Sin números
    const regexSinCaracteres = /^[^!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~]*$/; // Sin caracteres especiales

    // Validar campos
    if (!id_usuario) {
        crearAlert("edit-buscar", "alert", "Debes seleccionar un usuario")
        setTimeout(() => {
            ocultarAlert("alert");
        }, 3000);
        return;
    }

    if (!fecha_registro) {
        crearAlert('edit-fecha-registro', 'alert-fecha-registro', 'Debe completar la fecha de registro.');
        setTimeout(() => {
            ocultarAlert("alert-fecha-registro");
        }, 3000);
        return;
    }
    if (!id_lote) {
        crearAlert('edit-id-lote', 'alert-id-lote', 'Debe completar el id del lote.');
        setTimeout(() => {
            ocultarAlert("alert-id-lote");
        }, 3000);
        return;
    }
    if (!estado_general) {
        crearAlert('edit-estado-general', 'alert-estado-general', 'Debe completar el estado general.');
        setTimeout(() => {
            ocultarAlert("alert-estado-general");
        }, 3000);
        return;
    }
    if (!diagnostico) {
        crearAlert('edit-diagnostico', 'alert-diagnostico', 'Debe completar el diagnostico.');
        setTimeout(() => {
            ocultarAlert("alert-diagnostico");
        }, 3000);
        return;
    }
    if (!tratamiento_prescrito) {
        crearAlert('edit-t-prescrito', 'alert-t-prescrito', 'Debe completar el tratamiento prescrito.');
        setTimeout(() => {
            ocultarAlert("alert-t-prescrito");
        }, 3000);
        return;
    }
    if (!dosis) {
        crearAlert('edit-dosis', 'alert-dosis', 'Debe completar la dosis.');
        setTimeout(() => {
            ocultarAlert("alert-dosis");
        }, 3000);
        return;
    }
    if (!frecuencia_tratamiento) {
        crearAlert('edit-frecuencia-tratamiento', 'alert-frecuencia', 'Debe completar la frecuencia.');
        setTimeout(() => {
            ocultarAlert("alert-frecuencia");
        }, 3000);
        return;
    }
    if (!fecha_inicio_tratamiento) {
        crearAlert('edit-fecha-inicio-tratamiento', 'alert-fecha-inicio', 'Debe completar la fecha de inicio del tratamiento.');
        setTimeout(() => {
            ocultarAlert("alert-fecha-inicio");
        }, 3000);
        return;
    }
    if (!fecha_fin_tratamiento) {
        crearAlert('edit-fecha-fin-tratamiento', 'alert-fecha-fin', 'Debe completar la fecha de fin del tratamiento.');
        setTimeout(() => {
            ocultarAlert("alert-fecha-fin");
        }, 3000);
        return;
    }
    if (!regexSinLetras.test(id_lote)) {
        crearAlert('id-lote', 'alert-id-lote', 'ID de lote inválido. No se permiten letras ni caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-id-lote");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(estado_general)) {
        crearAlert('edit-estado-general', 'alert-estado-general', 'Estado general inválido. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-estado-general");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(diagnostico)) {
        crearAlert('edit-diagnostico', 'alert-diagnostico', 'Diagnóstico inválido. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-diagnostico");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(tratamiento_prescrito)) {
        crearAlert('edit-t-prescrito', 'alert-tratamiento-prescrito', 'Tratamiento prescrito inválido. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-tratamiento-prescrito");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(dosis)) {
        crearAlert('edit-dosis', 'alert-dosis', ' No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-dosis");
        }, 3000);
        return;
    }
    if (!regexSinCaracteres.test(frecuencia_tratamiento)) {
        crearAlert('edit-frecuencia-tratamiento', 'alert-frecuencia', 'Frecuencia inválida. No se permiten caracteres especiales.');
        setTimeout(() => {
            ocultarAlert("alert-frecuencia");
        }, 3000);
        return;
    }
    let data = {
        id_usuario: id_usuario,
        fecha_registro: fecha_registro,
        id_lote: id_lote,
        estado_general: estado_general,
        diagnostico: diagnostico,
        tratamiento_prescrito: tratamiento_prescrito,
        dosis: dosis,
        frecuencia_tratamiento: frecuencia_tratamiento,
        fecha_inicio_tratamiento: fecha_inicio_tratamiento,
        fecha_fin_tratamiento: fecha_fin_tratamiento
    }
    console.log(data)
    axios({
        method: 'PUT',
        url: `http://127.0.0.1:3000/editar_reporte/${id_reporte}`,
        data,
        // headers: {
        //     'Content-Type': 'application/json',
        //     // 'Authorization': `Bearer ${token}`
        //   }
    })
        .then(function (response) {
            Swal.fire({
                title: "Reporte actualizado correctamente!",
                icon: "success"
            });

            cargarReportes()
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrio un error al actualizar!",
            });
            console.log('Error: ', err)
        })
}
const inputBuscar = document.getElementById('buscar');
const btnBuscar = document.getElementById('btn-buscar');
const inputEditBuscar = document.getElementById('edit-buscar');
const btnEditBuscar = document.getElementById('btn-edit-buscar');
const divBuscar = document.getElementById("div-buscar");
const divEditBuscar = document.getElementById("editDivBuscar");
const inputB = (div_id) => {
    div_id.classList.add("collapse")
}

inputBuscar.addEventListener("click", () => inputB(divBuscar));
inputEditBuscar.addEventListener("click", () => inputB(divEditBuscar));


btnEditBuscar.addEventListener('click', async () => {
    const busqueda = inputEditBuscar.value.trim();

    try {
        const response = await axios.get(`http://127.0.0.1:3000/buscar_usuario_vt/${busqueda}`);
        const userData = response.data;

        if (userData.informacion === 'Usuario no encontrado') {
            alert('Usuario no encontrado');
        } else {
            console.log(userData);

            const tablaBuscar = document.getElementById('tabla-edit-buscar');
            const tbody = tablaBuscar.querySelector('tbody');
            tbody.innerHTML = '';

            const row = document.createElement('tr');
            row.innerHTML = `
          <td>${userData[0].id_usuario}</td>
          <td>${userData[0].nombres}</td>
          <td>${userData[0].apellidos}</td>                
          <td><a onclick="editSeleccionar(this)" class="btn btn-success">Seleccionar</a> </td>
        `;
            tbody.appendChild(row);
            divEditBuscar.classList.remove("collapse")
        }
    } catch (error) {
        console.error(error);
        alert('Usuario no encontrado');
    }
});
btnBuscar.addEventListener('click', async () => {
    const busqueda = inputBuscar.value.trim();

    try {
        const response = await axios.get(`http://127.0.0.1:3000/buscar_usuario_vt/${busqueda}`);
        const userData = response.data;

        if (userData.informacion === 'Usuario no encontrado') {
            alert('Usuario no encontrado');
        } else {
            console.log("este es el usuario :", userData);

            // Display the search result in the table
            const tablaBuscar = document.getElementById('tabla-buscar');
            const tbody = tablaBuscar.querySelector('tbody');
            tbody.innerHTML = '';

            // Crear una fila para el usuario devuelto
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData[0].id_usuario}</td>
                <td>${userData[0].nombres}</td>
                <td>${userData[0].apellidos}</td>                
                <td><a onclick="Seleccionar(this)" class="btn btn-success">Seleccionar</a></td>
            `;
            tbody.appendChild(row);

            divBuscar.classList.remove("collapse");
        }
    } catch (error) {
        console.error(error);
        alert('Usuario no encontrado');
    }
});


const Seleccionar = (elemento) => {
    const fila = elemento.parentNode.parentNode;
    const idUsuario = fila.cells[0].textContent;
    idUsuarioSeleccionado = idUsuario;

    console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
    divBuscar.classList.add("collapse")
}
const editSeleccionar = (elemento) => {
    const fila = elemento.parentNode.parentNode;
    const idUsuario = fila.cells[0].textContent;


    // document.getElementById('edit-id-usuario').value = idUsuario;
    idUsuarioSeleccionado = idUsuario;
    console.log('ID de usuario seleccionado:', idUsuarioSeleccionado);
    // tablaEditBuscar.classList.add("collapse")
    divEditBuscar.classList.add("collapse")

}
document.addEventListener('DOMContentLoaded', function () {
    cargarReportes();
});


formReporte.addEventListener("submit", agregarReporte)
let dataTables = {};  // Para almacenar las instancias de DataTables por cada tabla
let dataTableIsInitialized = {};
// Configuracion
const dataTableOptions = {
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] },
        { orderable: false, targets: [5, 6] },
        { searchable: false, targets: [1] }
    ],
    pageLength: 10,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};
const initDataTable = (selector, options) => {
    if (dataTableIsInitialized[selector]) {
        dataTables[selector].destroy();
    }

    dataTables[selector] = $(selector).DataTable(options);
    dataTableIsInitialized[selector] = true;
};
const dataTableOptionsReportes = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] },
        { orderable: false, targets: [4] },
        { searchable: false, targets: [1] }
    ]
};
$(document).ready(function () {
    const tabla = $('#tabla-reportes').DataTable({
        dom: 'Bfrtip', // Esto es necesario para mostrar los botones
        buttons: [
            {
                extend: 'copy',
                text: '<i class="fas fa-copy"></i>', // Ícono para "Copy"
                titleAttr: 'Copiar',
                className: 'btn btn-primary btn-icon' // Clase personalizada
            },
            {
                extend: 'csv',
                text: '<i class="fas fa-file-csv"></i>', // Ícono para "CSV"
                titleAttr: 'Exportar a CSV',
                className: 'btn btn-success btn-icon' // Clase personalizada
            },
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i>', // Ícono para "Excel"
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-warning btn-icon' // Clase personalizada
            },
            {
                extend: 'pdf',
                text: '<i class="fas fa-file-pdf"></i>', // Ícono para "PDF"
                titleAttr: 'Exportar a PDF',
                className: 'btn btn-danger btn-icon' // Clase personalizada
            },
            {
                extend: 'print',
                text: '<i class="fas fa-print"></i>', // Ícono para "Print"
                titleAttr: 'Imprimir',
                className: 'btn btn-info btn-icon' // Clase personalizada
            }
        ],
        // Otras opciones de configuración
        lengthMenu: [5, 10, 15, 20, 100, 200, 500],
        columnDefs: [
            { className: "centered", targets: [0, 1, 2, 3, 4] },
            { orderable: false, targets: [4] },
            { searchable: false, targets: [1] }
        ],
        pageLength: 10,
        language: {
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "Ningún usuario encontrado",
            info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Ningún usuario encontrado",
            infoFiltered: "(filtrados desde _MAX_ registros totales)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    });
});
