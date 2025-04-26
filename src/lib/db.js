import Dexie from 'dexie';

const db = new Dexie('TodoDatabase');
db.version(11).stores({
  todos: '++id,title,completed'
});

export default db;

// Fetch todos from Dexie
export const getTodos = async () => {
  return await db.todos.toArray();
};

// Save or update a todo in Dexie
export const saveTodo = async (todo) => {
  await db.todos.put(todo);
};

// Delete a todo from Dexie
export const deleteTodo = async (id) => {
  await db.todos.delete(id);
};

// Save todos to localStorage (only necessary data)
export const saveTodosToLocalStorage = (todos) => {
  const minimalTodos = todos.map(todo => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed
  }));
  localStorage.setItem('todos', JSON.stringify(minimalTodos));
};

// Load todos from localStorage
export const loadTodosFromLocalStorage = () => {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
};

// Sync todos from Dexie to localStorage
export const syncTodosToLocalStorage = async () => {
  const todos = await getTodos();
  saveTodosToLocalStorage(todos);
};

// Sync todos from localStorage to Dexie
export const syncTodosFromLocalStorage = async () => {
  const todos = loadTodosFromLocalStorage();
  await db.todos.bulkPut(todos);
};

// Save a todo to both Dexie and localStorage
export const saveTodoToBoth = async (todo) => {
  await saveTodo(todo);
  await syncTodosToLocalStorage();
};

// Delete a todo from both Dexie and localStorage
export const deleteTodoFromBoth = async (id) => {
  await deleteTodo(id);
  await syncTodosToLocalStorage();
};

// Load todos from both Dexie and localStorage
export const loadTodosFromBoth = async () => {
  await syncTodosFromLocalStorage();
  return await getTodos();
};