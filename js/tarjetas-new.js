$(document).ready(function() {
  // Obtener el contenedor de nuevos servicios
  const nuevosAdiestramientoContainer = $('#newAdiestradoresContainer')
  const nuevosGuarderiaContainer = $('#newGuarderiaContainer')
  const nuevosPaseosContainer = $('#newPaseosContainer')
  const nuevosTrasladosContainer = $('#newTrasladosContainer')
  const nuevosVeterinariasContainer = $('#newVeterinariasContainer')
  
  // Obtener los nuevos servicios desde el localstorage
  const serviciosGuardados = localStorage.getItem('nuevosServicios')
  const nuevosServicios = serviciosGuardados ? JSON.parse(serviciosGuardados) : []

  // Cargar y mostrar los nuevos servicios de adiestradores
  cargarYMostrarNuevosServicios('adiestramiento', nuevosAdiestramientoContainer)

  // Cargar y mostrar los nuevos servicios de guarderia
  cargarYMostrarNuevosServicios('guarderia', nuevosGuarderiaContainer)

  // Cargar y mostrar los nuevos servicios de guarderías
  cargarYMostrarNuevosServicios('paseos', nuevosPaseosContainer)

  // Cargar y mostrar los nuevos servicios de traslados
  cargarYMostrarNuevosServicios('traslados', nuevosTrasladosContainer)

  // Cargar y mostrar los nuevos servicios de veterinarias
  cargarYMostrarNuevosServicios('veterinarias', nuevosVeterinariasContainer)

  // Función para cargar y mostrar los nuevos servicios en base a la categoría
function cargarYMostrarNuevosServicios(categoria, container) {
  // Filtrar los servicios por categoría
  const serviciosFiltrados = nuevosServicios.filter(servicio => servicio.categoria === categoria)

  // Limpiar el contenedor antes de agregar las tarjetas
  container.empty()

  // Crear una nueva fila para las tarjetas
  let currentRow = $('<div class="row justify-content-center"></div>')
  container.append(currentRow)

  // Generar las tarjetas de servicios filtrados y agregarlas al contenedor
  serviciosFiltrados.forEach(servicio => {
    const card = $(`
      <div class="col-sm-12 col-md-4 col-lg-4 my-3">
        <!-- Contenido de la tarjeta -->
      </div>
    `)

    // Agregar una clase única a la tarjeta basada en su nombre
    card.addClass('tarjeta-' + servicio.nombre.toLowerCase().replace(/\s/g, '-'))

    // Agregar la tarjeta a la fila actual
    currentRow.append(card)

    // Crear una nueva fila después de cada 3 tarjetas
    if (currentRow.children().length === 3) {
      currentRow = $('<div class="row justify-content-center"></div>')
      container.append(currentRow)
    }
  })

    // Agregar evento de clic a los botones de borrar tarjeta
    container.on('click', '.btn-borrar-tarjeta', function() {
      const tarjeta = $(this).closest('.card')
      const nombreTarjeta = tarjeta.find('.card-title').text().trim().toLowerCase().replace(/\s/g, '-')

      // Utilizar SweetAlert para confirmar la eliminación
      Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la tarjeta. ¿Quieres continuar?',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Eliminar el servicio del array
          const index = nuevosServicios.findIndex(servicio => servicio.nombre.toLowerCase().replace(/\s/g, '-') === nombreTarjeta)
          if (index !== -1) {
            nuevosServicios.splice(index, 1)
      
            // Actualizar el localstorage
            localStorage.setItem('nuevosServicios', JSON.stringify(nuevosServicios))
      
            // Mostrar un Toast de éxito
            toastr.success('Tarjeta eliminada correctamente')
      
            // Recargar la página para mostrar las tarjetas actualizadas
            location.reload()
          }
        }
      })
    })
  }
})