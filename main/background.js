const { app, ipcMain, dialog } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const isDev = require('electron-is-dev');
const { upscayl, autoUpdate, createWindow, store } = require('./helpers/');

if (isDev) {
	require('electron-reload')(__dirname, {
		electron: require(`${app.getAppPath()}/node_modules/electron`),
	});
}
if (!isDev) {
	serve({ directory: 'out' });
}

let mainWindow;
let splashWindow;
let files = [];
let saveDirectory = [];
let flag = false;
app.on('ready', async () => {
	const settings = store({
		configName: 'settings',
		defaults: {
			locale: app.getLocaleCountryCode().toLowerCase(),
		},
	});
	ipcMain.handle('get-lang', async (e) => {
		const lang = await settings.get('locale');
		return lang;
	});
	ipcMain.handle('set-lang', async (e, newLang) => {
		await settings.set('locale', newLang);
		const lang = await settings.get('locale');
		return lang;
	});
	splashWindow = createWindow(
		'splash',
		{
			icon: path.join(__dirname, '../resources/icon.png'),
			width: 750,
			height: 500,
			show: false,
			center: true,
			frame: false,
			resizable: false,
			backgroundColor: '#171918',
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
			},
		},
		true,
	);
	splashWindow.once('ready-to-show', () => {
		splashWindow.show();
	});
	if (isDev) {
		await splashWindow.loadURL(`http://localhost:3000/splash`);
	} else {
		await splashWindow.loadURL('app://./splash.html');
	}

	mainWindow = createWindow('main', {
		icon: path.join(__dirname, '../resources/icon.png'),
		width: 1000,
		height: 600,
		show: false,
		frame: false,
		backgroundColor: '#171918',
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			preload: path.join(__dirname, 'preload.js'),
		},
	});
	if (isDev) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.removeMenu();
	mainWindow.once('ready-to-show', () => {
		setTimeout(() => {
			splashWindow.close();
			mainWindow.show();
		}, 4000);
	});
	if (isDev) {
		await mainWindow.loadURL(`http://localhost:3000/`);
	} else {
		await mainWindow.loadURL('app://./index.html');
	}
	autoUpdate(mainWindow);

	ipcMain.on('upscayl', async () => {
		const index = 0;
		if (!flag && files.length > 0) {
			flag = true;
			for (const file of files) {
				await upscayl(file, null, mainWindow, index);
				index++;
			}
			flag = false;
		}
	});
	ipcMain.on('window-min', () => {
		mainWindow.minimize();
	});
	ipcMain.on('window-max', () => {
		mainWindow.maximize();
	});
	ipcMain.on('window-unmax', () => {
		mainWindow.unmaximize();
	});
	ipcMain.handle('window-ismax', () => {
		if (mainWindow.isMaximized()) {
			return true;
		} else {
			return false;
		}
	});
	ipcMain.on('window-close', () => {
		mainWindow.close();
	});

	ipcMain.on('open-files', async (e) => {
		const { filePaths } = await dialog.showOpenDialog({
			filters: [{ name: 'Изображения', extensions: ['jpg', 'png', 'gif'] }],
			properties: ['openFile'],
		});
		files = [...filePaths];
		const filesPathsPosix = filePaths.map((file) => file.split(path.sep).join(path.posix.sep));
		e.reply('open-files', filesPathsPosix);
	});
	ipcMain.on('open-directory', async () => {
		const { filePaths } = await dialog.showOpenDialog({
			properties: ['openDirectory'],
		});
		saveDirectory = filePaths;
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
