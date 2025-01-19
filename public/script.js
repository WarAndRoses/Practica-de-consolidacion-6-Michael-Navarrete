document.addEventListener('DOMContentLoaded', () => {
  var swiper = new Swiper('.divSuperior', {
    navigation: {
      nextEl: '.adelanteBoton',
      prevEl: '.atrasBoton',
    },
    pagination: {
      el: '.mostradorCambios',
      clickable: true,
    },
    loop: true, // Asegúrate de que el bucle esté habilitado
    loopAdditionalSlides: 1, // Asegúrate de que el bucle esté habilitado
  });

  // Función para mostrar la información del anime
  function mostrarInfoAnime(anime) {
    const divDerecho = document.querySelector('.divDerecho');
    divDerecho.innerHTML = `
      <h2>${anime.nombre}</h2>
      <p><strong>Género:</strong> ${anime.genero}</p>
      <p><strong>Año:</strong> ${anime.año}</p>
      <p><strong>Autor:</strong> ${anime.autor}</p>
    `;
  }

  // Función para limpiar el formulario
  function limpiarFormulario() {
    document.getElementById('animeId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('año').value = '';
    document.getElementById('autor').value = '';
  }

  // Obtener los datos del anime desde el servidor
  fetch('/api/animes')
    .then(response => response.json())
    .then(animes => {
      // Añadir evento de clic a las imágenes
      document.querySelectorAll('.imgDeslizada img').forEach(img => {
        img.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          mostrarInfoAnime(animes[id]);
        });
      });

      // Limpiar el formulario cada vez que se cambie de slide
      swiper.on('slideChange', () => {
        limpiarFormulario();
      });

      // Manejar el evento de clic en el botón "Agregar Anime"
      document.getElementById('agregarAnime').addEventListener('click', () => {
        document.getElementById('formulario').style.display = 'block';
        limpiarFormulario();
      });

      // Manejar el evento de clic en el botón "Modificar Anime"
      document.getElementById('modificarAnime').addEventListener('click', () => {
        const selectedAnimeId = document.querySelector('.swiper-slide-active img').getAttribute('data-id');
        const anime = animes[selectedAnimeId];
        if (!anime) {
          alert('Anime no encontrado');
          return;
        }

        document.getElementById('formulario').style.display = 'block';
        document.getElementById('animeId').value = selectedAnimeId;
        document.getElementById('nombre').value = anime.nombre;
        document.getElementById('genero').value = anime.genero;
        document.getElementById('año').value = anime.año;
        document.getElementById('autor').value = anime.autor;
      });

      // Manejar el evento de clic en el botón "Cancelar"
      document.getElementById('cancelAnime').addEventListener('click', () => {
        document.getElementById('formulario').style.display = 'none';
      });

      // Manejar el evento de envío del formulario
      document.getElementById('formulario').addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('animeId').value;
        const anime = {
          nombre: document.getElementById('nombre').value,
          genero: document.getElementById('genero').value,
          año: document.getElementById('año').value,
          autor: document.getElementById('autor').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/animes/${id}` : '/api/animes';

        fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(anime)
        })
        .then(response => response.json())
        .then(data => {
          alert(`Anime ${id ? 'modificado' : 'agregado'} con éxito`);
          location.reload(); // Recargar la página para ver los cambios
        })
        .catch(error => console.error(`Error al ${id ? 'modificar' : 'agregar'} el anime:`, error));
      });
    })
    .catch(error => console.error('Error al obtener los datos del anime:', error));
});