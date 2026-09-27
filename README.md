Personal Book Manager

A full-stack MERN application built with Next.js, Node.js/Express, MongoDB, and Tailwind CSS. Personal Book Manager provides readers with a clean, intuitive, and focused interface to manage their personal book collections, track reading habits, and filter books by tags and statuses.

🚀 Features
Authentication & Authorization
Secure Sign Up, Log In, and Log Out functionality using JSON Web Tokens (JWT).
Protected routes and secure API endpoints to ensure user data privacy.

Book Collection Management
Add Books: Add new titles with author details, tags, and current reading status.
Edit & Delete: Update book information or remove books from the collection seamlessly.
Status Tracking: Categorize books into three distinct statuses:
📖 Want to Read
📘 Reading
✅ Completed
Filtering & Search: Filter books by specific tags or reading status for quick access.

Dashboard Insights
Clean, clutter-free dashboard surfacing collection statistics (total books count, status summaries).
Direct action controls to mark reading progress directly from the dashboard.

🛠️ Tech Stack
Frontend: Next.js (App Router), React.js, Tailwind CSS
Backend: Node.js, Express.js / Next.js API Routes
Database: MongoDB & Mongoose (MongoDB Atlas)
Authentication: JSON Web Tokens (JWT) & bcrypt.js
Deployment: Vercel (Frontend & API) + MongoDB Atlas (Database)

📂 Project Structure
personal-book-manager/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and layout
│   ├── components/         # Reusable UI components (Dashboard, BookCard, Auth Forms)
│   ├── lib/                # Database configuration, middleware, and utility functions
│   ├── models/             # Mongoose schemas (User, Book)
│   └── types/              # TypeScript interfaces/types
├── .env.example            # Environment variable template
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation

⚙️ Getting StartedPrerequisites

Ensure you have the following installed on your machine:
Node.js (v18.x or higher)
npm or yarn
A MongoDB Atlas account or local MongoDB instance.
Installation
Clone the Repository
git clone https://github.com/DarthCoder92/personal-book-manager.git
cd personal-book-manager
Install Dependencies
npm install
Configure Environment Variables

Create a .env.local file in the root directory based on .env.example:
cp .env.example .env.local
Run the Development Server
npm run dev
Open [link removed] in your browser to view the app.
🔑 Environment Variables (.env.example)

Include the following key-value pairs in your .env.local or host settings:
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/personal_book_manager?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here


GitHub Repository: https://github.com/DarthCoder92/personal-book-manager