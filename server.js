const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const PORT = 3020;
const animeFilePath = path.join(__dirname, 'anime.json');

// Función para leer el archivo JSON
const readAnimeFile = (callback) => {
  fs.readFile(animeFilePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, JSON.parse(data));
  });
};

// Función para escribir en el archivo JSON
const writeAnimeFile = (data, callback) => {
  fs.writeFile(animeFilePath, JSON.stringify(data, null, 2), 'utf8', callback);
};

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para obtener los datos del anime
app.get('/api/animes', (req, res) => {
  readAnimeFile((err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    res.json(data);
  });
});

// Ruta para obtener un anime por ID
app.get('/api/animes/:id', (req, res) => {
  const animeId = req.params.id;
  readAnimeFile((err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    const anime = data[animeId];
    if (!anime) {
      res.status(404).send('Anime no encontrado');
      return;
    }
    res.json(anime);
  });
});

// Ruta para crear un nuevo anime
app.post('/api/animes', (req, res) => {
  const newAnime = req.body;
  readAnimeFile((err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    const newId = String(Object.keys(data).length + 1);
    data[newId] = newAnime;
    writeAnimeFile(data, (err) => {
      if (err) {
        res.status(500).send('Error al escribir en el archivo');
        return;
      }
      res.status(201).json({ id: newId, ...newAnime });
    });
  });
});

// Ruta para actualizar un anime existente
app.put('/api/animes/:id', (req, res) => {
  const animeId = req.params.id;
  const updatedAnime = req.body;
  readAnimeFile((err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    if (!data[animeId]) {
      res.status(404).send('Anime no encontrado');
      return;
    }
    data[animeId] = updatedAnime;
    writeAnimeFile(data, (err) => {
      if (err) {
        res.status(500).send('Error al escribir en el archivo');
        return;
      }
      res.json({ id: animeId, ...updatedAnime });
    });
  });
});

// Ruta para eliminar un anime existente
app.delete('/api/animes/:id', (req, res) => {
  const animeId = req.params.id;
  readAnimeFile((err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    if (!data[animeId]) {
      res.status(404).send('Anime no encontrado');
      return;
    }
    delete data[animeId];
    writeAnimeFile(data, (err) => {
      if (err) {
        res.status(500).send('Error al escribir en el archivo');
        return;
      }
      res.status(204).send();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});