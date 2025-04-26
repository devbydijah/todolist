# Next.js To-Do List Application

This project is a **To-Do List Application** built using **Next.js**, which was migrated from a previous implementation using **React with Vite**. The application is designed to help users manage their tasks effectively by adding, editing, and deleting to-do items. The project is structured with a modular approach, leveraging reusable components and utility functions. The migration to Next.js has enabled server-side rendering, improved performance, and better scalability.

## Features

### Task Management

- **Add Tasks**: Users can create new tasks with a title and description.
- **Edit Tasks**: Modify existing tasks to update their details.
- **Delete Tasks**: Remove tasks that are no longer needed.
- **Mark Complete/Incomplete**: Toggle the completion status of tasks.

### Pagination

- Supports paginated views for managing large lists of todos.

### Responsive Design

- Fully responsive UI that adapts to various screen sizes, including mobile, tablet, and desktop.
- Utilizes **Tailwind CSS** for dynamic and responsive styling.

### Dark Mode

- Supports light and dark themes with a toggle switch for user preference.

### Search and Filter

- Search tasks by title or description.
- Filter tasks by their completion status (All, Completed, Incomplete).

### Accessibility

- Built with accessibility in mind, ensuring compatibility with screen readers and keyboard navigation.

### Error Handling

- Includes an `ErrorBoundary` component to gracefully handle and display errors.

### Database Integration

- Uses **IndexedDB** (via Dexie.js) for local storage of tasks, ensuring data persistence across sessions.
- Synchronizes data between local storage and the database.

## Migration from React with Vite

This application was originally built using **React with Vite**. The migration to **Next.js** was undertaken to leverage the following benefits:

1. **Server-Side Rendering (SSR)**:

   - Improved SEO and faster initial page loads by rendering pages on the server.

2. **Static Site Generation (SSG)**:

   - Pre-rendered pages for better performance and scalability.

3. **File-Based Routing**:

   - Simplified routing structure using Next.js' file-based routing system.

4. **Built-In API Routes**:

   - Ability to create serverless API endpoints directly within the application.

5. **Optimized Performance**:

   - Automatic code splitting and optimized asset loading.

6. **Enhanced Developer Experience**:
   - Integrated development tools and better debugging capabilities.

## Technologies Used

- **Next.js**: Framework for server-side rendering and static site generation.
- **React**: Library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Dexie.js**: Wrapper for IndexedDB to manage local storage.
- **React Icons**: Icon library for UI components.
- **Lodash.debounce**: For optimizing input handling.
- **Clsx**: For conditional class name management.
- **Tailwind-merge**: For merging Tailwind CSS classes.


## Getting Started

To run the application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone [https://github.com/devbydijah/todolist.git](https://github.com/devbydijah/todolist.git)
   ```

2. Navigate to the project directory:

   ```bash
   cd todolist
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Folder Structure

The project is organized as follows:

src/
  app/
    favicon.ico        # Application favicon
    globals.css        # Global CSS styles
    layout.js          # Root layout component for the app
    not-found.js       # Custom 404 page
    page.js            # Main page for the to-do list
    add/               # Contains the page for adding new tasks
        page.js        # Page file for /add route
    todo/              # Directory for /todo routes
        [id]/          # Dynamic segment directory for /todo/:id
            page.js    # Page file for viewing/editing a specific todo
  components/          # Reusable React components
    ErrorBoundary.jsx  # Error boundary component
    ThemeToggle.jsx    # Component for toggling themes
    TodoActions.jsx    # Component for managing todo actions (add, edit, delete)
    TodoForm.jsx       # Form component for adding or editing todos
    TodoList.jsx       # Component for displaying the list of tasks
    ui/                # Contains Shadcn UI components
  lib/                 # Utility functions and libraries
    api.js             # API utilities for fetching and managing todos
    db.js              # Database configuration and utilities using Dexie.js
    sync.js            # Synchronization logic for local storage and database
    utils.js           # Utility functions


## Deployment

The application can be deployed using platforms like **Vercel** for seamless hosting and integration with Next.js. Follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.