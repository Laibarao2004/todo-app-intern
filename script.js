/**
 * ============================================================================
 * Task Flow - Vanilla JavaScript To-Do List Application
 * ============================================================================
 * Features:
 * - Dynamic task creation, inline editing, completion toggle, and deletion.
 * - Event delegation for list actions.
 * - Persistent storage with window.localStorage and error handling.
 * - XSS protection via textContent and safe DOM node creation.
 */

// Storage key used to persist tasks in localStorage
const STORAGE_KEY = "todo_app_tasks";

// In-memory state array holding task objects
// Each task shape: { id: string, text: string, completed: boolean }
let tasks = [];

// Tracks which task is currently being edited inline (null if none)
let editingTaskId = null;

// DOM Element References
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");

/**
 * Loads tasks from localStorage.
 * Wrapped in try/catch to handle privacy modes or parsing errors gracefully.
 * @returns {Array<Object>} Parsed task array or empty array on failure
 */
function loadTasks() {
  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    // Validate that the loaded data is an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
    return [];
  }
}

/**
 * Saves the current tasks array to localStorage.
 * Wrapped in try/catch to handle storage quota or security limits.
 */
function saveTasks() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
}

/**
 * Creates and adds a new task to the list.
 * Ignores empty or whitespace-only input.
 * @param {string} text - The description of the new task
 */
function addTask(text) {
  const trimmed = text.trim();
  // Ignore empty or whitespace-only submissions
  if (!trimmed) {
    return;
  }

  // Create task object with unique id based on current timestamp
  const newTask = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  };

  // Add new task to the beginning of the list
  tasks.unshift(newTask);

  // Persist and re-render
  saveTasks();
  renderTasks();
}

/**
 * Updates the text description of an existing task.
 * @param {string} id - The unique task id
 * @param {string} newText - The updated task text
 */
function editTask(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) {
    alert("Task description cannot be empty.");
    return;
  }

  const targetTask = tasks.find((t) => t.id === id);
  if (targetTask) {
    targetTask.text = trimmed;
    editingTaskId = null;
    saveTasks();
    renderTasks();
  }
}

/**
 * Toggles a task's completed state.
 * @param {string} id - The unique task id
 */
function toggleTask(id) {
  const targetTask = tasks.find((t) => t.id === id);
  if (targetTask) {
    targetTask.completed = !targetTask.completed;
    saveTasks();
    renderTasks();
  }
}

/**
 * Deletes a task by id from the list.
 * @param {string} id - The unique task id
 */
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);

  // If the deleted task was currently being edited, reset edit mode
  if (editingTaskId === id) {
    editingTaskId = null;
  }

  saveTasks();
  renderTasks();
}

/**
 * Renders the task list into the DOM dynamically.
 * Builds DOM nodes safely (using textContent) to prevent XSS vulnerabilities.
 */
function renderTasks() {
  // Clear the existing list contents
  taskList.innerHTML = "";

  // Update empty state visibility
  if (tasks.length === 0) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
  }

  // Update task count summary
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  taskCount.textContent = `${total} ${total === 1 ? "task" : "tasks"}`;
  completedCount.textContent = `${completed} completed`;

  // Render each task item
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.id = task.id;

    // Check if this task is currently in edit mode
    if (editingTaskId === task.id) {
      li.classList.add("editing");

      // Edit Input Field
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input-field";
      editInput.value = task.text;
      editInput.setAttribute("aria-label", "Edit task text");

      // Edit Actions Container
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "task-actions";

      // Save Button
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "btn btn-action btn-save";
      saveBtn.dataset.action = "save-edit";
      saveBtn.textContent = "Save";

      // Cancel Button
      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "btn btn-action btn-cancel";
      cancelBtn.dataset.action = "cancel-edit";
      cancelBtn.textContent = "Cancel";

      actionsDiv.appendChild(saveBtn);
      actionsDiv.appendChild(cancelBtn);

      li.appendChild(editInput);
      li.appendChild(actionsDiv);
    } else {
      // Normal display mode
      const mainDiv = document.createElement("div");
      mainDiv.className = "task-main";

      // Completion Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.completed;
      checkbox.dataset.action = "toggle";
      checkbox.setAttribute("aria-label", `Mark "${task.text}" as ${task.completed ? "incomplete" : "complete"}`);

      // Task Text Span (Safely populated using textContent to prevent XSS)
      const textSpan = document.createElement("span");
      textSpan.className = "task-text";
      textSpan.textContent = task.text;

      // Allow clicking text to toggle completion
      textSpan.dataset.action = "toggle";

      mainDiv.appendChild(checkbox);
      mainDiv.appendChild(textSpan);

      // Actions Container
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "task-actions";

      // Edit Button
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-action btn-edit";
      editBtn.dataset.action = "edit";
      editBtn.textContent = "Edit";
      editBtn.setAttribute("aria-label", `Edit task "${task.text}"`);

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-action btn-delete";
      deleteBtn.dataset.action = "delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("aria-label", `Delete task "${task.text}"`);

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(mainDiv);
      li.appendChild(actionsDiv);
    }

    taskList.appendChild(li);
  });

  // If currently editing, auto-focus the edit input field
  if (editingTaskId) {
    const activeEditInput = taskList.querySelector(".edit-input-field");
    if (activeEditInput) {
      activeEditInput.focus();
      // Position cursor at the end of the text
      const length = activeEditInput.value.length;
      activeEditInput.setSelectionRange(length, length);
    }
  }
}

/**
 * ============================================================================
 * Event Listeners & Event Delegation
 * ============================================================================
 */

// Form submit event for adding tasks (handles both button click and Enter key)
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

// Event delegation on the task list container
// Handles Complete toggle, Edit mode, Save edit, Cancel edit, and Delete
taskList.addEventListener("click", (e) => {
  const target = e.target;
  const action = target.dataset.action;
  const taskItem = target.closest(".task-item");

  if (!taskItem) return;
  const taskId = taskItem.dataset.id;

  switch (action) {
    case "toggle":
      toggleTask(taskId);
      break;

    case "edit":
      editingTaskId = taskId;
      renderTasks();
      break;

    case "save-edit": {
      const editInput = taskItem.querySelector(".edit-input-field");
      if (editInput) {
        editTask(taskId, editInput.value);
      }
      break;
    }

    case "cancel-edit":
      editingTaskId = null;
      renderTasks();
      break;

    case "delete":
      deleteTask(taskId);
      break;

    default:
      break;
  }
});

// Keyboard shortcut support for inline editing (Enter to save, Escape to cancel)
taskList.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("edit-input-field")) return;

  const taskItem = e.target.closest(".task-item");
  if (!taskItem) return;
  const taskId = taskItem.dataset.id;

  if (e.key === "Enter") {
    e.preventDefault();
    editTask(taskId, e.target.value);
  } else if (e.key === "Escape") {
    e.preventDefault();
    editingTaskId = null;
    renderTasks();
  }
});

/**
 * ============================================================================
 * Application Initialization
 * ============================================================================
 */
function init() {
  tasks = loadTasks();
  renderTasks();
}

// Run init on DOMContentLoaded or immediately if document is already ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
