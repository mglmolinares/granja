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
    if (rol !== "trabajador") {
        window.location.href = "/web/html/login.html";
    }
});
document.addEventListener("DOMContentLoaded", () => {
    Swal.fire({
        position: "top-end",
        title: `Bienvenid@ : ${userInfo.usuario}`,
        html: `<img src="/web/img/hola.gif" alt="custom icon" style="width: 100px; height: 100px;">`, // Imagen personalizada
        showConfirmButton: false,
        timer: 1500
    });
});
let info = document.getElementById("info");

const token = localStorage.getItem("token");

function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Obtener la parte del payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazos para el formato base64
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // Convertir a objeto JSON
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

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    // Redirigir a la página de login
    window.location.href = "/web/html/login.html";
}

var userInfo = parseJwt(token);
info.innerHTML = `Bienvenid@ : ${userInfo.usuario}`;
console.log(userInfo); // Aquí estará la información del usuario (id, rol, etc.)

// Tareas Trabajador
var id_tarea;

var form_huevos = document.getElementById("form-huevos");
const cargarTareas = () => {
    const id_usuario = userInfo.id;
    console.log(id_usuario)
    axios.get(`http://127.0.0.1:3000/obtener_tareas_trabajador/${id_usuario}`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {
            const tabla = $('#taskTable').DataTable(); // Acceder a la tabla DataTable

            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(tarea => {
                let colorClass;
    
                if (tarea.estado === "Completado") {
                    colorClass = "table-success";  // Verde para tareas completadas
                } else if (tarea.estado === "En progreso") {
                    colorClass = "table-warning";  // Amarillo para tareas en progreso
                } else if (tarea.estado === "Pendiente") {
                    colorClass = "table-danger";   // Rojo para tareas pendientes
                }
            
                const rowNode = tabla.row.add([
                    tarea.id_tareas,
                    tarea.descripcion,
                    tarea.fecha_asignacion,
                    tarea.estado,
                    `<a class="btn btn-warning mx-5 bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editEstado(this)"></a>`
                ]).draw(false).node(); // Devuelve el nodo de la fila agregada
                
                // Cambiar la clase de la celda completa según el estado
                $(rowNode).find('td').eq(3).addClass(colorClass); // Aplica la clase de color a la cuarta celda (celda del estado)
            });

        })

        .catch(function (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrio un error al cargar las tareas",
            });
            console.error('Error:', error);
        });
}
const editEstado = (button) => {
    const row = button.parentNode.parentNode;
    id_tarea = row.cells[0].innerText;
    const estado = row.cells[3].innerText;
    document.querySelector('#edit-estado').value = estado;

};

const guardarEstado = () => {
    const estado = document.getElementById('edit-estado').value;

    axios({
        method: 'PUT',
        url: `http://127.0.0.1:3000/actualizar_estado/${id_tarea}`,
        data: {

            estado: estado,

        },
        // headers: {
        //     'Content-Type': 'application/json',
        //     // 'Authorization': `Bearer ${token}`
        //   }
    })
        .then(function (response) {
            Swal.fire({
                icon: "success",
                title: "Exito",
                text: response.data.informacion + '!'
            });


            cargarTareas()
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrio un error al cambiar estado!",
            });
            console.log('Error: ', err)
        });
}
// Lotes
const cargarLotes = () => {
    // const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/obtener_lotes', {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {
            const tabla = $('#tabla-lote').DataTable(); // Acceder a la tabla DataTable
            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(lotes => {
                tabla.row.add([
                    lotes.id_lote,
                    lotes.num_aves,
                    lotes.fecha_ingreso,
                    lotes.id_galpon,
                    `<a class=" btn btn-warning mx-5 bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#modalEditLote" onclick="editLote(this)"></a>`
                ]).draw(false);  // Añadir la fila y redibujar
            });

        })
        .catch(function (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrio un error al cargar los lotes!",

            });
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrio un error al cargar los lotes!",
            });
            console.error('Error:', error);
        });
}
const editLote = (button) => {
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
const guardarLote = () => {

    const id_lote = document.getElementById('edit-id_lote').value;
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
        crearAlert("edit-num_aves_lote", "alert-aves", "Ingrese un numero de aves valido")
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
        crearAlert("edit-id_galpon", "id_gal", "Ingrese un id valido")
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


            cargarLotes();
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
// Huevos
const registroHuevos = (event) => {
    event.preventDefault();
    const cantidad = document.getElementById('cantidad_huevos').value.trim();
    const fecha = document.getElementById('fecha_ingreso').value.trim();
    const idLote = document.getElementById('id_lote').value.trim();
    if (!cantidad) {
        crearAlert("cantidad_huevos", "cant", "Debe ingresar una cantidad de huevos");
        setTimeout(() => {
            ocultarAlert("cant");
        }, 3000);
        return;
    }
    if ( isNaN(cantidad) || cantidad < 0) {
        crearAlert("cantidad_huevos", "cant", "Ingrese una cantidad valida");
        setTimeout(() => {
            ocultarAlert("cant");
        }, 3000);
        return;
    }
    if (!fecha) {
        crearAlert("fecha_ingreso", "Fecha", "Debe ingresar una fecha de ingreso");
        setTimeout(() => {
            ocultarAlert("Fecha");
        }, 3000);
        return;
    }
    if (!idLote) {
        crearAlert("id_lote", "id_lotes", "Debe seleccionar un lote");
        setTimeout(() => {
            ocultarAlert("id_lotes");
        }, 3000);
        return;
    }
    if (isNaN(idLote) || idLote < 0) {
        crearAlert("id_lote", "id_lotes", "Ingrese un id valido");
        setTimeout(() => {
            ocultarAlert("id_lotes");
        }, 3000);
        return;
    }
    


    axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/agregar_huevos',
        data: {
            cantidad: cantidad,
            fecha: fecha,
            id_lote: idLote
        },
    }
    ).then(function (response) {
        Swal.fire({
            icon: "success",
            title: "Exito",
            text: "Registro exitoso!",
        });
        cargarHuevos()
        form_huevos.reset();
    }).catch(err => {
        console.log('Error: ', err)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurrio un error al registrar!",
        });
    })
}
const cargarHuevos = () => {
    // const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/obtener_huevos', {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {
            const tabla = $('#tabla-huevos').DataTable(); // Acceder a la tabla DataTable
            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(huevos => {
                tabla.row.add([
                    huevos.id_recoleccion,
                    huevos.cantidad,
                    huevos.fecha,
                    huevos.id_lote,
                ]).draw(false);  // Añadir la fila y redibujar
            });


            initDataTable("#tabla-huevos", dataTableOptionsHuevos)

        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}
