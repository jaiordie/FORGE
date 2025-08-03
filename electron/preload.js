const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  initializeDatabase: () => ipcRenderer.invoke('initialize-database'),
  
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
});