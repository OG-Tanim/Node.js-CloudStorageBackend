# 📦 Node.js Cloud Storage Backend

A robust, secure, and scalable backend system built with **Express**, **MongoDB**, and **TypeScript**. It provides comprehensive functionalities for managing files, folders, and user access, including secure uploads, sharing, locking, and more. Designed for high performance and maintainability.

---

## ✨ Key Features

This backend system offers a rich set of features to manage cloud storage efficiently and securely.

### 🔐 Authentication & Security

- **JWT-based Authentication:** Secure access control for all private routes.
- **Local Signup/Login:** Standard user registration and login with hashed passwords.
- **Google OAuth 2.0:** Seamless integration via Passport.js for social logins.
- **Password Recovery:** Secure forgot/reset password functionality with tokens.
- **Route Protection:** Middleware (`requireAuth`) ensures only authenticated users access specific endpoints.
- **API Rate Limiting:** `publicApiLimiter` protects public APIs from abuse.

### 👤 User Profile Management

- **View Current User:** Access user details via `/auth/profile`.
- **Update Profile:** Change username and password.
- **Account Management:** Options to delete user account.
- **File Passcode:** Set a personal passcode (`filePasscode`) for enhanced file security.

### 🗂️ File Management

Comprehensive file handling capabilities, including uploads, organization, and access control.

- **Cloudinary Integration:** Securely upload various file types (images, PDFs, notes).
- **File Operations:** Rename, duplicate, delete, or mark files as favorites.
- **Categorized Retrieval:** Get files filtered by folder or specific file type.

#### 🔒 Locked Files

- **Passcode Protection:** Requires a `x-file-passcode` header for access.
- **Hidden from Listings:** Not visible in general file listings.

#### 🌐 Public Sharing

- **Shareable Links:** Generate unique, public read-only links for files.
- **Slug-based Access:** Public access via a unique slug, with built-in rate limiting.

#### 🗓️ File Calendar

- **Date-based Retrieval:** Fetch files created on a specific date (`D-MM-YYYY`).
- **Month-based Retrieval:** Retrieve files created within a specific month (`MM-YYYY`).

### 📁 Folder Management

Organize files effectively with robust folder operations.

- **CRUD Operations:** Create, rename, and delete folders.
- **Nested Folders:** Support for hierarchical folder structures.
- **Flexible Retrieval:** Fetch all folders for a user or individual folders by ID.

### 📊 Dashboard & Statistics

Gain insights into storage usage and recent activity.

- **Storage Metrics:** Track total storage used against the allocated limit.
- **File Type Breakdown:** View file counts and sizes categorized by type.
- **Folder Metadata:** Access count and size information for folders.
- **Recent Activity:** Display the 10 most recently uploaded or modified files.

### 📑 Static Pages

Manage dynamic content for informational pages.

- **Predefined Routes:** `/static/about`, `/static/privacy`, `/static/terms`.
- **MongoDB Storage:** Content is stored in MongoDB for easy updates.
- **Flexible Updates:** Content can be updated via database operations or a seed script.

---

## 🧪 API Endpoints Summary

All API endpoints are prefixed with `/api`. For example, the signup endpoint is `POST /api/auth/signup`.

### 🔐 Auth (`/api/auth`)

| Method | Endpoint                              | Description                               |
| :----- | :------------------------------------ | :---------------------------------------- |
| `POST` | `/signup`, `/login`                   | User registration and authentication      |
| `POST` | `/forgot-password`, `/reset-password` | Initiate and complete password reset flow |
| `GET`  | `/profile`                            | Retrieve details of the current user      |
| `POST` | `/logout`                             | Invalidate user session                   |
| `GET`  | `/google`                             | Initiate Google OAuth authentication      |

### 👤 Users (`/api/user`)

