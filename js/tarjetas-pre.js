$(document).ready(function () {
  // Obtener el contenedor de adiestradores, guarderias, paseos, traslados, veterinarias
  const adiestradoresContainer = $('#adiestradoresContainer')
  const guarderiaContainer = $('#guarderiaContainer')
  const paseosContainer = $('#paseosContainer')
  const trasladosContainer = $('#trasladosContainer')
  const veterinariasContainer = $('#veterinariasContainer')

  // Cargar y mostrar los servicios 
  cargarYMostrarServicios('adiestramiento', adiestradoresContainer)
  cargarYMostrarServicios('guarderia', guarderiaContainer)
  cargarYMostrarServicios('paseos', paseosContainer)
  cargarYMostrarServicios('traslados', trasladosContainer)
  cargarYMostrarServicios('veterinarias', veterinariasContainer)

  // Función para cargar y mostrar los servicios en base a la categoría 
  function cargarYMostrarServicios(categoria, container) {
    // Restablecer el contador de tarjetas agregadas
    let contadorTarjetas = 0

    
    $.getJSON('../servicios.json')
      .then(function (servicios) {
        // Filtrar los servicios por categoría
        const serviciosFiltrados = servicios.filter(servicio => servicio.categoria === categoria)



        // Generar las tarjetas de servicios originales y agregarlas al contenedor
        serviciosFiltrados.forEach((servicio, index) => {
          // Crear una nueva row cada 3 tarjetas
          if (index % 3 === 0) {
            const row = $('<div class="row justify-content-center"></div>')
            container.append(row)
          }

          // Obtener la última row creada
          const lastRow = container.children().last()

          // Crear la tarjeta y agregarla a la última row
          const card = $(`
            <div class="col-sm-12 col-md-8 col-lg-3 my-2">
              <div class="card">
                <img src="${servicio.imagen}" alt="${servicio.nombre}" class="card-img-top">
                <div class="card-body">
                  <div class="text-center">
                    <h3 class="card-title">${servicio.nombre}</h3>
                    <p>${servicio.formato}</p>
                    <p>hora: ${servicio.precio} Ars</p>
                    <p>Rating: ${generateStars(servicio.rating)}</p>
                    <button type="button" class="btn btn-info btn-info-contacto">Info >></button>
                  </div>
                </div>
              </div>
            </div>
          `)

          // Agregar evento click al botón "Info >>"
          const btnInfoContacto = card.find('.btn-info-contacto')
          btnInfoContacto.on('click', function () {
            mostrarInfoContacto(servicio)
          })


          lastRow.append(card)

          contadorTarjetas++
        })

        // Filtrar los servicios con mayor rating (destacados)
        const destacados = serviciosFiltrados.filter(servicio => servicio.rating === '5')

        // Obtener el contenedor de destacados
        const destacadosContainer = $(`.destacados${categoria.charAt(0).toUpperCase() + categoria.slice(1)} .row`)

        // Crear la row para las tarjetas de destacados
        const destacadosRow = $('<div class="row justify-content-center"></div>')

        // Agregar las tarjetas de destacados a la row
        destacados.forEach(servicio => {
          const card = $(`
            <article class="col-sm-12 col-md-8 col-lg-5 my-1">
              <div class="card mb-3">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img src="${servicio.imagen}" class="img-fluid rounded-start" alt="${servicio.nombre}">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body d-flex flex-column align-items-center justify-content-center">
                      <h3 class="card-title">${servicio.nombre}</h3>
                      <p class="card-text">${servicio.formato}</p>
                      <p>Rating: ${generateStars(servicio.rating)}</p>
                      
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `)

          

          destacadosRow.append(card)
        })

        // Agregar la row de destacados al contenedor de destacados
        destacadosContainer.html(destacadosRow)

        // Mostrar las tarjetas paginadas
        const tarjetas = container.find('.card')
        const tarjetasPorPagina = 6
        mostrarPagina(tarjetas, 1, tarjetasPorPagina)

        // Crear y mostrar la barra de paginación
        const numPaginas = Math.ceil(contadorTarjetas / tarjetasPorPagina)
        const paginacionContainer = $('<div class="d-flex justify-content-center py-4"></div>')
        const paginacion = $('<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups"></div>')

        for (let i = 1; i <= numPaginas; i++) {
          const grupoBtn = $('<div class="btn-group me-2" role="group" aria-label="Grupo de botones"></div>')
          const boton = $(`<button type="button" class="btn btn-primary">${i}</button>`)
          grupoBtn.append(boton)
          paginacion.append(grupoBtn)
        }

        paginacionContainer.append(paginacion)
        container.after(paginacionContainer)

        // Agregar el evento click a los botones de paginación
        paginacion.find('.btn').on('click', function () {
          const pagina = parseInt($(this).text())
          mostrarPagina(tarjetas, pagina, tarjetasPorPagina)
        })

        // Agregar el evento click a los botones de ordenamiento
        const ordenamientoBarra = $('<div class="d-flex justify-content-center my-5 w-100"></div>')
        const ordenamientoBotones = $('<div class="btn-group" role="group" aria-label="Button group with nested dropdown"></div>')
        const btnRating = $('<button type="button" class="btn btn-secondary">Rating</button>')
        const btnPrecio = $('<button type="button" class="btn btn-secondary">Precio</button>')
        const btnOrden = $(
          `<div class="btn-group" role="group">
              <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Orden
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Mayor</a></li>
                <li><a class="dropdown-item" href="#">Menor</a></li>
              </ul>
            </div>`
        )

        ordenamientoBotones.append(btnRating, btnPrecio, btnOrden)
        ordenamientoBarra.append(ordenamientoBotones)
        container.before(ordenamientoBarra)

        btnRating.on('click', function () {
          serviciosFiltrados.sort((a, b) => b.rating - a.rating)
          mostrarServiciosOrdenados(serviciosFiltrados)
          agregarEventosPaginacion()
        })

        btnPrecio.on('click', function () {
          serviciosFiltrados.sort((a, b) => a.precio - b.precio)
          mostrarServiciosOrdenados(serviciosFiltrados)
          agregarEventosPaginacion()
        })

        btnOrden.find('.dropdown-item').on('click', function () {
          const orden = $(this).text().toLowerCase()
          if (orden === 'mayor') {
            serviciosFiltrados.sort((a, b) => b.rating - a.rating)
          } else if (orden === 'menor') {
            serviciosFiltrados.sort((a, b) => a.rating - b.rating)
          }
          mostrarServiciosOrdenados(serviciosFiltrados)
          agregarEventosPaginacion()
        })

        // Función para mostrar los servicios ordenados
        function mostrarServiciosOrdenados(servicios) {
          container.empty()
          contadorTarjetas = 0

          servicios.forEach((servicio, index) => {
            // Crear una nueva row cada 3 tarjetas
            if (index % 3 === 0) {
              const row = $('<div class="row justify-content-center"></div>')
              container.append(row)
            }

            // Obtener la última row creada
            const lastRow = container.children().last()

            // Crear la tarjeta y agregarla a la última row
            const card = $(`
              <div class="col-sm-12 col-md-8 col-lg-3 my-2">
                <div class="card">
                  <img src="${servicio.imagen}" alt="${servicio.nombre}" class="card-img-top">
                  <div class="card-body">
                    <div class="text-center">
                      <h3 class="card-title">${servicio.nombre}</h3>
                      <p>${servicio.formato}</p>
                      <p>hora: ${servicio.precio} Ars</p>
                      <p>Rating: ${generateStars(servicio.rating)}</p>
                    </div>
                  </div>
                </div>
              </div>
            `)
            lastRow.append(card)

            contadorTarjetas++
          })

          mostrarPagina(tarjetas, 1, tarjetasPorPagina)
        }

        // Función para agregar eventos click a los botones de paginación
        function agregarEventosPaginacion() {
          paginacion.find('.btn').off('click')
          paginacion.find('.btn').on('click', function () {
            const pagina = parseInt($(this).text())
            mostrarPagina(tarjetas, pagina, tarjetasPorPagina)
          })
        }

      })
      .catch(function (error) {
        toastr.error('Error al cargar el archivo JSON')
      })
  }

  // Función para mostrar la información de contacto en una alerta emergente
  function mostrarInfoContacto(servicio) {
    Swal.fire({
      title: 'Información de contacto',
      html: `
        <h2> ${servicio.nombre} </h2>
        <p>Número de contacto: ${servicio.telefono}</p>
        <p>Correo electrónico: ${servicio.email}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      showCloseButton: true,
      footer: `
        <div class="social-buttons">
          <a href="https://www.facebook.com" class="btn btn-social-icon btn-facebook" target="_blank"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.twitter.com" class="btn btn-social-icon btn-twitter" target="_blank"><i class="fab fa-twitter"></i></a>
          <a href="https://www.instagram.com" class="btn btn-social-icon btn-instagram" target="_blank"><i class="fab fa-instagram"></i></a>
        </div>
      `
    })
  }
  
  // Función para mostrar una página específica de tarjetas
  function mostrarPagina(tarjetas, paginaActual, tarjetasPorPagina) {
    const inicio = (paginaActual - 1) * tarjetasPorPagina
    const fin = inicio + tarjetasPorPagina

    tarjetas.hide()
    tarjetas.slice(inicio, fin).show()
  }

  // Función para generar los iconos de estrellas según el rating
  function generateStars(rating) {
    const filledStar = '<i class="fas fa-star text-warning"></i>'
    const emptyStar = '<i class="far fa-star"></i>'

    let stars = ''
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars += filledStar
      } else {
        stars += emptyStar
      }
    }
    return stars
  }
})