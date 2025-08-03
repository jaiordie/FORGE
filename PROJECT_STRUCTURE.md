# 📁 FORGE Project Structure

## 🏗 Backend Architecture (`/`)

```
├── prisma/
│   └── schema.prisma          # Database schema with all models
├── src/
│   ├── controllers/           # Business logic controllers
│   │   ├── authController.ts     # Authentication (signup, login)
│   │   ├── jobController.ts      # Job management
│   │   └── plumberController.ts  # Plumber-specific features
│   ├── middleware/            # Express middleware
│   │   └── auth.ts              # JWT authentication middleware
│   ├── routes/                # API route definitions
│   │   ├── auth.ts              # Authentication routes
│   │   ├── jobs.ts              # Job management routes
│   │   └── plumber.ts           # Plumber routes
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                 # Utility functions
│   │   ├── auth.ts              # JWT & password utilities
│   │   └── database.ts          # Prisma client setup
│   └── index.ts               # Main Express server
├── scripts/
│   └── seed.ts                # Database seeding script
├── uploads/                   # File upload directory
├── .env                       # Environment variables
├── package.json
└── README.md
```

## 🎨 Frontend Architecture (`/frontend`)

```
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── BadgeDisplay.tsx      # Achievement badges
│   │   ├── EarningsSummary.tsx   # Financial metrics
│   │   ├── JobFeed.tsx           # Available jobs list
│   │   └── XPProgressBar.tsx     # Gamification progress
│   ├── context/               # React context providers
│   │   └── AuthContext.tsx       # Authentication state
│   ├── pages/                 # Page components
│   │   ├── Login.tsx             # Login page
│   │   └── PlumberDashboard.tsx  # Main dashboard
│   ├── types/                 # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/                 # Utility functions
│   │   └── api.ts                # API client & endpoints
│   └── App.tsx                # Main app component
├── tailwind.config.js         # Tailwind CSS configuration
├── craco.config.js           # CRACO configuration
├── package.json
└── .env                      # Frontend environment variables
```

## 🗄 Database Models

### Core Models
- **User**: Multi-role user system (Plumber, Homeowner, Dispatcher, Admin)
- **PlumberProfile**: Extended plumber data with gamification
- **Job**: Job requests with status tracking
- **Quote**: Good/Better/Best pricing tiers
- **Review**: Customer feedback system
- **Photo**: Job-related image uploads

### Gamification Models
- **Badge**: Achievement definitions
- **PlumberBadge**: Unlocked achievements per plumber
- **Earning**: Financial tracking per job
- **JobPreference**: Plumber preferences & availability

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Create new user account
- `POST /login` - Authenticate user

### Jobs (`/api/job`)
- `POST /` - Create new job (Dispatcher/Homeowner)
- `POST /:id/quote` - Submit quote (Plumber)
- `POST /:id/status` - Update job status
- `POST /:id/photo` - Upload job photo
- `POST /:id/review` - Leave review (Homeowner)

### Plumber (`/api/plumber`)
- `GET /jobs` - Get available jobs (filtered by preferences)
- `GET /dashboard` - Get dashboard data (XP, earnings, badges)
- `PUT /availability` - Toggle availability status
- `PUT /preferences` - Update job preferences

## 🎮 Gamification Features

### XP System
- **Level Progression**: XP-based advancement
- **ForgeScore**: Composite metric (reviews + completion rate + earnings)
- **Job Rewards**: XP based on urgency and complexity

### Achievement System
- **Badge Types**: First Job, 5-Star Streak, Speed Demon, etc.
- **Unlock Criteria**: Flexible JSON-based requirements
- **Visual Rewards**: Emoji icons and unlock animations

### Financial Tracking
- **Earnings Summary**: Today, Week, Month, Total
- **Goal Tracking**: Weekly/Monthly targets
- **Performance Metrics**: Average daily earnings

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Create React App with CRACO

### Development Tools
- **Database GUI**: Prisma Studio
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint configuration
- **Hot Reload**: Both backend (nodemon) and frontend

## 🚀 Getting Started

1. **Backend Setup**:
   ```bash
   npm install
   npm run db:generate
   npm run db:seed
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access Application**:
   - Backend API: `http://localhost:3000`
   - Frontend App: `http://localhost:3001`
   - Database GUI: `npx prisma studio`

## 🎯 Demo Data

The seeding script creates:
- **3 Users**: Plumber, Homeowner, Dispatcher
- **3 Sample Jobs**: Various urgency levels
- **2 Unlocked Badges**: First Job, 5-Star Streak
- **Sample Earnings**: Realistic financial data
- **Job Preferences**: Configured for demo plumber

This provides a complete working demo of the gamified field service platform! 🚀