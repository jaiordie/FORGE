# 🚀 FORGE Quick Start Guide

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher) - for web version
- **npm** or **yarn**

## 🌐 Option 1: Run as Web Application

### ✅ **Quick Start (Recommended)**

1. **Open terminal in Cursor**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Cursor will show the local server link:
   ```
   VITE server running at http://localhost:5173/
   ```

### 📋 **Detailed Setup (If needed)**

**Backend Setup:**
```bash
# Install dependencies
npm install

# Create environment file (optional - has defaults)
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Setup database (PostgreSQL or SQLite)
npm run db:push

# Seed with demo data
npm run db:seed

# Start backend server
npm run dev
```

**Frontend Setup (separate terminal):**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

### 3️⃣ Access the Application

- **Main App**: http://localhost:3001
- **API Documentation**: http://localhost:3000/health
- **Database GUI**: `npx prisma studio`

---

## 🖥 Option 2: Run as Desktop Application

### 1️⃣ Quick Desktop Setup

```bash
# Install all dependencies (backend + frontend + electron)
npm install
cd frontend && npm install && cd ..

# Build everything and run as desktop app
npm run electron-dev
```

This will:
- Start the backend server
- Start the React development server  
- Launch the Electron desktop app

### 2️⃣ Build Desktop Distributables

```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist-win    # Windows
npm run dist-mac    # macOS
npm run dist-linux  # Linux
```

**Output:** `dist-electron/` directory with installers

---

## 🎯 Demo Credentials

Use these accounts to test the application:

| Role | Email | Password |
|------|-------|----------|
| **Plumber** | `plumber@forge.com` | `plumber123` |
| **Homeowner** | `homeowner@forge.com` | `homeowner123` |
| **Dispatcher** | `dispatcher@forge.com` | `dispatcher123` |

---

## 🔧 Development Commands

### Backend Commands
```bash
npm run dev          # Start backend with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production backend
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with demo data
```

### Frontend Commands
```bash
cd frontend
npm start            # Start React dev server
npm run build        # Build for production
npm test             # Run tests
```

### Desktop App Commands
```bash
npm run electron     # Run Electron app (production mode)
npm run electron-dev # Run with hot reload (development)
npm run dist         # Build desktop installers
```

---

## 🗂 Project Structure

```
FORGE/
├── 🗄 Backend (Node.js + Express)
│   ├── src/                 # TypeScript source code
│   ├── prisma/             # Database schema
│   ├── uploads/            # File uploads
│   └── dist/               # Compiled JavaScript
│
├── 🎨 Frontend (React + TypeScript)  
│   ├── src/                # React components
│   ├── public/             # Static assets
│   └── build/              # Production build
│
└── 🖥 Desktop (Electron)
    ├── electron/           # Electron main process
    └── dist-electron/      # Built desktop apps
```

---

## 🎮 Features Available

### ✅ Implemented
- **Multi-role Authentication** (Plumber, Homeowner, Dispatcher)
- **Gamified Plumber Dashboard** with XP, levels, badges
- **Job Management** with status tracking
- **Earnings Tracking** (today, week, month, total)
- **Quote System** (Good/Better/Best tiers)
- **Photo Upload** for job documentation
- **Review System** (5-star ratings)
- **Desktop App** with Electron packaging

### 🚧 Coming Soon
- Job detail & quoting flow UI
- Homeowner portal
- OpenAI quote assistance
- Advanced gamification engine

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
npx prisma migrate reset

# Re-generate client
npx prisma generate

# Re-seed data
npm run db:seed
```

### Port Conflicts
If ports 3000 or 3001 are in use:

**Backend (.env):**
```env
PORT=3002
```

**Frontend:**
```bash
PORT=3003 npm start
```

### Desktop App Issues
```bash
# Clear Electron cache
npm run electron -- --clear-cache

# Rebuild native modules
npm rebuild

# Check Electron version
npm ls electron
```

---

## 📱 Mobile Testing

The React frontend is mobile-responsive. Test on mobile by:

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from mobile: `http://YOUR_IP:3001`
3. Ensure firewall allows the connection

---

## 🔒 Security Notes

- **Development**: Uses default JWT secrets (change in production)
- **Desktop**: Uses SQLite database (portable but single-user)
- **Web**: Requires PostgreSQL setup (multi-user capable)

---

## 📞 Support

- **Issues**: Check console logs in browser/terminal
- **Database**: Use `npx prisma studio` to inspect data
- **API**: Test endpoints with tools like Postman
- **Frontend**: React DevTools extension recommended

---

**🎉 You're ready to explore FORGE!** 

Start with the plumber dashboard to see the gamification features in action! 🔧⚡