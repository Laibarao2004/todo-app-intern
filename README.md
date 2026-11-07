# Modern To-Do List Application

A responsive, lightweight To-Do List web application built with plain HTML5, CSS3, and vanilla JavaScript (no frameworks or libraries).

🔗 **Live Demo**: [https://laibarao2004.github.io/todo-app-intern/](https://laibarao2004.github.io/todo-app-intern/)  
📁 **Repository**: [https://github.com/Laibarao2004/todo-app-intern](https://github.com/Laibarao2004/todo-app-intern)

---

## 🚀 How to Run the App Locally

1. **Directly in your Browser**:
   - Double-click `index.html` or right-click `index.html` and choose **Open with** > **Google Chrome** (or Edge, Firefox, Safari).
   - Alternatively, open your browser and press `Ctrl + O` and select the `index.html` file.

2. **Using a Local Development Server (Optional)**:
   - If you have Python installed:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your browser.

---

## ✨ Features

1. **Add Task**:
   - Type a task description in the input field and click **Add Task** or press `Enter`.
   - Empty or whitespace-only inputs are automatically ignored.

2. **View Tasks & Empty State**:
   - Displays all tasks dynamically in a clean list format.
   - Displays a welcoming "No tasks yet" empty state message when there are no items.
   - Displays real-time task statistics (total count and completed count).

3. **Complete / Incomplete**:
   - Click the custom checkbox (or click the task text) to mark a task as completed or incomplete.
   - Completed tasks feature a subtle background tint and strikethrough styling for clear visual feedback.

4. **Inline Task Editing**:
   - Click the **Edit** button next to any task to switch it into inline edit mode.
   - Edit the text directly in place, then click **Save** (or press `Enter`).
   - Click **Cancel** (or press `Escape`) to discard changes.

5. **Delete Task**:
   - Click the **Delete** button next to a task to immediately remove it from your list.

6. **Local Persistence (`localStorage`)**:
   - All tasks are serialized and stored as structured JSON objects (`id`, `text`, `completed`) in the browser's `window.localStorage`.
   - Storage reads and writes are safely wrapped in `try...catch` blocks to protect against storage quota limits or restricted browser modes.
   - Tasks persist across tab closes and browser refreshes.

7. **Security & Accessibility**:
   - User inputs are safely handled via `textContent` rather than `innerHTML` to prevent Cross-Site Scripting (XSS).
   - Semantic HTML elements, ARIA labels, and responsive layout for mobile and desktop screens.

---

## 📁 File Structure

- `index.html` — Semantic HTML5 structure and layout.
- `style.css` — Modern styling, animations, responsive design, and CSS variables.
- `script.js` — Modular vanilla JavaScript logic with event delegation and local storage.
- `README.md` — Documentation and usage instructions.
