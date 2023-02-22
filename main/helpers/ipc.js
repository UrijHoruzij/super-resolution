const { app, ipcMain, dialog, remote } = require('electron');
const path = require('path');
const upscayl = require('./upscayl');
const utils = require('./utils');

const ipc = (mainWindow, temp) => {
	const userDataPath = (app || remote.app).getPath('userData');
	let file = [];
	let filePathPosix = [];
	let flag = false;
	ipcMain.on('upscayl', async (e, scale) => {
		if (!flag && file.length > 0) {
			flag = true;
			const percentFunc = (percent) => {
				mainWindow.setProgressBar(percent / 100);
				mainWindow.webContents.send('upscayl-progress', percent);
			};
			try {
				mainWindow.setProgressBar(0.01);
				mainWindow.webContents.send('upscayl-progress', 1);
				const upscale = await upscayl(file[0], userDataPath, percentFunc);
				temp = upscale;
				if (scale === 8) {
					await upscayl(temp, userDataPath, percentFunc);
				}
				mainWindow.webContents.send('upscayl-done', temp);
			} catch (err) {
				mainWindow.webContents.send('upscayl-error');
			} finally {
				mainWindow.setProgressBar(-1);
			}
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
		await utils.previews(previews, userDataPath, temp);
		await utils.copy(temp, filePath);
		temp = null;
	});
	// ipcMain.on('open-directory', async () => {
	// 	const { filePaths } = await dialog.showOpenDialog({
	// 		properties: ['openDirectory'],
	// 	});
	// 	saveDirectory = filePaths;
	// });
};
module.exports = ipc;
