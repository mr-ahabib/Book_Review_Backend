# 📚 Book Critic – React Native Book Review System

**Book Critic** is a mobile application built with **React Native** and an **Express.js backend** for discovering, reviewing, and discussing books.  
It provides a smooth user experience with Redux state management, pagination for large datasets, axios instances for API requests, caching for performance, and reusable components for maintainable code.

---

## ✨ Features

### 📱 Frontend (React Native)
- 📖 **Browse Books** – Explore a paginated list of books with cover images and details.
- 📝 **Add Reviews** – Share your opinion and give ratings to books.
- ⭐ **Ratings & Feedback** – Rate books and see average ratings.
- 💬 **Comments System** – Engage with other readers via comments.
- 👍 **Upvote / 👎 Downvote** – Vote on reviews and comments.
- 🔍 **Search & Filter** – Quickly find books by title, author, or category.
- 🔄 **Redux State Management** – Manage UI and data states efficiently.
- 🌐 **Axios Instances** – Pre-configured API calls for better maintainability.
- 🛠 **Reusable Components** – Faster development and consistent design.

### 💻 Backend (Express.js)
- ⚡ **REST API** – Handles book, review, comment, and user-related endpoints.
- 📄 **Pagination** – Efficient server-side pagination for large datasets.
- 🚀 **Caching Layer** – Improves performance using in-memory cache (e.g., Redis or Node cache).
- 📤 **File Upload** – Supports book cover and profile image uploads with **Multer**.
- 🔐 **Authentication & Authorization** – Secures API endpoints with JWT-based auth.
- 🛡 **Validation** – Uses middleware for request validation to ensure data integrity.

---

## 🛠 Tech Stack

### Frontend
- **React Native** (Expo)
- **Redux** – State management
- **Axios** – API requests with instances
- **React Navigation** – Screen navigation
- **Pagination** – Efficient data loading
- **Custom Reusable Components**

### Backend
- **Node.js** + **Express.js**
- **Multer** – File uploads
- **JWT** – Authentication
- **Redis / Node-Cache** – Caching
- **MySQL / PostgreSQL / MongoDB** – Database (depending on setup)
- **Pagination Middleware** – Server-side pagination

---

## 📸 Screenshots

| Home Screen | Book Details | Add Review |
|-------------|--------------|------------|
| ![Home Screen](Screenshots/3.jpg) | ![Book Details](Screenshots/5.jpg) | ![Add Review](Screenshots/6.jpg) |

| Reviews List | Comment Section | Voting System |
|--------------|----------------|---------------|
| ![Reviews](Screenshots/7.jpg) | ![Comments](Screenshots/5.jpg) | ![Voting](Screenshots/4.jpg) |

| Login | Signup | User Profile | Password Change |
|-------|--------|--------------|-----------------|
| ![Login](Screenshots/1.jpg) | ![Signup](Screenshots/2.jpg) | ![Profile](Screenshots/8.jpg) | ![Forgot Password](Screenshots/9.jpg) |

## Backend Server: https://github.com/mr-ahabib/Book_Review_Backend
---

