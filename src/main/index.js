'use strict'

import {app, BrowserWindow} from 'electron'
let ipcMain = require('electron').ipcMain
let mainWin
let registerWin

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let loginWin
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  loginWin = new BrowserWindow({
    width: 1382,
    height: 777
    // webPreferences: {
    //   nodeIntegration: true,
    //   enableRemoteModule: true
    // },
    // resizable: false,
    // frame: false
  })

  loginWin.loadURL(winURL)

  loginWin.on('closed', () => {
    loginWin = null
  })
}

ipcMain.on('login-success', (event, args) => {
  mainWin = new BrowserWindow({
    width: 1382,
    height: 777,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    resizable: false,
    frame: false
  })
  loginWin.close()
  mainWin.loadFile('index.html')
  mainWin.webContents.openDevTools()
})

ipcMain.on('login-error', function () {
})

ipcMain.on('login-close', function () {
  loginWin.close()
})

ipcMain.on('main-close', function () {
  mainWin.close()
})

ipcMain.on('register_open', function () {
  registerWin = new BrowserWindow({
    width: 615,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    frame: false,
    resizable: false
  })
  loginWin.close()
  registerWin.loadFile('register.html')
})

ipcMain.on('cancel_login', function () {
  loginWin = new BrowserWindow({
    width: 615,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    frame: false,
    resizable: false
  })
  registerWin.close()
  loginWin.loadFile('login.html')
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (loginWin === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