| Method   | Endpoint           | Description                              |
| :------- | :----------------- | :--------------------------------------- |
| `PATCH`  | `/update-username` | Update the authenticated user's username |
| `PATCH`  | `/change-password` | Change the authenticated user's password |
| `DELETE` | `/delete-account`  | Permanently remove the user account      |
| `PATCH`  | `/set-passcode`    | Set or update the file lock passcode     |

### 🗂️ Files (`/api/files`)

| Method   | Endpoint          | Description                                               |
| :------- | :---------------- | :-------------------------------------------------------- |
| `POST`   | `/upload`         | Upload a new file to Cloudinary                           |
| `GET`    | `/root`           | Get files within root                                     |
| `GET`    | `/root/:folderId` | Get files within a specific folder or root                |
| `GET`    | `/type/:type`     | Retrieve files filtered by their type                     |
| `GET`    | `/locked`         | Get all locked files (requires `x-file-passcode`)         |
| `GET`    | `/favorites`      | Retrieve all files marked as favorite                     |
| `GET`    | `/date/:date`     | Get files created on a specific date (`DD-MM-YYYY`)       |
| `GET`    | `/month/:month`   | Get files created in a specific month (`MM-YYYY`)         |
| `GET`    | `/:id`            | Get a single file by its ID (`checkFileAccess` applied)   |
| `DELETE` | `/:id`            | Delete a file by its ID                                   |
| `PATCH`  | `/:id/rename`     | Rename a file by its ID                                   |
| `PATCH`  | `/:id/toggle`     | Toggle favorite or lock status of a file                  |
| `POST`   | `/:id/duplicate`  | Create a duplicate of an existing file                    |
| `POST`   | `/:id/share`      | Generate a public shareable link for a file               |
| `GET`    | `/public/:slug`   | Access a publicly shared file via its slug (rate limited) |

### 📁 Folders (`/api/folders`)

| Method   | Endpoint      | Description                               |
| :------- | :------------ | :---------------------------------------- |
| `POST`   | `/`           | Create a new folder                       |
| `GET`    | `/`           | Retrieve all folders for the current user |
| `GET`    | `/:id`        | Get a single folder by its ID             |
| `PATCH`  | `/:id/rename` | Rename a folder by its ID                 |
| `DELETE` | `/:id`        | Delete a folder by its ID                 |

### 📊 Dashboard (`/api/dashboard`)

| Method | Endpoint   | Description                                  |
| :----- | :--------- | :------------------------------------------- |
| `GET`  | `/stats`   | Get storage usage statistics                 |
| `GET`  | `/recents` | Retrieve the 10 most recently accessed files |

### 📄 Static Pages (`/api/static`)

| Method | Endpoint   | Description                                        |
| :----- | :--------- | :------------------------------------------------- |
| `GET`  | `/about`   | Retrieve content for the About page                |
| `GET`  | `/privacy` | Retrieve content for the Privacy Policy page       |
| `GET`  | `/terms`   | Retrieve content for the Terms and Conditions page |

---

## 🏗 Folder Structure

