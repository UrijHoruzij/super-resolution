const { app, ipcMain, dialog, remote } = require('electron');
const path = require('path');
const upscayl = require('./upscayl');
const utils = require('./utils');

const ipc = (mainWindow, temporary, previews) => {
	const userDataPath = (app || remote.app).getPath('userData');
	let flag = false;
	ipcMain.on('upscayl', async (e, scale) => {
		const file = await temporary.get('file');
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
				await temporary.set('temp', upscale);
				const temp = await temporary.get('temp');
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
		await temporary.set('file', [...filePaths]);
		await temporary.set('filePathPosix', [filePaths[0].split(path.sep).join(path.posix.sep)]);
		e.reply('open-file', true);
	});
	ipcMain.on('open-file', async (e) => {
		await utils.openFile(temporary);
		e.reply('open-file', true);
	});
	ipcMain.on('opened-file', async (e) => {
		const filePathPosix = await temporary.get('filePathPosix');
		e.reply('opened-file', filePathPosix[0]);
	});
	ipcMain.on('save-file', async () => {
		utils.saveFile(temporary, previews);
	});
	ipcMain.on('close-file', async () => {
		utils.closeFile(temporary);
	});
	// ipcMain.on('open-directory', async () => {
	// 	const { filePaths } = await dialog.showOpenDialog({
	// 		properties: ['openDirectory'],
	// 	});
	// 	saveDirectory = filePaths;
	// });
};
module.exports = ipc;
