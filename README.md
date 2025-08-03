# 🔧 FORGE - Gamified Field Service Management Platform

**FORGE** is a comprehensive field service management platform that connects homeowners with skilled plumbers through an innovative gamified experience. Built with modern technologies, FORGE rewards quality work, customer satisfaction, and professional growth.

## 🎮 What's Been Built

### ✅ Phase 1: Database & Backend (COMPLETED)
- **Comprehensive Prisma Schema** with PostgreSQL
- **Express.js REST API** with TypeScript
- **JWT Authentication** with role-based access control
- **File Upload System** for job photos
- **Gamification Models** (XP, levels, badges, earnings)

### ✅ Phase 2: Gamified Plumber Dashboard (COMPLETED)
- **React + TypeScript Frontend** with Tailwind CSS
- **Responsive Plumber Dashboard** with mobile-first design
- **XP Progress Bar** with level advancement
- **Earnings Summary** (today, week, month, total)
- **Badge System** with achievement tracking
- **Job Feed** ranked by earning potential and location
- **ForgeScore** composite metric
- **Availability Toggle** for active/inactive status

### ✅ Phase 2.5: Desktop Application (COMPLETED)
- **Electron Desktop App** with cross-platform support
- **Native Window Management** and application menus
- **Embedded Backend Server** (no external dependencies)
- **SQLite Database** for portability
- **Build Scripts** for Windows, macOS, and Linux
- **Security Hardening** with context isolation

### 🚧 Remaining Phases (TODO)
- **Phase 3**: Job detail & quoting flow components
- **Phase 4**: Homeowner portal for job requests
- **Phase 5**: OpenAI integration for quote assistance
- **Phase 6**: Advanced gamification engine
- **Phase 7**: Badge & XP tracking enhancements

## 🚀 Features

### Core Functionality
- **User Management**: Multi-role system (Plumber, Dispatcher, Homeowner, Admin)
- **Job Management**: Complete job lifecycle from request to completion
- **Quote System**: Good/Better/Best pricing tiers for transparent pricing
- **Photo Uploads**: Visual documentation of job progress
- **Review System**: 5-star rating system with comments
- **Real-time Status Updates**: Track job progress in real-time

### Gamification Features
- **XP System**: Earn experience points for completed jobs
- **Level Progression**: Advance through skill levels
- **Badge System**: Unlock achievements and milestones
- **ForgeScore**: Composite metric combining reviews, completion rate, and earnings
- **Earnings Tracking**: Detailed financial analytics

### Smart Features
- **Job Preferences**: Plumbers set preferred job types and availability
- **Distance Filtering**: Jobs filtered by geographic preferences
- **Availability Management**: Toggle active/inactive status
- **Flexible Scheduling**: Custom availability windows per day

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with bcrypt password hashing
- **File Upload**: Multer for image handling
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Input validation and sanitization

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### Web App Setup
```bash
# Backend
npm install
cp .env.example .env  # Edit with your database credentials
npm run db:generate
npm run db:seed
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

### Desktop App Setup
```bash
# Install all dependencies
npm install
cd frontend && npm install && cd ..

# Run as desktop app
npm run electron-dev
```

The web app runs on `http://localhost:3000` (backend) and `http://localhost:3001` (frontend).  
The desktop app launches as a native application window.

### 🎯 Demo Credentials
Use these credentials to test the application:

**Plumber Account:**
- Email: `plumber@forge.com`
- Password: `plumber123`

**Homeowner Account:**
- Email: `homeowner@forge.com`  
- Password: `homeowner123`

