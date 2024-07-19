const { existsSync, readFileSync, writeFileSync } = require("fs");
const { createServer } = require("http");

const DB_FILE = "./db.json";
const URI_PREFIX = "/api/todos";
const PORT = 3000;

class TodoApiError extends Error {
  constructor(statusCode, data) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }
}

function drainJson(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(JSON.parse(data));
    });
  });
}

function makeTodoItemFromData(data) {
  const errors = [];

  const todoItem = {
    owner: data.owner && String(data.owner),
    name: data.name && String(data.name),
    done: Boolean(data.done),
  };

  if (!todoItem.owner)
    errors.push({ field: "owner", message: "Proprietário não especificado" });
  if (!todoItem.name)
    errors.push({
      field: "name",
      message: "Título da tarefa não especificado",
    });
  if (!todoItem.done) todoItem.done = false;

  if (errors.length) throw new TodoApiError(422, { errors });

  return todoItem;
}

function getTodoList(params = {}) {
  const todoList = JSON.parse(readFileSync(DB_FILE) || "[]");
  if (params.owner)
    return todoList.filter(({ owner }) => owner === params.owner);
  return todoList;
}

function createTodoItem(data) {
  const newItem = makeTodoItemFromData(data);
  newItem.id = Date.now().toString();
  writeFileSync(DB_FILE, JSON.stringify([...getTodoList(), newItem]), {
    encoding: "utf8",
  });
  return newItem;
}

function getTodoItem(itemId) {
  const todoItem = getTodoList().find(({ id }) => id === itemId);
  if (!todoItem)
    throw new TodoApiError(404, { message: "TODO Item Not Found" });
  return todoItem;
}

function updateTodoItem(itemId, data) {
  const todoItems = getTodoList();
  const itemIndex = todoItems.findIndex(({ id }) => id === itemId);
  if (itemIndex === -1)
    throw new TodoApiError(404, { message: "TODO Item Not Found" });
  Object.assign(
    todoItems[itemIndex],
    makeTodoItemFromData({ ...todoItems[itemIndex], ...data })
  );
  writeFileSync(DB_FILE, JSON.stringify(todoItems), { encoding: "utf8" });
  return todoItems[itemIndex];
}

function deleteTodoItem(itemId) {
  const todoItems = getTodoList();
  const itemIndex = todoItems.findIndex(({ id }) => id === itemId);
  if (itemIndex === -1)
    throw new TodoApiError(404, { message: "TODO Item Not Found" });
  todoItems.splice(itemIndex, 1);
  writeFileSync(DB_FILE, JSON.stringify(todoItems), { encoding: "utf8" });
  return {};
}

function getCompletedTodos() {
  return getTodoList().filter((todo) => todo.done);
}

function markAllAsCompleted() {
  const todoItems = getTodoList();
  todoItems.forEach((todo) => (todo.done = true));
  writeFileSync(DB_FILE, JSON.stringify(todoItems), { encoding: "utf8" });
  return todoItems;
}

function markTodoAsCompleted(itemId) {
  const todoItems = getTodoList();
  const itemIndex = todoItems.findIndex(({ id }) => id === itemId);
  if (itemIndex === -1)
    throw new TodoApiError(404, { message: "TODO Item Not Found" });
  todoItems[itemIndex].done = true;
  writeFileSync(DB_FILE, JSON.stringify(todoItems), { encoding: "utf8" });
  return todoItems[itemIndex];
}

if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, "[]", { encoding: "utf8" });

createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  if (!req.url || !req.url.startsWith(URI_PREFIX)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Not Found" }));
    return;
  }

  const [uri, query] = req.url.substr(URI_PREFIX.length).split("?");
  const queryParams = {};

  if (query) {
    for (const piece of query.split("&")) {
      const [key, value] = piece.split("=");
      queryParams[key] = value ? decodeURIComponent(value) : "";
    }
  }

  try {
    const body = await (async () => {
      if (uri === "" || uri === "/") {
        if (req.method === "GET") return getTodoList(queryParams);
        if (req.method === "POST") {
          const newTodoItem = createTodoItem(await drainJson(req));
          res.statusCode = 201;
          res.setHeader("Location", `${URI_PREFIX}/${newTodoItem.id}`);
          return newTodoItem;
        }
      } else if (uri === "/completed") {
        if (req.method === "GET") return getCompletedTodos();
        if (req.method === "PATCH") return markAllAsCompleted();
      } else {
        const itemId = uri.substr(1);
        if (req.method === "GET") return getTodoItem(itemId);
        if (req.method === "PATCH") {
          const data = await drainJson(req);
          if (data.done === true) return markTodoAsCompleted(itemId);
          return updateTodoItem(itemId, data);
        }
        if (req.method === "DELETE") return deleteTodoItem(itemId);
      }
      return null;
    })();
    res.end(JSON.stringify(body));
  } catch (err) {
    if (err instanceof TodoApiError) {
      res.writeHead(err.statusCode);
      res.end(JSON.stringify(err.data));
    } else {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Server Error" }));
      console.error(err);
    }
  }
}).listen(PORT, () => {
  console.log(
    `O servidor TODO está em execução. Você pode usá-lo em http://localhost:${PORT}`
  );
  console.log("Pressione CTRL+C para parar o servidor");
  console.log("Métodos Disponíveis:");
  console.log(
    `GET ${URI_PREFIX} - obter lista de tarefas, query parâmetro owner filtra por proprietário`
  );
  console.log(
    `POST ${URI_PREFIX} - criar uma tarefa, você precisa passar um objeto no corpo da solicitação { name: string, owner: string, done?: boolean }`
  );
  console.log(`GET ${URI_PREFIX}/{id} - obter uma tarefa por ID`);
  console.log(
    `PATCH ${URI_PREFIX}/{id} - alterar uma tarefa por ID, você precisa passar um objeto no corpo da solicitação { name?: string, owner?: string, done?: boolean }`
  );
  console.log(`DELETE ${URI_PREFIX}/{id} - excluir uma tarefa por ID`);
  console.log(
    `GET ${URI_PREFIX}/completed - obter todas as tarefas concluídas`
  );
  console.log(
    `PATCH ${URI_PREFIX}/completed - marcar todas as tarefas como concluídas`
  );
});
