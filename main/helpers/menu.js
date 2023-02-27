const { Menu, MenuItem } = require('electron');
const { utils } = require('.');

const addMenu = (mainWindow, temporary, previews) => {
	const menu = new Menu();
	menu.append(
		new MenuItem({
			label: 'Super-resolution',
			submenu: [
				{
					role: 'Open',
					accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
					click: async () => {
						await utils.openFile(temporary);
						mainWindow.webContents.send('open-file', true);
					},
				},
				{
					role: 'Save',
					accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
					click: async () => {
						utils.saveFile(temporary, previews);
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
};
module.exports = addMenu;
