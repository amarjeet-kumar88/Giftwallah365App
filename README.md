# 🎁 Giftwallah365

<p align="center">
  <strong>A Full-Stack Online Gift Shopping Platform</strong>
</p>

<p align="center">
  Built with Next.js, TypeScript, Express.js, Node.js and MongoDB
</p>

---

## 📖 About The Project

**Giftwallah365** is a full-stack e-commerce web application designed for buying and managing gift products online.

The project follows a separate **Frontend + Backend architecture**, where the frontend is developed using **Next.js and TypeScript**, while the backend provides REST APIs using **Node.js and Express.js**.

The application includes user authentication, product management, categories, cart functionality, order management, image uploads, online payments and an admin dashboard.

> 🚧 This project is currently maintained as a development/portfolio project and does not have a public live demo at the moment.

---

## ✨ Features

### 👤 User Features

- 🔐 User Registration & Login
- 👤 User Profile
- 🛍️ Browse Products
- 🏷️ Product Categories
- 🔎 Product Search
- 📦 Product Details
- 🛒 Add to Cart
- ➕ Increase / Decrease Cart Quantity
- ❌ Remove Products from Cart
- 💳 Online Payment
- 📋 Order Management
- 📱 Responsive Design

### 👨‍💼 Admin Features

- 🔐 Admin Authentication
- 📊 Admin Dashboard
- ➕ Add Products
- ✏️ Update Products
- 🗑️ Delete Products
- 🏷️ Category Management
- 📦 Order Management
- 👥 User Management
- 🖼️ Product Image Upload
- 🔒 Protected Admin Routes

---

# 🛠️ Tech Stack

## Frontend

| Technology | Usage |
|---|---|
| Next.js | Frontend Framework |
| React.js | UI Development |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| JavaScript | Application Logic |
| HTML5 | Structure |
| CSS3 | Styling |

## Backend

| Technology | Usage |
|---|---|
| Node.js | Backend Runtime |
| Express.js | REST API |
| MongoDB | Database |
| JWT | Authentication |
| REST API | Client-Server Communication |

## Services & Tools

| Technology | Usage |
|---|---|
| Cloudinary | Product Image Storage |
| Razorpay | Online Payments |
| Git | Version Control |
| GitHub | Source Code Management |
| Vercel | Frontend Deployment |

---

# 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Next.js         │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                          REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Express.js      │
                    │       Backend        │
                    └───────┬──────┬───────┘
                            │      │
                ┌───────────┘      └────────────┐
                ▼                               ▼
        ┌───────────────┐               ┌──────────────┐
        │    MongoDB    │               │  Cloudinary  │
        │   Database    │               │    Images    │
        └───────────────┘               └──────────────┘
                                               
                         ┌──────────────┐
                         │   Razorpay   │
                         │   Payments   │
                         └──────────────┘
```

---

# 📂 Project Structure

```text
Giftwallah365App/
│
├── backend/
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── hooks/
│   ├── lib/
│   ├── utils/
│   ├── .env.local
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> Folder names may vary depending on the current implementation.

---

# 🚀 Getting Started

Follow the steps below to run the project locally.

## 📋 Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- Git
- MongoDB / MongoDB Atlas account
- Cloudinary account
- Razorpay account

You can verify Node.js and npm:

```bash
node --version
npm --version
```

Verify Git:

```bash
git --version
```

---

# 📥 1. Clone The Repository

Open your terminal or PowerShell.

Go to the GitHub repository and copy the URL from:

**Code → HTTPS → Copy**

Repository:

:contentReference[oaicite:0]{index=0}

Then run:

```bash
git clone <REPOSITORY_URL>
```

Example:

```bash
cd Giftwallah365App
```

---

# 📦 2. Install Frontend Dependencies

Open the project:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 3. Frontend Environment Variables

Inside the `frontend` folder create:

```text
.env.local
```

Add your frontend environment variables.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Important

Do not upload `.env.local` to GitHub.

