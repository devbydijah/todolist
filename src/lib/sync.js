import { loadTodosFromBoth, saveTodoToBoth, deleteTodoFromBoth } from "./db";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";

// Sync data from the external API to the local Dexie database
export const syncFromAPIToLocal = async () => {
  try {
    const apiTodos = await fetchTodos();
    for (const todo of apiTodos) {
      await saveTodoToBoth(todo);
    }
    console.log("Synced data from API to local database.");
  } catch (error) {
    console.error("Failed to sync from API to local:", error);
  }
};

// Sync data from the local Dexie database to the external API
export const syncFromLocalToAPI = async () => {
  try {
    const localTodos = await loadTodosFromBoth();
    for (const todo of localTodos) {
      if (!todo.synced) {
        await addTodo(todo);
        todo.synced = true;
        await saveTodoToBoth(todo);
      }
    }
    console.log("Synced data from local database to API.");
  } catch (error) {
    console.error("Failed to sync from local to API:", error);
  }
};

// Full sync: Sync both ways
export const fullSync = async () => {
  await syncFromAPIToLocal();
  await syncFromLocalToAPI();
};
