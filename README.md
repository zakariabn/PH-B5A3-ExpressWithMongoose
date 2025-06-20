# 📚 Library Management API

A robust Library Management System built with **Express**, **TypeScript**, and **MongoDB (Mongoose)**. This API allows you to manage books and borrowing operations with strict validation, business logic, and clear error handling.

---

## 🚀 Features

- **Book Management:** Create, read, update, delete books.
- **Borrowing System:** Borrow books with business logic enforcement.
- **Filtering & Sorting:** Retrieve books with flexible queries.
- **Aggregation:** Get summary of borrowed books.
- **Validation & Error Handling:** Consistent, descriptive error responses.
- **Modern Stack:** Express, TypeScript, MongoDB (Mongoose).

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
MONGODB_URI=mongodb://localhost:27017/library-management
```

### 4. Run the Application

#### For Development (with hot reload):

```bash
npm run dev
```

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

- **Endpoint:** `Patch /api/books/:bookId`
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

All errors follow this structure:

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

---

## 📚 Book Model Fields

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