Make sure your `.gitignore` contains:

```gitignore
.env
.env.local
.env.*.local
```

---

# 🟢 4. Start Frontend

From the `frontend` directory:

```bash
npm run dev
```

The Next.js development server will start on:

```text
http://localhost:3000
```

Open it in your browser.

---

# 🔧 5. Install Backend Dependencies

Open a **new terminal**.

Go to the project:

```bash
cd Giftwallah365App
```

Then:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 6. Backend Environment Variables

Inside the `backend` folder create:

```text
.env
```

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### ⚠️ Security Warning

Never commit real credentials to GitHub.

❌ Never do this:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

Instead use:

```env
MONGODB_URI=your_mongodb_connection_string
```

Also never expose:

- Database passwords
- JWT secrets
- Cloudinary API secrets
- Razorpay secret keys
- Private API keys

---

# ▶️ 7. Start Backend

From the `backend` directory:

```bash
npm run dev
```

If the project uses a different development script, check:

```bash
npm run
```

The backend API will normally run on:

```text
http://localhost:5000
```

---

# 🔄 Running The Complete Project

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd Giftwallah365App/backend
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd Giftwallah365App/frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🔐 Authentication

The application uses authentication to protect user and admin resources.

General authentication flow:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Backend API
  │
  ▼
Validate Credentials
  │
  ▼
Generate Authentication Token
  │
  ▼
Authenticated User
```

Protected resources are accessible only to authenticated users.

Admin functionality is protected separately through authorization.

---

# 🛒 Shopping Flow

```text
Browse Products
       │
       ▼
Product Details
       │
       ▼
Add To Cart
       │
       ▼
Review Cart
       │
       ▼
Checkout
       │
       ▼
Payment
       │
       ▼
Order Created
       │
       ▼
Order Confirmation
```

---

# 💳 Payment Integration

Razorpay is used for online payment processing.

General payment flow:

```text
Customer
   │
   ▼
Checkout
   │
   ▼
Create Payment Order
   │
   ▼
Razorpay
   │
   ▼
Payment
   │
   ▼
Payment Verification
   │
   ▼
Order Confirmation
```

---

# ☁️ Image Upload

Cloudinary is used for storing product images.

```text
Admin
  │
  ▼
Select Product Image
  │
  ▼
Backend
  │
  ▼
Cloudinary
  │
  ▼
Image URL
  │
  ▼
MongoDB
  │
  ▼
Frontend
```

---

# 🛡️ Security

The project uses common security practices such as:

- Authentication
- Authorization
- Protected routes
- JWT-based authentication
- Environment variables
- API validation
- Secure payment verification
- Admin route protection

> Security configuration should always be reviewed before using the application in production.

---

# 📱 Responsive Design

The frontend is designed to work across different screen sizes:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📟 Tablet

---

# 🧪 Useful Development Commands

## Frontend

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

## Backend

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

> Available commands depend on the scripts defined in each `package.json`.

---

# 🌐 Deployment

## Frontend

The Next.js frontend can be deployed using platforms such as:

- Vercel
- Netlify
- Other Next.js-compatible hosting platforms

## Backend

The Express.js backend can be deployed using:

- Render
- Railway
- AWS
- Other Node.js-compatible hosting platforms

Before deployment, configure production environment variables in the hosting platform.

---

# 🔑 Environment Variables Summary

## Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
```

## Backend `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

> ⚠️ Environment variable names must match the names actually used in the project's source code.

---

# 🧑‍💻 Author

## Amarjeet Kumar

B.Tech Computer Science & Engineering

### Connect With Me

- GitHub: :contentReference[oaicite:1]{index=1}
- LinkedIn: :contentReference[oaicite:2]{index=2}

---

# ⭐ Show Your Support

If you find this project useful or interesting, consider giving the repository a ⭐.

---

# 📄 License

This project is created for learning, development and portfolio purposes.

---

<p align="center">
  Made with ❤️ by <strong>Amarjeet Kumar</strong>
</p>
