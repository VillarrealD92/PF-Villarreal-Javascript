// Agregar evento de clic al botón de reservar
let nuevosServicios = obtenerServiciosGuardados()

$('.reservar').on('click', function () {
  if (localStorage.getItem('loggedInUser')) {
    const categoria = $(this).data('categoria')
    const reservaContainer = $(this).parent()

    // Utilizar SweetAlert para pedir confirmación antes de reservar
    Swal.fire({
      icon: 'question',
      title: '¿Quieres reservar este servicio?',
      text: 'Se realizará una reserva para este servicio. ¿Deseas continuar?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reservar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        mostrarFormularioReserva(categoria, reservaContainer)
      }
    })
  } else {
    // Utilizar SweetAlert para alertar al usuario sobre iniciar sesión
    Swal.fire({
      icon: 'info',
      title: 'Inicia sesión para reservar',
      text: 'Debes iniciar sesión para realizar una reserva.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    })
  }
})

function obtenerServiciosGuardados() {
  const serviciosGuardados = localStorage.getItem('nuevosServicios')
  return serviciosGuardados ? JSON.parse(serviciosGuardados) : []
}

// Función para mostrar el formulario de reserva
function mostrarFormularioReserva(categoria, reservaContainer) {
  // Crear los elementos del formulario de reserva
  const nombreInput = $('<input type="text" placeholder="Nombre" name="nombre">')
  const formatoInput = $('<input type="text" placeholder="Formato" name="formato">')
  const precioInput = $('<input type="text" placeholder="Precio por hora" name="formato">')
  const submitButton = $('<button class="btn btn-primary">Reservar</button>')

  // Obtener el contenedor del formulario de reserva
  const formularioReserva = $('<div class="formularioReserva"></div>')
  formularioReserva.append(nombreInput, formatoInput, precioInput, submitButton)

  // Agregar evento de clic al botón de reservar (dentro del formulario)
  submitButton.on('click', function (event) {
    event.preventDefault()
    const nombre = nombreInput.val()
    const formato = formatoInput.val()
    const precio = precioInput.val()

    // Verificar que los campos no estén vacíos antes de proceder
    if (nombre.trim() === '' || formato.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Por favor, completa todos los campos antes de reservar.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      })
      return // Detener la ejecución si hay campos vacíos
    }

    // Crear el nuevo servicio 
    const nuevoServicio = {
      id: generateUniqueID(),
      categoria: categoria,
      nombre: nombre,
      formato: formato,
      rating: '1',
      precio: precio,
      imagen: "../multimedia/imagenes/individual/nuevos/nuevo2.webp",
      telefono: "+54 9 11 1234 5678",
      email: "emailinventado@adiestramiento.com"
    }

    // Agregar el nuevo servicio al array de servicios guardados
    nuevosServicios.push(nuevoServicio)

    // Guardar los servicios en el localstorage
    localStorage.setItem('nuevosServicios', JSON.stringify(nuevosServicios))

    // Mostrar mensaje de éxito
    console.log('¡Reserva realizada con éxito!')

    // Limpiar los campos del formulario
    nombreInput.val('')
    formatoInput.val('')

    location.reload()
  })

  // Agregar evento keypress a los campos del formulario
  nombreInput.on('keypress', function (event) {
    if (event.which === 13) {
      event.preventDefault()
      submitButton.trigger('click')
    }
  })

  formatoInput.on('keypress', function (event) {
    if (event.which === 13) {
      event.preventDefault()
      submitButton.trigger('click')
    }
  })

  // Agregar el formulario al contenedor
  reservaContainer.empty()
  reservaContainer.append(formularioReserva)
}

// Agregar evento de clic al botón de eliminar
$('.eliminar').on('click', function () {

  if (!localStorage.getItem('loggedInUser')) {
    Swal.fire({
      icon: 'info',
      title: 'Inicia sesión para eliminar',
      text: 'Debes iniciar sesión para eliminar un servicio.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    })
    return
  }

  const categoria = $(this).data('categoria')
  const serviciosAEliminar = obtenerServiciosPorCategoria(categoria)

  if (serviciosAEliminar.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'No hay servicios para eliminar',
      text: 'No existen servicios con la categoría seleccionada para eliminar.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    })
    return
  }

  Swal.fire({
    icon: 'question',
    title: '¿Quieres eliminar estos servicios?',
    html: `Se eliminarán los siguientes servicios:<ul>${obtenerListaServiciosHTML(serviciosAEliminar)}</ul>¿Deseas continuar?`,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarServiciosPorCategoria(categoria)
    }
  })
})
function obtenerServiciosPorCategoria(categoria) {
  return nuevosServicios.filter(servicio => servicio.categoria === categoria)
}

function obtenerListaServiciosHTML(servicios) {
  let listaHTML = ''
  servicios.forEach(servicio => {
    listaHTML += `<li>${servicio.nombre}</li>`
  })
  return listaHTML
}

function eliminarServiciosPorCategoria(categoria) {
  nuevosServicios = nuevosServicios.filter(servicio => servicio.categoria !== categoria)
  localStorage.setItem('nuevosServicios', JSON.stringify(nuevosServicios))
  Swal.fire({
    icon: 'success',
    title: 'Servicios eliminados',
    text: 'Los servicios han sido eliminados de la lista.',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Aceptar'
  }).then(() => {
    location.reload()
  })
}
// Función para obtener la imagen según la categoría
function obtenerImagenSegunCategoria(categoria) {
  // Cargar el archivo servicios.json localmente mediante fetch
  return fetch('../servicios.json')
    .then(response => response.json())
    .then(data => {
      // Encontrar el servicio con la categoría especificada
      const servicio = data.find(item => item.categoria === categoria)
      if (servicio) {
        // Retornar la imagen del servicio encontrado
        return servicio.imagen
      } else {
        // Manejar el caso si la categoría no está presente en servicios.json
        console.log('Categoría no encontrada en servicios.json')
      }
    })
    .catch(error => {
      console.error('Error al cargar servicios.json', error)
    })
}

// Función para generar un ID único para el nuevo servicio
function generateUniqueID() {
  return Math.floor(Math.random() * 1000)
}