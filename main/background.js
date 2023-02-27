const { app, ipcMain, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const isDev = require('electron-is-dev');
const { autoUpdate, allWindows, store, ipc, addMenu } = require('./helpers/');

if (isDev) {
	require('electron-reload')(__dirname, {
		electron: require(`${app.getAppPath()}/node_modules/electron`),
	});
}
if (!isDev) {
	serve({ directory: 'out' });
}

let mainWindow;
app.on('ready', async () => {
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
	const temporary = store({
		configName: 'temporary',
		defaults: {
			temp: null,
			file: [],
			filePathPosix: [],
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
	addMenu(mainWindow, temporary, previews);
	autoUpdate(mainWindow);
	ipc(mainWindow, temporary, previews);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', function () {
	if (BrowserWindow.getAllWindows().length === 0) mainWindow = allWindows();
});
