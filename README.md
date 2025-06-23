# 📚 Library Management API

A robust Library Management System built with **Express**, **TypeScript**, and **MongoDB (Mongoose)**. This API allows you to manage books and borrowing operations with strict validation, business logic, and clear error handling.

---

## 🚀 Features

- **CRUD Operations:** Full support for creating, reading, updating, and deleting books.
- **Schema Validation:** Robust validation with **Zod** to ensure data integrity.
- **Advanced Querying:** Filter books by genre and sort results with multiple criteria.
- **Borrowing System:** Manage book borrowing with robust business logic to handle availability and stock.
- **Aggregation Pipeline:** Get a summary of all borrowed books.
- **Service-Oriented Architecture:** Business logic is cleanly separated into a service layer.
- **Global Error Handling:** Centralized middleware for consistent error responses.
- **Modern Tech Stack:** Built with Express, TypeScript, Zod, and Mongoose.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI="mongodb://127.0.0.1:27017/library_management"
```

### 4. Run the Application

#### For Development (with hot reload using `ts-node-dev`):

```bash
npm run dev
```

---

## 🏛️ Architecture

This project is built using a feature-based, service-oriented architecture to ensure a clear separation of concerns.

- **Controllers**: Handle incoming HTTP requests, validate request bodies using **Zod**, and send back responses. They delegate the core business logic to the service layer.
- **Services**: Contain the main business logic. They interact with the database models and perform all the necessary operations.
- **Routes**: Define the API endpoints and map them to the appropriate controllers.
- **Global Error Handler**: A middleware that catches all errors (both synchronous and asynchronous) and formats them into a consistent JSON response, preventing the application from crashing.

This structure makes the codebase clean, maintainable, and easy to test.

---

## 📖 API Endpoints

### 1. **Create Book**

- **Endpoint:** `POST /api/books`
- **Request Body:**

  ```json
  {
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true
  }
  ```

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Book created successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  }
  ```

---

### 2. **Get All Books**

- **Endpoint:** `GET /api/books`
- **Query Parameters:**

  - `filter` (genre): e.g. `FANTASY`
  - `sortBy`: e.g. `createdAt`
  - `sort`: `asc` or `desc`
  - `limit`: Number of results (default: 10)

- **Example:** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Books retrieved successfully",
    "data": [
      {
        "_id": "64f123abc4567890def12345",
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An overview of cosmology and black holes.",
        "copies": 5,
        "available": true,
        "createdAt": "2024-11-19T10:23:45.123Z",
        "updatedAt": "2024-11-19T10:23:45.123Z"
      }
      // ...
    ]
  }
  ```

---

### 3. **Get Book by ID**

- **Endpoint:** `GET /api/books/:bookId`

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Book retrieved successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  }
  ```

---

### 4. **Update Book**

- **Endpoint:** `PATCH /api/books/:bookId`
- **Request Body:** (Partial updates allowed)

  ```json
  {
    "copies": 50
  }
  ```

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Book updated successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 50,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-20T08:30:00.000Z"
    }
  }
  ```

---

### 5. **Delete Book**

- **Endpoint:** `DELETE /api/books/:bookId`

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Book deleted successfully",
    "data": null
  }
  ```

---

### 6. **Borrow a Book**

- **Endpoint:** `POST /api/borrow`
- **Request Body:**

  ```json
  {
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z"
  }
  ```

- **Business Logic:**

  - Checks if enough copies are available.
  - Deducts quantity from book's copies.
  - Sets `available` to `false` if copies reach 0.
  - Saves borrow record.

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Book borrowed successfully",
    "data": {
      "_id": "64bc4a0f9e1c2d3f4b5a6789",
      "book": "64ab3f9e2a4b5c6d7e8f9012",
      "quantity": 2,
      "dueDate": "2025-07-18T00:00:00.000Z",
      "createdAt": "2025-06-18T07:12:15.123Z",
      "updatedAt": "2025-06-18T07:12:15.123Z"
    }
  }
  ```

---

### 7. **Borrowed Books Summary**

- **Endpoint:** `GET /api/borrow`
- **Purpose:** Returns total borrowed quantity per book, with book title and ISBN.

- **Success Response:**

  ```json
  {
    "success": true,
    "message": "Borrowed books summary retrieved successfully",
    "data": [
      {
        "book": {
          "title": "The Theory of Everything",
          "isbn": "9780553380163"
        },
        "totalQuantity": 5
      },
      {
        "book": {
          "title": "1984",
          "isbn": "9780451524935"
        },
        "totalQuantity": 3
      }
    ]
  }
  ```

---

## ❌ Error Response Format

All errors are handled by a global middleware. For request validation, Zod is used, and any validation errors are formatted into the following structure:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "issues": [
      {
        "code": "too_small",
        "minimum": 0,
        "type": "number",
        "inclusive": true,
        "exact": false,
        "message": "Copies must be a non-negative number",
        "path": ["copies"]
      }
    ],
    "name": "ZodError"
  }
}
```

---

## �� Book Model Fields

- `title` (string, required)
- `author` (string, required)
- `genre` (string, required, one of: `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`)
- `isbn` (string, required, unique)
- `description` (string, optional)
- `copies` (number, required, non-negative)
- `available` (boolean, default: true)

---

## 📦 Borrow Model Fields

- `book` (ObjectId, required)
- `quantity` (number, required, positive)
- `dueDate` (date, required)

---

## 🙋‍♂️ Questions?

For any questions, please open an issue.