```
src/
├── app.ts                  # Express application setup
├── server.ts               # Server entry point
├── config/                 # Database, Cloudinary, and environment configurations
│   ├── cloudinary.ts
│   ├── db.ts
│   └── env.ts
├── middlewares/            # Express middleware functions
│   ├── checkFileAccess.ts  # Middleware to verify file access permissions
│   ├── errorHandler.ts     # Centralized error handling middleware
│   ├── fileUpload.ts       # Middleware for handling file uploads (Multer)
│   ├── rateLimiter.ts      # API rate limiting middleware
│   ├── requireAuth.ts      # Authentication middleware for protected routes
│   └── validateStaticPageKey.ts # Middleware for static page key validation
├── models/                 # Mongoose schemas and models
│   ├── File.ts
│   ├── Folder.ts
│   ├── SharedLink.ts
│   ├── StaticPage.ts
│   └── User.ts
├── modules/                # Main business logic, organized by feature
│   ├── auth/               # Authentication module (signup, login, password reset, OAuth)
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   └── strategies/
│   │       └── googleStrategy.ts # Google OAuth strategy
│   ├── user/               # User profile management module
│   │   ├── user.controller.ts
│   │   ├── user.route.ts
│   │   └── user.service.ts
│   │   └── user.validation.ts
│   ├── file/               # File management module (upload, CRUD, sharing, locking)
│   │   ├── file.controller.ts
│   │   ├── file.route.ts
│   │   ├── file.service.ts
│   │   ├── file.utils.ts   # Utility functions for file operations
│   │   └── file.validation.ts
│   ├── folder/             # Folder management module (CRUD, nesting)
│   │   ├── folder.controller.ts
│   │   └── folder.route.ts
│   ├── dashboard/          # Dashboard and statistics module
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.routes.ts
│   │   └── dashboard.service.ts
│   └── static/             # Static pages content management
│       ├── static.controller.ts
│       └── static.routes.ts
├── utils/                  # General utility functions
│   ├── jwt.ts              # JWT token generation and verification
│   └── sendResponse.ts     # Standardized API response helper
scripts/                    # Utility scripts
└── seedStaticPages.ts      # Script to seed initial static page content
```

---

## ⚙️ Setup Instructions

Follow these steps to get the Node.js Cloud Storage Backend running on your local machine.

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/Node.js-CloudStorageBackend.git
    cd Node.js-CloudStorageBackend
    ```

2.  **Install Dependencies**

    Ensure you have Node.js and npm installed.

    ```bash
    npm install
    ```

3.  **Create `.env` file**

    Create a `.env` file in the root directory of the project based on the `.env.example` file. This file will store your environment variables.

4.  **Seed Static Pages (Optional)**

    If you want to populate the static pages (About, Privacy, Terms) with initial content, run the seed script and populate the content field to your liking:

    ```bash
    npm run seed:static
    ```

5.  **Start Development Server**

    ```bash
    npm run dev
    ```

    The server will typically run on `http://localhost:3000` (or the `PORT` specified in your `.env` file).

---

## 🧪 Running Tests

This project is ready to run unit tests to ensure reliability and correctness.

To run all tests:

```bash
npm test
```

Tests can be created in the `tests/` directory, mirroring the `src/` folder structure.

---

## 🚨 Error Handling

The backend implements a centralized error handling mechanism using Express middleware (`errorHandler.ts`).

Key aspects:

- **Global Error Middleware:** Catches unhandled errors and sends standardized JSON responses.
- **Custom Error Classes:** Specific error types (e.g., `ApiError`, `NotFoundError`) are used for better error categorization and handling.
- **Validation Errors:** Input validation errors (e.g., from Zod) are caught and returned with clear messages.
- **Logging:** Errors are logged to assist in debugging and monitoring.

---

## 🚀 Performance Considerations

While specific optimizations are implemented within the code, here are general considerations for performance:

- **Efficient Database Queries:** Mongoose queries are optimized to fetch only necessary data and utilize indexing.
- **Rate Limiting:** Prevents abuse and ensures fair resource allocation.
- **Asynchronous Operations:** Leveraging Node.js's non-blocking I/O for concurrent operations.
- **Cloudinary Optimization:** Cloudinary handles image and file optimization, reducing server load.

---

## 🤝 Contributing

We welcome contributions to improve this project! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and ensure tests pass.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

## 🧱 Technologies Used

- **TypeScript:**
- **Node.js + Express:**
- **MongoDB + Mongoose:**
- **Cloudinary:**
- **Passport.js:**
- **Zod:**
- **JWT (JSON Web Tokens):**
- **Multer:**
- **bcryptjs:**

---

## 🛡 Security Notes

- **JWT Authentication:**
- **File Access Protection:**
- **Password & Passcode Hashing:**
- **Public API Rate Limiting:**
- **Secure Cloud Storage:**

---

## 📝 License

- MIT License © 2025
