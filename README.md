# 🎓 Course Management System

A full-stack course management application built with React, Node.js, Express, and PostgreSQL/Prisma. Features JWT authentication, role-based access control, complete course CRUD operations, and enrollment management.

## ✨ Features

### Authentication & Authorization

- User Registration with email verification
- Secure Login with JWT tokens
- Role-Based Access Control (ADMIN / USER)
- Password hashing with bcrypt
- Automatic token expiration handling

### Course Management

- Browse all available courses
- Create courses (Admin only)
- Update course details (Admin only)
- Delete courses (Admin only)
- View course details
- Responsive course cards

### Enrollment System

- Enroll in available courses
- View enrolled courses
- Track enrollment history
- Prevent duplicate enrollments

### User Interface

- Clean, modern design with Tailwind CSS
- Responsive layouts for all devices
- Navigation bar with user menu
- Protected routes for authenticated users
- Admin panel for course management

### API Documentation

- Swagger documentation
- Interactive API testing

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **API Docs**: Swagger/OpenAPI

### Frontend

- **Library**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v7

---

## 📁 Project Structure

```
Course-Management-System/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Database connection
│   │   │   └── swagger.js         # Swagger configuration
│   │   ├── controllers/           # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── course.controller.js
│   │   │   └── enrollment.controller.js
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── routes/               # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── course.routes.js
│   │   │   └── enrollment.routes.js
│   │   ├── validations/
│   │   │   └── auth.validation.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Navigation bar
    │   │   ├── CourseCard.jsx     # Course display card
    │   │   └── Footer.jsx         # Footer component
    │   ├── pages/
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Register.jsx       # Registration page
    │   │   ├── Dashboard.jsx      # Main courses page
    │   │   ├── CourseDetail.jsx   # Single course view
    │   │   ├── MyEnrollments.jsx  # User's courses
    │   │   └── AdminPanel.jsx     # Admin management
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx # Auth-protected routes
    │   ├── services/
    │   │   └── api.js             # API client configuration
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables** (`.env` file provided)

```env
DATABASE_URL="postgresql://postgres:Ankit@    123@localhost:5432/course_management"
JWT_SECRET="supersecretkey"
PORT=5001
```

4. **Initialize database**

```bash
npx prisma migrate dev --name init
npx prisma db push
```

5. **Start development server**

```bash
npm run dev
```

Backend runs on: `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📚 API Endpoints

### Authentication

```
POST   /api/v1/auth/register      - Register new user
POST   /api/v1/auth/login         - Login user
```

### Courses

```
GET    /api/v1/courses            - Get all courses
GET    /api/v1/courses/:id        - Get single course
POST   /api/v1/courses            - Create course (Admin)
PUT    /api/v1/courses/:id        - Update course (Admin)
DELETE /api/v1/courses/:id        - Delete course (Admin)
```

### Enrollments

```
POST   /api/v1/enrollments/:courseId     - Enroll in course
GET    /api/v1/enrollments/my-courses    - Get user enrollments
```

### Documentation

```
GET    /api-docs                  - Swagger UI
```

---

## 🔐 Authentication Flow

1. **Register**: User creates account with email and password
2. **Login**: Credentials validated, JWT token issued
3. **Token Storage**: Token saved in localStorage
4. **Requests**: Token automatically attached to all API requests
5. **Token Expiration**: 1 day validity, automatic redirect on expiration

---
# 🔐 Advanced Authentication Features

The Course Management System includes advanced authentication and account security features to enhance user protection and improve authentication reliability.

---

# 📧 Email OTP Verification (Brevo API Integration)

To ensure only valid users can register, the system supports Email OTP Verification using the Brevo Email API.

## Features

* OTP sent to user's registered email
* Secure email verification flow
* Prevents fake account registrations
* OTP validation before account activation
* Environment-based API key management

---

## 🔄 OTP Verification Flow

```text id="0h7e2k"
User Registration
      ↓
Generate OTP
      ↓
Send OTP via Brevo API
      ↓
User Enters OTP
      ↓
OTP Validation
      ↓
Account Verified Successfully
```

---

## ⚙️ Required Environment Variables

```env id="mjw5qs"
BREVO_API_KEY=your_brevo_api_key

BREVO_SENDER_EMAIL=your_verified_email

BREVO_SENDER_NAME=Course Management System
```

---

# 🔑 Forgot Password Functionality

The application supports secure password reset functionality through email verification.

## Features

* Forgot password request API
* Secure reset token generation
* Password reset email delivery
* Token expiration handling
* Secure password update flow

---

## 🔄 Forgot Password Flow

