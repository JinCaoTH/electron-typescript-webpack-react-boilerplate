import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

// const windows: BrowserWindow[] = [];
const mainWindow: BrowserWindow | null = null;
// const secondWindow: BrowserWindow | null = null;
const createWindow = async (window = 'main') => {
	let mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		webPreferences: {
			contextIsolation: true,
			preload: path.resolve(__dirname, `${window}Preload.bundle.js`)
		}
	});
	mainWindow.loadURL(`http://localhost:9000/${window}.html`);
	mainWindow.webContents.on('did-finish-load', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
			mainWindow.focus();
		}
	});
	// const i = windows.length;
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

ipcMain.on('open-second-window', function (event, arg) {
	console.log(event);
	console.log(arg);
});
app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow();
});
