# personal_list_site

# Task Manager

This is a simple Task Manager web application built using **Node.js**, **Express**, **MongoDB**, and **EJS** for rendering views. It allows users to **create, manage, and filter tasks** based on their status and creation date.

## Features
- **User Authentication** (JWT-based authentication)
- **Task Management** (Create, Edit, Delete tasks)
- **Filtering** (Filter tasks by status: Pending, Completed)
- **Sorting** (Sort tasks by Newest or Oldest)
- **CSRF Protection**

## Installation

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Setup
1. **Clone the repository**
   ```sh
   git clone https://github.com/BlockyAit/personal_list_site.git
   cd task-manager
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Create a `.env` file** and configure the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://ahm2005fahr:fahr2005@cluster0.toizz.mongodb.net/?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key
   ```

4. **Run the application**
   ```sh
   node server.js
   ```
   The server will start at `http://localhost:3000`.

## API Endpoints

### Authentication
- **`POST /register`** - Register a new user
- **`POST /login`** - Login and get a JWT token

### Tasks
- **`GET /`** - View all tasks (with filtering & sorting options)
- **`POST /tasks`** - Create a new task
- **`PUT /tasks/:id`** - Update a task
- **`DELETE /tasks/:id`** - Delete a task

## Project Structure
```
📂 Assignment4
├── 📂 views           # EJS Templates
├── 📂 public          # Static files (CSS, JS)
├── 📂 models          # Mongoose Models
├── 📂 routes          # Express Routes
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
├── README.md          # Project documentation
```

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS, HTML, CSS
- **Security:** JWT, CSRF Protection

## Future Improvements
- Add user profile settings
- Implement task priorities
- Improve UI with a frontend framework (React/Vue)