// const editHuevos = (button) => {
//     const row = button.parentNode.parentNode;
//     const id_galpon = row.cells[0].innerText;
//     const capacidad = row.cells[1].innerText;
//     const num_aves = row.cells[2].innerText;

//     document.getElementById('edit-idgalpon').value = id_galpon;
//     document.getElementById('edit-capacidad').value = capacidad;
//     document.getElementById('edit-num_aves').value = num_aves;

// }
// const guardarHuevos = () => {

//     const id_galpon = document.getElementById('edit-idgalpon').value;
//     const capacidad = document.getElementById('edit-capacidad').value;
//     const num_aves = document.getElementById('edit-num_aves').value;

//     axios({
//         method: 'PUT',
//         url: `http://127.0.0.1:3000/editar_galpon/${id_galpon}`,
//         data: {

//             capacidad: capacidad,
//             aves: num_aves

//         },
//         // headers: {
//         //     'Content-Type': 'application/json',
//         //     // 'Authorization': `Bearer ${token}`
//         //   }
//     })
//         .then(function (response) {
//             alert(response.data.informacion);

//             cargarGalpones()
//         })
//         .catch(err => console.log('Error: ', err));
// }
// Galpones
const cargarGalpones = () => {
    // const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/obtener_galpones', {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    })
        .then(function (response) {

            const tabla = $('#tabla-galpones').DataTable(); // Acceder a la tabla DataTable
            tabla.clear(); // Limpiar las filas actuales de DataTables

            response.data.forEach(galpon => {
                tabla.row.add([
                    galpon.id_galpon,
                    galpon.capacidad,
                    galpon.aves,
                    `<a class=" btn btn-warning mx-5 bi bi-pencil-square" data-bs-toggle="modal" data-bs-target="#modalEditGalpon" onclick="editGalpon(this)"></a>`
                ]).draw(false);  // Añadir la fila y redibujar
            });

        })
        .catch(function (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al cargar los galpones",
                
            });
            console.error('Error al cargar galpones:', error);
            
        });
}
const editGalpon = (button) => {
    const row = button.parentNode.parentNode;
    const id_galpon = row.cells[0].innerText;
    const capacidad = row.cells[1].innerText;
    const num_aves = row.cells[2].innerText;

    document.getElementById('edit-idgalpon').value = id_galpon;
    document.getElementById('edit-capacidad').value = capacidad;
    document.getElementById('edit-num_aves').value = num_aves;

}
const guardarGalpon = () => {

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
        crearAlert("edit-capacidad", "capacidad", "ingrese una cantidad valida")
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
        crearAlert("edit-num_aves", "num_aves", "ingrese un numero de aves valido")
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
                text: "Galpon actualizado correctamente!",
                icon: "success"
            })

            cargarGalpones()
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

document.addEventListener('DOMContentLoaded', function () {
    cargarTareas();
    cargarLotes();
    cargarHuevos();
    cargarGalpones();
});

form_huevos.addEventListener("submit", registroHuevos);

// Datatables
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
// Opciones personalizadas para cada tabla
const dataTableOptionsLotes = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] },
        { orderable: false, targets: [4] },
        { searchable: false, targets: [1] }
    ]
};

const dataTableOptionsTareas = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] },
        { orderable: false, targets: [4] },
        { searchable: false, targets: [1] }
    ]
};

const dataTableOptionsGalpones = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3] },
        { orderable: false, targets: [3] },
        { searchable: false, targets: [1] }
    ]
};

const dataTableOptionsHuevos = {
    ...dataTableOptions,
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3] },
        { orderable: false, targets: [3] },
        { searchable: false, targets: [1] }
    ]
};

const initDataTable = (selector, options) => {
    if (dataTableIsInitialized[selector]) {
        dataTables[selector].destroy();
    }

    dataTables[selector] = $(selector).DataTable(options);
    dataTableIsInitialized[selector] = true;
};

