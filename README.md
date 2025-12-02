# 🚀 Student Attendance & Performance Management API

This is a fully functional REST API built with the MERN stack (MongoDB, Express.js, Node.js) for managing student, teacher, attendance, and academic performance data for an educational institution.

---

## ✨ Features

* **Authentication:** JWT-based login and registration for Admin, Teacher, and Student roles.
* **Role-Based Access Control (RBAC):** Middleware protecting routes based on user roles.
* **CRUD Systems:** Management APIs for Students and Teachers.
* **Data Capture:** Endpoints for Teachers to submit daily attendance and subject-wise marks.
* **Querying:** Search, filters, and pagination implemented on listing routes (`/api/students?search=...`).
* **File Upload:** Profile picture upload using **Multer** and **Cloudinary**.
* **Reports:** Aggregation endpoints for dashboard analytics and student performance.

---

## 💻 Tech Stack

* **Backend Framework:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose ORM)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Deployment:** Render / Railway
* **File Storage:** Cloudinary

---

## 🔌 API Endpoints Documentation

| Module | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Create new user (Admin/Teacher/Student) |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate and get JWT token |
| **Students** | `GET` | `/api/students?page=1&limit=10` | Admin, Teacher | List students with search/pagination |
| **Attendance**| `POST`| `/api/attendance/mark` | Teacher | Mark a student's attendance |
| **Marks** | `POST` | `/api/marks` | Teacher | Submit marks for a student |
| **Reports** | `GET` | `/api/reports/top-performers` | Admin, Teacher | Get ranking based on average score |
| **Upload** | `POST` | `/api/upload` | Private | Upload file to Cloudinary |

---

## 🛠️ Setup and Installation (Local)

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR-REPO-URL]
    cd student-management-api
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```
    MONGO_URI=your_mongodb_atlas_uri
    JWT_SECRET=a_very_secret_key
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    ```
4.  **Run the Server:**
    ```bash
    npm run dev
    ```

---

## 🔗 Live Deployment

The API is currently hosted on Render/Railway and is fully operational.

**Live API Base URL:** `[YOUR RENDER/RAILWAY URL HERE]`