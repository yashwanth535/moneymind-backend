# MoneyMind Backend API

A comprehensive financial management backend API built with Node.js, Express, and MongoDB. This API provides endpoints for user authentication, transaction management, budgeting, financial reports, and goal tracking.

## 🚀 Features

- **User Authentication**: JWT-based authentication with Google OAuth support
- **Transaction Management**: Add, fetch, and manage financial transactions
- **Budgeting**: Create and track budgets
- **Financial Reports**: Generate detailed financial reports and analytics
- **Goal Tracking**: Set and monitor financial goals
- **Profile Management**: User profile management
- **Email Notifications**: Nodemailer integration for email services

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google Auth Library
- **Security**: bcrypt for password hashing
- **Email**: Nodemailer
- **Development**: Nodemon for hot reloading

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Google OAuth credentials (for Google authentication)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000,http://localhost:3001
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── appConfig.js # Express app configuration
│   │   └── mongoConnect.js # MongoDB connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   └── routes/          # API routes
│       ├── auth.route.js
│       ├── add-transaction.route.js
│       ├── fetch-transactions.route.js
│       ├── home.route.js
│       ├── reports.route.js
│       ├── budget.route.js
│       ├── profile.route.js
│       └── goals.route.js
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── nodemon.json         # Nodemon configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/google` - Google OAuth authentication
- `POST /auth/logout` - User logout

### Transactions
- `POST /add-transaction` - Add new transaction
- `GET /fetch-transactions` - Get user transactions

### Home Dashboard
- `GET /home` - Get dashboard data

### Reports
- `GET /reports` - Get financial reports

### Budgets
- `GET /budgets` - Get user budgets
- `POST /budgets` - Create new budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget

### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Goals
- `GET /goals` - Get user goals
- `POST /goals` - Create new goal
- `PUT /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal

### Health Checks
- `GET /ping` - Basic health check
- `GET /api/ping` - API health check
- `GET /api/db` - Database connection status

## 🔒 Security Features

- **CORS Protection**: Configured with allowed origins
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Request validation middleware
- **Session Management**: Express session handling

## 🚀 Deployment

### Frontend Application
The MoneyMind frontend is deployed at: **https://moneymind.yashwanth.site/**

### Vercel Deployment
The project includes `vercel.json` configuration for easy deployment on Vercel.

### Environment Variables for Production
Make sure to set all required environment variables in your production environment:
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run dev2` - Alternative development script
- `npm test` - Run tests (currently not implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: Make sure to replace placeholder values (like `<repository-url>`, `your_mongodb_connection_string`, etc.) with actual values for your project.
