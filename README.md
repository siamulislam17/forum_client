# 📢 ForumNest – Client Side

🔗 **Live Site**: [https://forumnest-9712e.web.app/](https://forumnest-9712e.web.app/))

ForumNest is a modern forum website built using the **MERN stack**. It supports user authentication, post and comment interaction, admin dashboard, Stripe-based membership, and more.

---

## 🚀 Tech Stack

- **Frontend**: React.js (Vite)
- **Backend**: Express.js + MongoDB
- **Authentication**: Firebase Authentication
- **Authorization**: JWT with Firebase Admin SDK
- **Database**: MongoDB Atlas
- **Payment Gateway**: Stripe

---

## 🧩 Features

### 🧑‍💻 General Users
- Register and login (email/password or Google)
- Create, read, upvote/downvote posts
- Comment on posts
- Report inappropriate comments
- View latest announcements
- Dark mode / light mode toggle
- Purchase membership via Stripe

### 🛠️ Admin Panel
- Manage users (add/remove admin roles)
- See pending/active riders (if used for parcel context)
- Publish announcements
- Monitor reported comments
- View dashboard summary

---

## 📦 NPM Packages Used

### 🔧 Core
- `react`, `react-dom`
- `react-router-dom`
- `axios`
- `firebase`
- `jsonwebtoken`

### 🎨 UI & Styling
- `tailwindcss`
- `daisyui`
- `clsx`
- `react-icons`
- `sweetalert2`
- `moment`

### 🔄 State & Server
- `@tanstack/react-query` – for async data fetching and caching

### 💳 Payments
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`

---

## 🔐 Auth & Security

- Firebase Authentication handles login and token issuance.
- JWT tokens are generated on the server using Firebase Admin SDK.
- Tokens are stored in localStorage and sent with secure Axios requests.
- Protected routes are implemented for both user and admin access.

---

## 🌱 .env Setup (Client)

Create a `.env` file in the root:

