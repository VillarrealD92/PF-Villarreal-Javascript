$(document).ready(function() {
  // Crear los elementos del formulario
  const usernameInput = $('<input type="text" placeholder="Usuario" name="username" autocomplete="null">')
  const passwordInput = $('<input type="password" placeholder="Contraseña" name="password" autocomplete="null" >')
  const submitButton = $('<button class="btn btn-primary">Iniciar sesión</button>')
  const logoutButton = $('<button class="btn btn-primary">Cerrar sesión</button>')

  // Obtener el contenedor del formulario
  const formContainer = $('<form class="signinForm"></form>')
  formContainer.append(usernameInput, passwordInput, submitButton)

  // Comprobar si hay una sesión activa en el localStorage
  const loggedInUser = localStorage.getItem('loggedInUser')
  if (loggedInUser) {
    mostrarBienvenida(loggedInUser)
  } else {
    $('.signinButton').on('click', function() {
      formContainer.insertAfter('.signinButton')
    })
  }

  // Función para ocultar el formulario y mostrar el mensaje de bienvenida
  function mostrarBienvenida(username) {
    formContainer.hide()
    const welcomeText = 'Bienvenido, ' + username
    $('.signinButton').html(welcomeText).show()
    const logoutContainer = $('<div class="d-flex justify-content-center mt-2"></div>')
    logoutContainer.append(logoutButton)
    $('.navbar').after(logoutContainer)
  }

  // Función para mostrar el mensaje de error
  function mostrarError() {
    const errorMessage = $('<p>Inténtalo de nuevo, no pudimos encontrar ese usuario/contraseña</p>')
    formContainer.append(errorMessage)

    setTimeout(function() {
      errorMessage.remove()
    }, 500)
  }

  // Evento de clic en el botón de inicio de sesión
  submitButton.on('click', function(event) {
    event.preventDefault() 

    const username = usernameInput.val()
    const password = passwordInput.val()

    // Validar los datos ingresados
    validarDatos(username, password)
  })

  // Evento de presionar Enter en el formulario
  formContainer.on('keyup', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault()

      const username = usernameInput.val()
      const password = passwordInput.val()

      // Validar los datos ingresados
      validarDatos(username, password)
    }
  })

  // Evento de clic en el botón de cerrar sesión
  logoutButton.on('click', function() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se cerrará la sesión actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('loggedInUser')
        Swal.fire({
          title: '¡Sesión cerrada!',
          text: 'La sesión se cerró correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          $('.signinButton').html('<img src="../multimedia/imagenes/huellasignin.svg" alt="sign_in" class="mr-2">Sign-in').show()
          formContainer.hide()
          $('.logoutContainer').remove()
          location.reload()
        })
      }
    })
  })

  // Función para validar los datos ingresados
  function validarDatos(username, password) {
    
    $.getJSON('../signin.json')
      .then(function(data) {
        // Verificar si existe una coincidencia de usuario y contraseña
        const usuarioValido = data.find(user => user.username === username && user.password === password)
  
        if (usuarioValido) {
          mostrarBienvenida(username)
          localStorage.setItem('loggedInUser', username)
        } else {
          mostrarError()
        }
      })
      .catch(function(error) {
        console.log('Error al cargar el archivo JSON:', error)
      })
  }
})