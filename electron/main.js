const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const fs = require('fs');

let mainWindow;
let backendProcess;

// Keep a global reference of the window object
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // We'll create this
    show: false, // Don't show until ready
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  // Set app title
  mainWindow.setTitle('FORGE - Field Service Management');

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3001' 
    : `file://${path.join(__dirname, '../frontend/build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus on window
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Start the backend server
async function startBackend() {
  return new Promise((resolve, reject) => {
    if (isDev) {
      // In development, assume backend is running separately
      resolve();
      return;
    }

    // In production, start the backend server
    const backendPath = path.join(__dirname, '../dist/index.js');
    backendProcess = spawn('node', [backendPath], {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '3000'
      }
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
    });

    // Wait for backend to be ready
    setTimeout(resolve, 3000); // Give backend time to start
  });
}

// Wait for backend to be available
async function waitForBackend() {
  try {
    await waitOn({
      resources: ['http://localhost:3000/health'],
      delay: 1000,
      interval: 100,
      timeout: 30000,
    });
    console.log('Backend is ready!');
  } catch (error) {
    console.error('Backend failed to start:', error);
    
    // Show error dialog
    dialog.showErrorBox(
      'Backend Error',
      'Failed to start the FORGE backend server. Please check your configuration.'
    );
    
    app.quit();
  }
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.setZoomLevel(0);
            }
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
            }
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
            }
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About FORGE',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About FORGE',
              message: 'FORGE - Field Service Management Platform',
              detail: 'A gamified platform connecting homeowners with skilled plumbers.\n\nVersion: 1.0.0\nBuilt with Electron, React, and Node.js'
            });
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: 'About FORGE',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About FORGE',
              message: 'FORGE - Field Service Management Platform',
              detail: 'A gamified platform connecting homeowners with skilled plumbers.\n\nVersion: 1.0.0\nBuilt with Electron, React, and Node.js'
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide FORGE',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit()
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(async () => {
  console.log('Electron app is ready, starting backend...');
  
  try {
    // Start backend server
    await startBackend();
    
    // Wait for backend to be ready
    await waitForBackend();
    
    // Create the main window
    createWindow();
    
    // Create application menu
    createMenu();
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  // Kill backend process
  if (backendProcess) {
    backendProcess.kill();
  }
  
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Handle app termination
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:3001' && parsedUrl.origin !== 'http://localhost:3000') {
      event.preventDefault();
    }
  });
});

// IPC handlers
ipcMain.handle('initialize-database', async () => {
  try {
    // In production, run database migrations and seeding
    if (!isDev) {
      const { spawn } = require('child_process');
      
      // Generate Prisma client
      await new Promise((resolve, reject) => {
        const generateProcess = spawn('npx', ['prisma', 'generate'], {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        });
        
        generateProcess.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Prisma generate failed with code ${code}`));
        });
      });
      
      // Push database schema
      await new Promise((resolve, reject) => {
        const pushProcess = spawn('npx', ['prisma', 'db', 'push'], {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        });
        
        pushProcess.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Database push failed with code ${code}`));
        });
      });
      
      // Seed database
      await new Promise((resolve, reject) => {
        const seedProcess = spawn('npm', ['run', 'db:seed'], {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit'
        });
        
        seedProcess.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Database seeding failed with code ${code}`));
        });
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Database initialization failed:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  return result;
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});