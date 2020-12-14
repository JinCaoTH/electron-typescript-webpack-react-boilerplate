import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';

const port = process.env.PORT || 9000;

let mainWindow: BrowserWindow | null = null;
let secondWindow: BrowserWindow | null = null;

const createMainWindow = async () => {
	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		webPreferences: {
			contextIsolation: true,
			preload: path.resolve(__dirname, 'mainPreload.bundle.js')
		}
	});
	mainWindow.loadURL(`http://localhost:${port}/main.html`);
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
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

ipcMain.on('open-second-window', function () {
	if (secondWindow === null) {
		secondWindow = new BrowserWindow({
			show: false,
			width: 800,
			height: 600,
			webPreferences: {
				contextIsolation: true,
				preload: path.resolve(__dirname, 'secondPreload.bundle.js')
			}
		});
		secondWindow.loadURL(`http://localhost:${port}/second.html`);
		secondWindow.webContents.on('did-finish-load', () => {
			if (!secondWindow) {
				throw new Error('"mainWindow" is not defined');
			}
			secondWindow.show();
		});
		secondWindow.on('closed', () => {
			secondWindow = null;
		});
	} else {
		secondWindow.focus();
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.whenReady()
	.then(() => {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));
	})
	.then(createMainWindow)
	.catch(console.log);

app.on('activate', function activate() {
	if (mainWindow === null) createMainWindow();
});