## 🔧 Full Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jaiordie/FORGE.git
   cd FORGE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and update with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/forge_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV="development"
   UPLOAD_DIR="uploads"
   MAX_FILE_SIZE=5242880
   ```

4. **Database Setup**
   ```bash
   # Create database (if not exists)
   createdb forge_db
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations (recommended for production)
   npm run db:migrate
   ```

5. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

6. **Build and Start**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PLUMBER",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PLUMBER"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Job Management Endpoints

#### GET /api/plumber/jobs
Get available jobs filtered by plumber preferences.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "jobs": [
    {
      "id": "job_id",
      "title": "Kitchen Sink Repair",
      "description": "Leaky faucet needs fixing",
      "jobType": "leak_repair",
      "urgency": "MEDIUM",
      "status": "REQUESTED",
      "address": "123 Main St, City, State",
      "createdBy": {
        "firstName": "Jane",
        "lastName": "Smith",
        "phone": "+1987654321"
      },
      "photos": [],
      "quotes": []
    }
  ]
}
```

#### POST /api/job
Create a new job (Dispatcher/Homeowner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Kitchen Sink Repair",
  "description": "Leaky faucet in kitchen sink",
  "jobType": "leak_repair",
  "urgency": "MEDIUM",
  "address": "123 Main St, City, State",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### POST /api/job/:id/quote
Submit a quote for a job (Plumber only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "goodTitle": "Basic Repair",
  "goodDescription": "Fix the leak with standard parts",
  "goodPrice": 150.00,
  "betterTitle": "Quality Repair",
  "betterDescription": "Fix leak with premium parts and 1-year warranty",
  "betterPrice": 225.00,
  "bestTitle": "Premium Service",
  "bestDescription": "Complete system inspection, premium parts, 2-year warranty",
  "bestPrice": 350.00
}
```

#### POST /api/job/:id/status
Update job status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "scheduledAt": "2024-01-15T10:00:00Z"
}
```

#### POST /api/job/:id/photo
Upload a photo for a job.

**Headers:** `Authorization: Bearer <token>`

**Form Data:**
- `photo`: Image file
- `caption`: Optional description

#### POST /api/job/:id/review
Leave a review for completed job (Homeowner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent work! Very professional and timely."
}
```

### Plumber Dashboard Endpoints

#### GET /api/plumber/dashboard
Get plumber dashboard data including XP, earnings, and badges.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "profile": {
    "xp": 1250,
    "level": 3,
    "forgeScore": 4.8,
    "isActive": true
  },
  "earnings": {
    "today": 150.00,
    "week": 750.00,
    "month": 3200.00,
    "total": 15600.00
  },
  "jobs": {
    "available": 12,
    "inProgress": 2,
    "completed": 48
  },
  "badges": [
    {
      "id": "badge_id",
      "name": "5-Star Streak",
      "description": "Received 5 consecutive 5-star reviews",
      "icon": "⭐",
      "unlockedAt": "2024-01-10T12:00:00Z"
    }
  ]
}
```

#### PUT /api/plumber/availability
Toggle plumber availability status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isActive": true
}
```

#### PUT /api/plumber/preferences
Update job preferences and availability windows.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "preferredJobTypes": ["leak_repair", "installation"],
  "maxDistanceKm": 25,
  "mondayStart": "08:00",
  "mondayEnd": "17:00",
  "tuesdayStart": "08:00",
  "tuesdayEnd": "17:00"
}
```

## 🗄 Database Schema

The application uses the following main entities:

- **User**: Core user information with role-based access
- **PlumberProfile**: Extended profile for plumbers with gamification data
- **Job**: Job requests with status tracking
- **Quote**: Good/Better/Best pricing proposals
- **Review**: Customer feedback and ratings
- **Earning**: Financial tracking per job
- **Photo**: Job-related image uploads
- **Badge**: Achievement system
- **JobPreference**: Plumber preferences and availability

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- File upload restrictions

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🧪 Development

```bash
# Start development server with hot reload
npm run dev

# Run database migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Build for production
npm run build
```

## 🌟 Next Steps

This backend provides the foundation for:

1. **React Frontend**: Gamified plumber dashboard and homeowner portal
2. **OpenAI Integration**: AI-powered quote generation
3. **Real-time Features**: WebSocket integration for live updates
4. **Mobile App**: React Native or Flutter mobile applications
5. **Analytics Dashboard**: Business intelligence and reporting

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**FORGE** - Forging connections between skilled professionals and customers who need their expertise. 🔧⚡