# ConnectVerse 🚀

> A full-stack, production-ready social media application built with the MERN stack.

<!-- ![App Screenshot] -->

## 🌐 Live Demo

- **Frontend (Client):** [https://connect-verse.pages.dev](https://connect-verse.pages.dev)
- **Backend (API):** [https://connect-verse-agkg.onrender.com](https://connect-verse-agkg.onrender.com)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT Authentication:** Secure stateless authentication with HTTP headers.
- **Password Hashing:** `bcryptjs` used for salting and hashing passwords.
- **Protected Routes:** Middleware to protect private API endpoints and React pages.

### 📝 Content Management

- **Create Posts:** Rich text support with image uploads via **Cloudinary**.
- **Feed Algorithm:** Dynamic feed fetching posts sorted by recency.
- **Interactions:** Optimistic UI updates for Likes and Comments (instant feedback).
- **Delete Posts:** Ownership verification ensures users can only delete their own content.

### 🤝 Social Graph

- **Follow System:** Complex Many-to-Many relationship handling for Followers/Following.
- **User Discovery:** Debounced live search functionality to find users by username.
- **Suggestions:** Sidebar logic to display network connections.

### 👤 User Profile

- **Profile Management:** Update Bio, Profile Picture, and Personal Details.
- **Account Settings:** Secure password change and email update flows.
- **Dashboard:** Specific views for User's own posts and network stats.

### 🔔 Notifications

- **Activity Tracking:** Real-time database records for Likes, Comments, and Follows.
- **Management:** Ability to view and clear notification history.

### 🎨 UI/UX

- **Responsive Design:** Mobile-first approach with a Bottom Navigation Bar for small screens and a Sidebar for desktops.
- **Skeleton Loaders:** Enhanced UX during data fetching states.
- **Toast Notifications:** `react-hot-toast` for non-intrusive success/error alerts.

---

## 🛠 Tech Stack

### Frontend (Client)

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API (Global Auth State)
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **HTTP Client:** Native Fetch API with custom configuration

### Backend (Server)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Storage:** Cloudinary (Image CDN)
- **Authentication:** JSON Web Tokens (JWT)
- **Middleware:** Multer (File Handling), Cors, Dotenv

---

## 🏗 Architecture

The project follows a **Monorepo** structure separating the Client and Server logic while keeping them in a single repository for easier development.

```text
ConnectVerse/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── package.json
└── README.md

```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas Account
- Cloudinary Account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HemJoshi111/connect-verse.git
   cd ConnectVerse
   ```

2. **Install Backend Dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```
4. **Setup Environment Variables Create a ` .env` file in the `server` folder (see below).**

5. **Run the App**
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory with the following keys:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📡 API Reference

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/me` - Get current user

### Posts

- `POST /api/posts/create` - Create a new post (Text/Image)
- `GET /api/posts/all` - Get all posts for feed
- `POST /api/posts/like/:id` - Like/Unlike a post
- `POST /api/posts/comment/:id` - Comment on a post
- `DELETE /api/posts/:id` - Delete a post

### Users

- `GET /api/users/:id` - Get user profile
- `POST /api/users/follow/:id` - Follow/Unfollow user
- `GET /api/users/search/:query` - Search users
- `PUT /api/users/update` - Update profile (Bio/Avatar)

### Notifications

- `GET /api/notifications` - Get user notifications
- `PDELETE /api/notifications` - Clear all notifications

## ☁️ Deployment

The application follows a decoupled deployment strategy:

- **Frontend**: Deployed on **_Cloudflare_** Pages for global edge performance.\*
- **Backend**: Deployed on **_Render_** (Web Service).
- **Database**: Hosted on **_MongoDB Atlas_**.

> Developed by **Hem Joshi** **_Computer Engineer & Full Stack Developer_**