```text id="0g8x7r"
User Clicks Forgot Password
        ↓
Enter Registered Email
        ↓
Generate Reset Token
        ↓
Send Reset Link via Email
        ↓
User Opens Reset Link
        ↓
Create New Password
        ↓
Password Updated Successfully
```

---

# 🔒 Change Password Functionality

Authenticated users can securely change their password from their account dashboard.

## Features

* Verify old password before update
* Secure password hashing using bcrypt
* Protected route access
* JWT authentication required

---

## 🔄 Change Password Flow

```text id="s84a91"
User Logged In
      ↓
Enter Current Password
      ↓
Enter New Password
      ↓
Verify Existing Password
      ↓
Hash New Password
      ↓
Password Updated Successfully
```

---

# 🛡️ Security Improvements

* Secure JWT Authentication
* Password Hashing using bcrypt
* Email Verification System
* Protected Password Reset Flow
* Token Expiration Handling
* Input Validation using Zod
* Centralized Error Handling

---

# 📌 Additional Authentication APIs

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| POST   | /api/v1/auth/send-otp        | Send email OTP           |
| POST   | /api/v1/auth/verify-otp      | Verify email OTP         |
| POST   | /api/v1/auth/forgot-password | Send otp                 |
| POST   | /api/v1/auth/reset-password  | Reset password           |
| PUT    | /api/v1/auth/change-password | Change current password  |

---

# 🚀 Future Enhancements

* OTP Expiration Timer
* Resend OTP Feature
* Multi-Factor Authentication (MFA)
* Refresh Token Authentication
* Redis-based OTP Storage
* Rate Limiting for OTP APIs
* Queue-Based Email Delivery System


## 👥 User Roles

### ADMIN

- ✅ Create, read, update, delete courses
- ✅ View admin panel
- ✅ Manage all courses
- ✅ View all enrollments

### USER

- ✅ Browse courses
- ✅ Enroll in courses
- ✅ View enrolled courses
- ✅ View course details
- ❌ Cannot create/edit/delete courses

---

## 🎯 Usage Guide

### For New Users

1. **Register**
   - Click "Register" on login page
   - Fill in name, email, password
   - Select USER role
   - Click Register

2. **Login**
   - Enter email and password
   - Click Login button

3. **Browse Courses**
   - View courses on Dashboard
   - Click "View Details" for more info
   - Click "Enroll" to enroll

4. **Manage Enrollments**
   - Click "My Enrollments" in navbar
   - View all enrolled courses
   - Click course to view details

### For Admins

1. **Setup**
   - During registration, select ADMIN role
   - Login with admin credentials

2. **Manage Courses**
   - Click "Admin Panel" in navbar
   - Create new courses
   - Edit existing courses
   - Delete courses

---

## 🧪 Testing

### Manual Testing with API

```bash
# Register
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456","role":"USER"}'

# Login
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Get Courses
curl http://localhost:5001/api/v1/courses
```

---

## 🔧 Development

### Adding New Features

1. **Backend Feature**
   - Create controller in `src/controllers/`
   - Add routes in `src/routes/`
   - Update Prisma schema if needed
   - Run migration: `npx prisma migrate dev`

2. **Frontend Feature**
   - Create component in `src/components/`
   - Create page in `src/pages/`
   - Update routes in `App.jsx`
   - Add API calls to `src/services/api.js`

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name feature_name

# Reset database (dev only)
npx prisma migrate reset
```

---

## 🐛 Troubleshooting

| Issue                      | Solution                                      |
| -------------------------- | --------------------------------------------- |
| Database connection failed | Check PostgreSQL running, verify DATABASE_URL |
| Token expired              | Login again, token valid for 1 day            |
| CORS error                 | Ensure frontend URL is http://localhost:5173  |
| Port 5001 in use           | Change PORT in .env or kill process           |
| Dependencies not found     | Run `npm install` in both folders             |
| Database tables missing    | Run `npx prisma migrate dev`                  |

---

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Course ratings and reviews
- [ ] Video hosting and streaming
- [ ] Student progress tracking
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Course categories and tags
- [ ] Instructor profiles
- [ ] Certificate generation
- [ ] Mobile application
- [ ] Unit and E2E tests
- [ ] Performance optimization

---

## 📝 License

ISC

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review API documentation at `/api-docs`
3. Check console for error messages
4. Create an issue in the repository

---

**Happy Learning! 🚀**

Swagger Docs:

```bash
http://localhost:5000/api-docs
```

---

# 🔥 Future Scalability Improvements

- Redis Caching
- Docker Containerization
- Microservices Architecture
- Rate Limiting
- Load Balancing
- CI/CD Pipeline

---

# 👨‍💻 Author

Ankit Bowade
