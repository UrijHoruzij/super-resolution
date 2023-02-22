const path = require('path');
const isDev = require('electron-is-dev');
const createWindow = require('./createWindow');

const allWindows = async () => {
	let splashWindow = createWindow(
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
				preload: path.join(__dirname, '../preload.js'),
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
	let mainWindow = createWindow('main', {
		icon: path.join(__dirname, '../resources/icon.png'),
		width: 1000,
		height: 600,
		show: false,
		frame: false,
		backgroundColor: '#171918',
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			preload: path.join(__dirname, '../preload.js'),
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
	return mainWindow;
};

module.exports = allWindows;
