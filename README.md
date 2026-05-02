# TaxEase — Full Stack Tax & Compliance Platform
### Built with MongoDB · Express.js · React.js · Node.js (MERN Stack)

---

## 📁 Project Structure

```
taxease/
├── backend/                    ← Node.js + Express API
│   ├── config/
│   │   ├── db.js               ← MongoDB connection
│   │   └── cloudinary.js       ← File upload config
│   ├── controllers/            ← Business logic (one file per resource)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── documentController.js
│   │   ├── filingController.js
│   │   ├── taskController.js
│   │   ├── chatController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── authMiddleware.js   ← JWT protect + role-based access
│   ├── models/                 ← Mongoose schemas
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Filing.js
│   │   ├── Task.js
│   │   ├── Message.js
│   │   └── Payment.js
│   ├── routes/                 ← Express routers (one file per resource)
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── filingRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── chatRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   ├── generateToken.js    ← JWT helper
│   │   └── sendEmail.js        ← Nodemailer helper
│   ├── server.js               ← Entry point
│   ├── .env.example            ← Copy to .env and fill in values
│   └── package.json
│
└── frontend/                   ← React + Vite + Tailwind CSS
    ├── src/
    │   ├── api/
    │   │   └── axios.js        ← Axios instance with JWT interceptor
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── UI.jsx      ← Reusable: Button, Input, Card, Badge...
    │   │   │   ├── Sidebar.jsx ← Collapsible sidebar navigation
    │   │   │   └── TopBar.jsx  ← Dashboard top bar
    │   │   ├── chat/
    │   │   │   └── ChatBox.jsx ← Reusable chat UI component
    │   │   ├── client/
    │   │   │   └── ClientLayout.jsx
    │   │   ├── admin/
    │   │   │   └── AdminLayout.jsx
    │   │   └── accountant/
    │   │       └── AccountantLayout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx ← Global auth state (login/logout/register)
    │   ├── hooks/
    │   │   └── useApi.js       ← useApi and useMutation custom hooks
    │   ├── pages/
    │   │   ├── HomePage.jsx    ← Public landing page
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── client/         ← Client dashboard pages
    │   │   │   ├── ClientDashboard.jsx
    │   │   │   ├── UploadDocuments.jsx
    │   │   │   ├── FilingHistory.jsx
    │   │   │   ├── PaymentsPage.jsx
    │   │   │   ├── ClientCalendar.jsx
    │   │   │   └── ClientChat.jsx
    │   │   ├── admin/          ← Admin dashboard pages
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── ManageClients.jsx
    │   │   │   ├── ManageFilings.jsx
    │   │   │   ├── ManageTasks.jsx
    │   │   │   └── AdminReports.jsx
    │   │   └── accountant/     ← Accountant dashboard pages
    │   │       ├── AccountantDashboard.jsx
    │   │       ├── AccountantTasks.jsx
    │   │       ├── ClientDocuments.jsx
    │   │       └── AccountantChat.jsx
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx  ← Auth + role guard
    │   ├── App.jsx             ← Root with all routes
    │   ├── main.jsx            ← React entry point
    │   └── index.css           ← Tailwind + global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

### 1. Clone & Setup Backend

```bash
cd taxease/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials (see section below)
nano .env
```

### 2. Configure .env

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taxease
JWT_SECRET=any_long_random_string_here
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=TaxEase <noreply@taxease.in>

CLIENT_URL=http://localhost:5173
```

### 3. Seed Demo Users (optional)

Run this in MongoDB Compass or Atlas Shell to create demo accounts:

```javascript
// Insert into your taxease.users collection
// Passwords will need to be pre-hashed; easier to register via the UI instead.
// Just register 3 accounts and manually set roles in Atlas:
// client@demo.com  → role: "client"
// admin@demo.com   → role: "admin"  
// ca@demo.com      → role: "accountant"
```

### 4. Start Backend

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

API runs at: `http://localhost:5000`

---

### 5. Setup Frontend

```bash
cd taxease/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, get JWT |
| GET | `/api/auth/me` | JWT | Get profile |
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/:id/assign` | Admin | Assign accountant |
| POST | `/api/documents/upload` | Client | Upload files |
| GET | `/api/documents` | JWT | Get documents |
| PUT | `/api/documents/:id/status` | Accountant | Verify doc |
| GET | `/api/filings` | JWT | Get filings |
| POST | `/api/filings` | Admin | Create filing |
| PUT | `/api/filings/:id` | Admin/Accountant | Update status |
| GET | `/api/tasks` | Admin/Accountant | Get tasks |
| POST | `/api/tasks` | Admin | Create task |
| PUT | `/api/tasks/:id` | Accountant | Update status |
| GET | `/api/chat/:userId` | JWT | Get messages |
| POST | `/api/chat/send` | JWT | Send message |
| GET | `/api/payments` | JWT | Get invoices |
| POST | `/api/payments` | Admin | Create invoice |
| PUT | `/api/payments/:id/pay` | Client | Pay invoice |

---

## 👥 User Roles & Access

| Feature | Client | Admin | Accountant |
|---------|--------|-------|------------|
| View own filings | ✅ | ✅ | ✅ |
| Upload documents | ✅ | ❌ | ❌ |
| Create filings | ❌ | ✅ | ❌ |
| Verify documents | ❌ | ✅ | ✅ |
| Assign tasks | ❌ | ✅ | ❌ |
| Update task status | ❌ | ✅ | ✅ |
| View all clients | ❌ | ✅ | ❌ |
| Chat with CA/Client | ✅ | ❌ | ✅ |
| Pay invoices | ✅ | ❌ | ❌ |
| Create invoices | ❌ | ✅ | ❌ |

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express.js — REST API server
- MongoDB + Mongoose — Database and ODM
- JWT (jsonwebtoken) — Authentication tokens
- bcryptjs — Password hashing
- Multer + Cloudinary — File upload handling
- Nodemailer — Email notifications
- express-async-handler — Clean async error handling

**Frontend**
- React 18 + React Router v6 — SPA + routing
- Vite — Fast dev server + bundler
- Tailwind CSS — Utility-first styling
- Axios — HTTP client with interceptors
- react-dropzone — Drag-and-drop file uploads
- react-hot-toast — Toast notifications
- lucide-react — Icon library

---

## 📦 Build for Production

```bash
# Build frontend
cd frontend && npm run build

# Serve frontend from backend (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/dist')));
# app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/index.html')));
```

---

## 📝 Notes

- File uploads use Cloudinary. For local storage demo, replace `config/cloudinary.js` with `multer.diskStorage`.
- Chat uses HTTP polling every 5 seconds. For real-time, add **Socket.io**.
- Payment gateway is mocked. Integrate **Razorpay** or **PayU** for real payments.
- Email reminders can be automated with `node-cron` (example in `utils/sendEmail.js`).
