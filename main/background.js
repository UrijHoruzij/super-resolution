const { app, ipcMain, dialog, remote, Menu, MenuItem } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const isDev = require('electron-is-dev');
const { upscayl, autoUpdate, createWindow, store, utils } = require('./helpers/');

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
let file = [];
let filePathPosix = [];
let temp = [];
let flag = false;
app.on('ready', async () => {
	const userDataPath = (app || remote.app).getPath('userData');
	const settings = store({
		configName: 'settings',
		defaults: {
			locale: app.getLocaleCountryCode().toLowerCase(),
		},
	});
	const previews = store({
		configName: 'previews',
		defaults: {
			paths: [],
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
	ipcMain.handle('get-previews', async () => {
		const oldPreviews = await previews.get('paths');
		return oldPreviews;
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
	mainWindow.once('ready-to-show', () => {
		splashWindow.close();
		mainWindow.show();
	});
	if (isDev) {
		await mainWindow.loadURL(`http://localhost:3000/`);
	} else {
		await mainWindow.loadURL('app://./index.html');
	}
	const menu = new Menu();
	menu.append(
		new MenuItem({
			label: 'Super-resolution',
			submenu: [
				{
					role: 'Open',
					accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
					click: async () => {
						const { filePaths } = await dialog.showOpenDialog({
							filters: [{ name: 'Изображения', extensions: ['jpg', 'png', 'gif'] }],
							properties: ['openFile'],
						});
						file = [...filePaths];
						filePathPosix = [filePaths[0].split(path.sep).join(path.posix.sep)];
						mainWindow.webContents.send('open-file', true);
					},
				},
				{
					role: 'Save',
					accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
					click: async () => {
						if (temp[0]) {
							const { filePath } = await dialog.showSaveDialog({
								filters: [
									{ name: 'JPEG', extensions: ['jpg', 'jpeg'] },
									{ name: 'PNG', extensions: ['png'] },
									{ name: 'GIF', extensions: ['gif'] },
								],
							});
							await utils.previews(previews, userDataPath, temp[0]);
							await utils.copy(temp[0], filePath);
							temp[0] = null;
						}
					},
				},
			],
		}),
	);
	Menu.setApplicationMenu(menu);
	autoUpdate(mainWindow);

	ipcMain.on('upscayl', async () => {
		if (!flag && file.length > 0) {
			flag = true;
			await upscayl(file[0], userDataPath, mainWindow, temp);
			flag = false;
		}
	});
	ipcMain.on('drag-file', async (e, filePaths) => {
		file = [...filePaths];
		filePathPosix = [filePaths[0].split(path.sep).join(path.posix.sep)];
		e.reply('open-file', true);
	});
	ipcMain.on('open-file', async (e) => {
		const { filePaths } = await dialog.showOpenDialog({
			filters: [{ name: 'Изображения', extensions: ['jpg', 'png', 'gif'] }],
			properties: ['openFile'],
		});
		file = [...filePaths];
		filePathPosix = [filePaths[0].split(path.sep).join(path.posix.sep)];
		e.reply('open-file', true);
	});
	ipcMain.on('opened-file', async (e) => {
		e.reply('opened-file', filePathPosix[0]);
	});
	ipcMain.on('save-file', async () => {
		const { filePath } = await dialog.showSaveDialog({
			filters: [
				{ name: 'JPEG', extensions: ['jpg', 'jpeg'] },
				{ name: 'PNG', extensions: ['png'] },
				{ name: 'GIF', extensions: ['gif'] },
			],
		});
		await utils.previews(previews, userDataPath, temp[0]);
		await utils.copy(temp[0], filePath);
		temp[0] = null;
	});
	// ipcMain.on('open-directory', async () => {
	// 	const { filePaths } = await dialog.showOpenDialog({
	// 		properties: ['openDirectory'],
	// 	});
	// 	saveDirectory = filePaths;
	// });
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
// app.on('activate', function () {
// 	// В macOS обычно заново создают окно в приложении, когда
// 	// нажата иконка док-станции, и другие окна не открыты.
// 	if (BrowserWindow.getAllWindows().length === 0) createWindow();
// });
