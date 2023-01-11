const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');

const autoUpdate = (mainWindow) => {
	ipcMain.on('check-update', () => {
		mainWindow.webContents.send('update-status', 'checking-for-update');
		autoUpdater.checkForUpdatesAndNotify();
	});
	autoUpdater.on('checking-for-update', () => {
		mainWindow.webContents.send('update-status', 'checking-for-update');
	});
	autoUpdater.on('update-available', () => {
		mainWindow.webContents.send('update-status', 'update-available');
	});
	autoUpdater.on('update-not-available', () => {
		mainWindow.webContents.send('update-status', 'update-not-available');
	});
	autoUpdater.on('update-downloaded', () => {
		mainWindow.webContents.send('update-status', 'update-downloaded');
	});
	autoUpdater.on('error', () => {
		mainWindow.webContents.send('update-status', 'error');
	});
	autoUpdater.on('download-progress', ({ bytesPerSecond, percent, total }) => {
		mainWindow.webContents.send('update-status', 'download-progress', bytesPerSecond, percent, total);
	});
	ipcMain.on('update', () => {
		autoUpdater.quitAndInstall();
	});
};
module.exports = autoUpdate;
