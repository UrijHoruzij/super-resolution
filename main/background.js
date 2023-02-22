const { app, ipcMain, dialog, remote, Menu, MenuItem, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdate, allWindows, store, utils, ipc } = require('./helpers/');

if (isDev) {
	require('electron-reload')(__dirname, {
		electron: require(`${app.getAppPath()}/node_modules/electron`),
	});
}
if (!isDev) {
	serve({ directory: 'out' });
}

let mainWindow;
let temp = null;
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
	mainWindow = await allWindows();
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
						if (temp) {
							const { filePath } = await dialog.showSaveDialog({
								filters: [
									{ name: 'PNG', extensions: ['png'] },
									{ name: 'JPEG', extensions: ['jpg', 'jpeg'] },
									{ name: 'GIF', extensions: ['gif'] },
								],
							});
							await utils.previews(previews, userDataPath, temp);
							await utils.copy(temp, filePath);
							temp = null;
						}
					},
				},
				{
					role: 'Exit',
					accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
					click: async () => {
						mainWindow.close();
					},
				},
			],
		}),
	);
	Menu.setApplicationMenu(menu);
	autoUpdate(mainWindow);
	ipc(mainWindow, temp);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', function () {
	if (BrowserWindow.getAllWindows().length === 0) mainWindow = allWindows();
});
