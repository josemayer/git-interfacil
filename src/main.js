/* eslint-disable no-undef */
const electron = require("electron");
const path = require("node:path");
const { ipcMain, dialog, screen } = require("electron");

const { app, BrowserWindow } = electron;

let win;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      // DEV:
      devTools: true,
    },
  });
};

function createTextInputWindow() {
  textInputWindow = new BrowserWindow({
    width: 300,
    height: 120,
    devTools: true,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  textInputWindow.loadFile("src/components/InputWindow/index.html");

  textInputWindow.on("closed", () => {
    textInputWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("open-text-input-window", () => {
    createTextInputWindow();
  });

  ipcMain.on("show-screen", (event, screenName) => {
    console.log((__dirname, `${screenName}.html`));
    win.loadFile(path.join(__dirname, `${screenName}.html`));
  });

  ipcMain.on("show-screen-with-data", (event, { screenName, data }) => {
    win.loadFile(path.join(__dirname, `${screenName}.html`));

    win.webContents.once("dom-ready", () => {
      win.webContents.send("args-to-store-window", data);
    });
  });

  ipcMain.handle("showMessageBox", (e, options) => {
    dialog.showMessageBox(null, options);
  });

  ipcMain.handle("showErrorBox", (e, message) => {
    dialog.showErrorBox("Oops! Something went wrong!", message);
  });

  win.loadFile("src/screens/Home/home.html");

  ipcMain.on("submit-input", (event, inputValue) => {
    win.webContents.send("inputValue-updated", inputValue);
  });
  // TO-DO: check if git repo
  ipcMain.on("open-folder-dialog", (event) => {
    dialog
      .showOpenDialog(win, {
        properties: ["openDirectory"],
      })
      .then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
          console.log(result.filePaths);
          event.reply("selected-folder", result.filePaths[0]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (textInputWindow === null) {
    createTextInputWindow();
  }
});

const env = process.env.NODE_ENV || "development";
if (env === "development") {
  try {
    require("electron-reloader")(module);
    // eslint-disable-next-line no-empty
  } catch (_) {}
}
