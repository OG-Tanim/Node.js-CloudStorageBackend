# 📦 Storage Management System Backend Planning

## 🧭 Project Overview

This backend system is designed to power a **cloud-based personal storage management system**, where users can store, manage, and organize files such as notes (text/docs), images, and PDFs.

### Key Capabilities

- User Authentication (email/password, Google login)
- File and Folder Management
- Locked/Passcode-Protected Items
- Favorites and Recents
- Calendar-Based File Browsing
- Sharing via public links (read-only)
- Cloudinary for File Storage
- Profile Management
- Static Page APIs (About, Privacy, Terms)

## 🧱 System Architecture

```mermaid
graph TD
    A[Frontend Client]
    B[Express.js Backend]
    C[MongoDB Atlas]
    D[Cloudinary]
    E[Passport.js (Google Auth)]

    A -->|HTTP| B
    B --> C
    B --> D
    B --> E
```

## 📁 Modular Folder Structure

```
src/
├── config/            # DB, Cloudinary, Passport config
├── middlewares/       # Auth, error handling, validation
├── modules/           # Feature-based modules
│   ├── auth/
│   ├── user/
│   ├── file/
│   ├── folder/
│   ├── favorites/
│   ├── locked/
│   ├── calendar/
│   ├── static/
│   └── dashboard/
├── routes/            # Aggregated route definitions
├── utils/             # Helper utilities
├── types/             # Type definitions
└── app.ts             # Entry point
```

---

## 🔑 Authentication & Authorization

### Strategies

- **Email/Password** with JWT (expires in 7 days)
- **Google OAuth2** via Passport.js (access + refresh token)
- **Universal Lock Passcode** stored per user

### Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/google`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/logout`
- `GET /auth/me`

---

## 📂 File & Folder Management

### Entity Types

- Folder
- File (types: notes, images, PDFs)

### Common File Actions

- Upload, Rename, Copy, Duplicate, Delete
- Share (read-only public link)
- Move to/from Folder
- Toggle Favorite

### Endpoints

- `POST /folder`

- `GET /folder/user`

- `PATCH /folder/:id`

- `DELETE /folder/:id`

- `POST /file/upload`

- `GET /file/folder/:folderId`

- `GET /file/:id`

- `PATCH /file/:id`

- `POST /file/:id/copy`

- `POST /file/:id/duplicate`

- `POST /file/:id/share`

- `DELETE /file/:id`

---

## 🔒 Locked Page

- Universal passcode from frontend
- Files locked via flag and only visible after correct passcode

### Endpoints

- `POST /locked/set`
- `POST /locked/unlock`
- `GET /locked`

---

## ❤️ Favorites

### Endpoints

- `GET /favorites`
- `POST /favorites/:id`
- `DELETE /favorites/:id`

---

## 🗓️ Calendar

- Group files by `createdAt`

### Endpoints

- `GET /calendar/:date`

---

## 🧮 Dashboard & Storage Stats

- Default limit: **15GB per user**
- All uploads counted and accumulated

### Endpoints

- `GET /dashboard/usage`
- `GET /dashboard/summary`
- `GET /dashboard/recent`

---

## 👤 Profile Settings

- Update name, password, delete account

### Endpoints

- `PATCH /user/username`
- `PATCH /user/password`
- `DELETE /user`

---

## 📄 Static Page APIs

- `GET /static/about`
- `GET /static/privacy`
- `GET /static/terms`

---

## ⚙️ System Constraints

- Max storage: **15GB per user**
- Max file size: **100MB**
- Allowed file types: `.txt`, `.doc`, `.pdf`, `.jpg`, `.png`, `.webp`, jpeg
- Sharing: **Public Read-Only Links**
- Locked: **Universal Passcode per User**
- Google Auth: **Passport.js** with offline access

---

## ✅ Confirmed Decisions

- ✅ Use **Passport.js** for Google Auth
- ✅ Use **Cloudinary** for all file storage
- ✅ Use **JWT** for session management
- ✅ Read-only **public sharing**
- ✅ **Frontend handles previews**
- ✅ No admin role

---
