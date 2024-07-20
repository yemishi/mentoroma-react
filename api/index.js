const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs/promises");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = "posts.json";

app.use(cors());
app.use(bodyParser.json());

// Middleware para carregar os posts do arquivo JSON
app.use(async (req, res, next) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    req.posts = JSON.parse(data);
  } catch (error) {
    req.posts = [];
  }
  next();
});

// Rota para obter todos os posts
app.get("/posts", (req, res) => {
  const posts = req.posts.sort((a, b) => b.id - a.id);
  res.json(posts);
});

// Rota para obter um post específico por ID
app.get("/posts/:id", (req, res) => {
  const post = req.posts.find((p) => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Rota para criar um novo post
app.post("/posts", (req, res) => {
  const newPost = { ...req.body, id: Date.now().toString(), starsCount: 0 };
  req.posts.push(newPost);
  fs.writeFile(DATA_FILE, JSON.stringify(req.posts, null, 2))
    .then(() => res.json(newPost))
    .catch(() => res.status(500).json({ error: "Failed to save posts" }));
});

// Rota para atualizar um post existente por ID
app.put("/posts/:id", (req, res) => {
  const index = req.posts.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    req.posts[index] = { ...req.posts[index], ...req.body };
    fs.writeFile(DATA_FILE, JSON.stringify(req.posts, null, 2))
      .then(() => res.json(req.posts[index]))
      .catch(() => res.status(500).json({ error: "Failed to save posts" }));
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Rota para atualizar a quantidade de favoritos de um post
app.put("/posts/:id/favorite", (req, res) => {
  const index = req.posts.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    req.posts[index].starsCount++;
    fs.writeFile(DATA_FILE, JSON.stringify(req.posts, null, 2))
      .then(() => res.json(req.posts[index]))
      .catch(() => res.status(500).json({ error: "Failed to save posts" }));
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Rota para excluir um post por ID
app.delete("/posts/:id", (req, res) => {
  const index = req.posts.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    const deletedPost = req.posts.splice(index, 1)[0];
    fs.writeFile(DATA_FILE, JSON.stringify(req.posts, null, 2))
      .then(() => res.json(deletedPost))
      .catch(() => res.status(500).json({ error: "Failed to save posts" }));
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
