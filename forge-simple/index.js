const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory data store (for simplicity)
let users = [
  { id: 1, email: 'plumber@forge.com', password: 'plumber123', firstName: 'Mike', lastName: 'Johnson', role: 'PLUMBER', xp: 1250, level: 3, forgeScore: 4.8 },
  { id: 2, email: 'homeowner@forge.com', password: 'homeowner123', firstName: 'Sarah', lastName: 'Williams', role: 'HOMEOWNER' }
];

let jobs = [
  { id: 1, title: 'Kitchen Sink Leak Repair', description: 'Kitchen faucet has been dripping for a week', urgency: 'HIGH', status: 'REQUESTED', address: '123 Oak Street, Springfield, IL', createdBy: 2 },
  { id: 2, title: 'Bathroom Toilet Installation', description: 'Need to install a new toilet in master bathroom', urgency: 'MEDIUM', status: 'REQUESTED', address: '456 Elm Avenue, Springfield, IL', createdBy: 2 },
  { id: 3, title: 'Emergency Pipe Burst', description: 'URGENT: Pipe burst in basement, water everywhere!', urgency: 'EMERGENCY', status: 'REQUESTED', address: '789 Pine Road, Springfield, IL', createdBy: 2 }
];

let currentUser = null;

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FORGE - Field Service Management</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #0ea5e9, #0369a1); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .login-form { max-width: 400px; margin: 0 auto; }
        .input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
        .btn { background: #0ea5e9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #0284c7; }
        .dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .job { border-left: 4px solid #0ea5e9; padding: 15px; margin: 10px 0; background: #f8fafc; }
        .job.emergency { border-left-color: #ef4444; }
        .job.high { border-left-color: #f97316; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat { text-align: center; padding: 15px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 8px; }
        .xp-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .xp-progress { background: linear-gradient(90deg, #0ea5e9, #06b6d4); height: 100%; transition: width 0.3s; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔧 FORGE - Field Service Management Platform</h1>
        <p>Gamified platform connecting homeowners with skilled plumbers</p>
      </div>

      <div id="app">
        <div class="card login-form">
          <h2>Login to FORGE</h2>
          <form onsubmit="login(event)">
            <input type="email" id="email" placeholder="Email" class="input" value="plumber@forge.com">
            <input type="password" id="password" placeholder="Password" class="input" value="plumber123">
            <button type="submit" class="btn">Login</button>
          </form>
          <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 5px; font-size: 14px;">
            <strong>Demo Credentials:</strong><br>
            Plumber: plumber@forge.com / plumber123<br>
            Homeowner: homeowner@forge.com / homeowner123
          </div>
        </div>
      </div>

      <script>
        async function login(event) {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              showDashboard(data.user);
            } else {
              alert(data.error || 'Login failed');
            }
          } catch (error) {
            alert('Login error: ' + error.message);
          }
        }

        function showDashboard(user) {
          const app = document.getElementById('app');
          
          if (user.role === 'PLUMBER') {
            app.innerHTML = \`
              <div class="card">
                <h2>Welcome back, \${user.firstName}! 👋</h2>
                <p>Level \${user.level} Plumber • ForgeScore: \${user.forgeScore}/5.0</p>
                
                <div class="stats">
                  <div class="stat">
                    <h3>\${user.xp.toLocaleString()}</h3>
                    <p>Total XP</p>
                  </div>
                  <div class="stat">
                    <h3>Level \${user.level}</h3>
                    <p>Current Level</p>
                  </div>
                  <div class="stat">
                    <h3>\${user.forgeScore}/5.0</h3>
                    <p>ForgeScore</p>
                  </div>
                  <div class="stat">
                    <h3>$2,450</h3>
                    <p>This Month</p>
                  </div>
                </div>

                <h3>XP Progress</h3>
                <div class="xp-bar">
                  <div class="xp-progress" style="width: \${(user.xp % 1000) / 10}%"></div>
                </div>
                <p>Level \${user.level}: \${user.xp} / \${(user.level + 1) * 1000} XP</p>
              </div>

              <div class="dashboard">
                <div class="card">
                  <h3>🔥 Available Jobs</h3>
                  <div id="jobs"></div>
                </div>
                
                <div class="card">
                  <h3>🏆 Achievements</h3>
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                    <div style="padding: 10px; background: #fef3c7; border-radius: 5px;">
                      <div style="font-size: 24px;">🔧</div>
                      <small>First Job</small>
                    </div>
                    <div style="padding: 10px; background: #fef3c7; border-radius: 5px;">
                      <div style="font-size: 24px;">⭐</div>
                      <small>5-Star Streak</small>
                    </div>
                    <div style="padding: 10px; background: #f3f4f6; border-radius: 5px; opacity: 0.5;">
                      <div style="font-size: 24px;">⚡</div>
                      <small>Speed Demon</small>
                    </div>
                  </div>
                </div>
              </div>
            \`;
            loadJobs();
          } else {
            app.innerHTML = \`
              <div class="card">
                <h2>Welcome, \${user.firstName}!</h2>
                <p>Homeowner Dashboard - Coming Soon!</p>
                <button class="btn" onclick="location.reload()">Back to Login</button>
              </div>
            \`;
          }
        }

        async function loadJobs() {
          try {
            const response = await fetch('/api/jobs');
            const jobs = await response.json();
            
            const jobsContainer = document.getElementById('jobs');
            jobsContainer.innerHTML = jobs.map(job => \`
              <div class="job \${job.urgency.toLowerCase()}">
                <h4>\${job.title}</h4>
                <p>\${job.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                  <small>📍 \${job.address}</small>
                  <span style="background: \${job.urgency === 'EMERGENCY' ? '#ef4444' : job.urgency === 'HIGH' ? '#f97316' : '#10b981'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    \${job.urgency}
                  </span>
                </div>
                <div style="margin-top: 10px;">
                  <strong style="color: #059669;">💰 $\${job.urgency === 'EMERGENCY' ? '400' : job.urgency === 'HIGH' ? '300' : '200'} est.</strong>
                  <span style="color: #0ea5e9; margin-left: 15px;">⭐ +\${job.urgency === 'EMERGENCY' ? '150' : job.urgency === 'HIGH' ? '100' : '75'} XP</span>
                </div>
              </div>
            \`).join('');
          } catch (error) {
            console.error('Failed to load jobs:', error);
          }
        }
      </script>
    </body>
    </html>
  `);
});

// API Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/dashboard', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    user: currentUser,
    jobs: jobs.length,
    earnings: { today: 150, week: 750, month: 2450, total: 15600 }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FORGE Backend is running!',
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log('🔧 FORGE Backend is running!');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🎮 Demo Login: plumber@forge.com / plumber123`);
});