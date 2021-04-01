const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  Notification,
} = require("electron");
const path = require("path");

// initiate local storage
const { useSkip, refillSkips } = require("./js/timeStore");

// allow for hot-reloading during development
// require("electron-reload")(__dirname);

// allows app to hide when closed
let confirmQuit = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// function to get correct icon
function getIcon() {
  let icon;
  if (process.platform === "win32") icon = "eyes.ico";
  else icon = "eyes.png";
  return path.join(__dirname, "assets", icon);
}

// hide icon from dock if macOS
app.dock.hide();

// Create the browser window.
let mainWindow = null;
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 250,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "js", "mainPreload.js"),
      backgroundThrottling: false,
    },
    icon: getIcon(),
  });
  mainWindow.loadFile(path.join(__dirname, "views", "main.html"));
  mainWindow.show();
  // hide window when "closed"
  mainWindow.on("close", (e) => {
    if (confirmQuit) {
      mainWindow = null;
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });
};

// Create settings UI window
let settingsWindow = null;
const createSettingsWindow = () => {
  settingsWindow = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "js", "settingsPreload.js"),
    },
    icon: getIcon(),
  });
  settingsWindow.loadFile(path.join(__dirname, "views", "settings.html"));
  settingsWindow.show();
};
// event listener for opening settings
ipcMain.handle("createSettingsWindow", createSettingsWindow);

// Create break window
let breakWindow = null;
const createBreakWindow = () => {
  breakWindow = new BrowserWindow({
    transparent: true,
    fullscreen: true,
    kiosk: true,
    frame: false,
    movable: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "js", "breakPreload.js"),
    },
    icon: getIcon(),
  });
  breakWindow.loadFile(path.join(__dirname, "views", "break.html"));
  breakWindow.show();
  // prevent close using ctrl/cmd + W
  // breakWindow.setMenu(null);
  // send breakDone signal on window close
  breakWindow.on("close", () => {
    mainWindow.webContents.send("startNewCycle");
  });
};
// handler to create break window
ipcMain.handle("startBreak", createBreakWindow);
// handlers for break done/skip
ipcMain.handle("breakDone", () => {
  refillSkips();
  breakWindow.close();
});
ipcMain.handle("breakSkip", () => {
  useSkip();
  breakWindow.close();
});

// Create nofification template
let notification = null;
const createNotification = (title, body) => {
  notification = new Notification({
    title,
    body,
    icon: getIcon(),
  });
  notification.show();
};
// listener to make notifications
ipcMain.handle("alert", (event, title, body) =>
  createNotification(title, body)
);

// Create tray menu
let mainTray = null;
const createTray = () => {
  mainTray = new Tray(getIcon());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "eyePause 2",
      enabled: false,
    },
    {
      type: "separator",
    },
    {
      label: "Settings",
      click: () => {
        createSettingsWindow();
      },
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      click: () => {
        confirmQuit = true;
        mainWindow.close();
      },
    },
  ]);
  mainTray.setContextMenu(contextMenu);
  mainTray.setToolTip("eyePause2");
  // show window when clicked
  mainTray.on("click", () => mainWindow.show());
};

// Create app components (e.g. main window, tray) on open
app.on("ready", createMainWindow);
app.on("ready", createTray);

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// show window when icon is clicked macOS
app.on("activate", () => {
  mainWindow.show();
});

// allow CMD+Q for quitting the application
app.on("before-quit", () => (confirmQuit = true));
