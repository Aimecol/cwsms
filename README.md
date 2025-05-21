# Car Wash Service Management System (CWSMS)

## Overview

The Car Wash Service Management System (CWSMS) is a full-stack web application designed to manage car wash operations. It includes features for managing cars, service packages, service records, payments, and generating various reports. The system consists of a React-based front-end and a Node.js/Express backend with a MySQL database.

## Project Structure

The project is organized into two main directories:

-   `front-end-project/`: Contains the React application built with Vite.
-   `backend-project/`: Contains the Node.js Express API server.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js and npm:** (Node.js >= 14.x, npm >= 6.x recommended) - Download from [nodejs.org](https://nodejs.org/)
-   **Git:** For cloning the repository.
-   **XAMPP (or any MySQL server):** For the database. Ensure Apache and MySQL services are running. Download from [apachefriends.org](https://www.apachefriends.org/index.html)
-   **A code editor:** Such as VS Code.

## Cloning the Repository

1.  Open your terminal or command prompt.
2.  Navigate to the directory where you want to clone the project (e.g., `c:\xampp\htdocs\`).
3.  Clone the repository using the following command (replace `<repository_url>` with the actual URL):

    ```bash
    git clone <repository_url> CWSMS
    cd CWSMS
    ```

## Backend Setup (`backend-project`)

1.  **Navigate to the backend directory:**

    ```bash
    cd backend-project
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    *   Create a `.env` file in the `backend-project` directory.
    *   Copy the contents of `.env.example` (if provided) or add the following environment variables, adjusting values as necessary for your local MySQL setup:

        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=cwsms_db  # Or your preferred database name
        PORT=5000
        ```

4.  **Database Setup:**
    *   Ensure your MySQL server (e.g., via XAMPP Control Panel) is running.
    *   Open phpMyAdmin (usually `http://localhost/phpmyadmin`) or your preferred MySQL client.
    *   Create a new database with the name specified in your `.env` file (e.g., `cwsms_db`).
    *   The project includes a database initialization script. You might need to run it to set up the schema. Check `config/dbInit.js`. If it's designed to be run manually:
        ```bash
        node config/dbInit.js
        ```
        (Alternatively, the application might create tables on startup if designed that way, or you might have a `.sql` file to import.)

5.  **Running the Backend Server:**
    *   To run the server in development mode (with Nodemon for auto-restarts):

        ```bash
        npm run dev
        ```
    *   To run the server in production mode:

        ```bash
        npm start
        ```
    *   The backend API should now be running, typically at `http://localhost:5000`.

## Frontend Setup (`front-end-project`)

1.  **Navigate to the frontend directory (from the root `CWSMS` directory):**

    ```bash
    cd .. 
    cd front-end-project 
    ```
    (If you are already in `backend-project`, use `cd ../front-end-project`)

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Running the Frontend Development Server:**

    ```bash
    npm run dev
    ```
    *   This will start the Vite development server, usually at `http://localhost:5173` (the port might vary, check your terminal output).
    *   Open this URL in your web browser to view the application.

## Available Scripts

### Backend (`backend-project/package.json`)

-   `npm start`: Starts the production server.
-   `npm run dev`: Starts the development server using Nodemon.
-   `npm test`: (Currently echoes "Error: no test specified")

### Frontend (`front-end-project/package.json`)

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the app for production.
-   `npm run lint`: Lints the project files using ESLint.
-   `npm run preview`: Serves the production build locally for preview.

## API Endpoints

The backend provides several API endpoints to manage the application's data. Key routes include:

-   `/api/cars`: For car management (CRUD operations).
-   `/api/packages`: For service package management (CRUD operations).
-   `/api/service-packages`: For managing specific services availed by customers.
-   `/api/payments`: For payment processing and records.
-   `/api/reports`: For generating various reports:
    -   `/api/reports/daily`
    -   `/api/reports/monthly`
    -   `/api/reports/package-popularity`
    -   `/api/reports/customer-frequency`
    -   `/api/reports/revenue-by-car-type`
    -   `/api/reports/unpaid-services`

Refer to the `backend-project/routes/` directory for detailed route definitions.

## Technologies Used

-   **Frontend:**
    -   React
    -   Vite
    -   JavaScript (ES6+)
    -   HTML5 & CSS3
    -   Tailwind CSS (implied by `autoprefixer` and `postcss` in devDependencies, and `tailwind.config.js` if present, though not explicitly seen in file list)
-   **Backend:**
    -   Node.js
    -   Express.js
    -   MySQL2 (MySQL driver)
    -   dotenv (for environment variables)
    -   CORS
-   **Database:**
    -   MySQL
-   **Development Tools:**
    -   ESLint
    -   Nodemon
    -   Git

---

This README should provide a comprehensive guide for anyone looking to set up and run your CWSMS project. Remember to replace `<repository_url>` with your actual Git repository URL.