const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
	send: (command, payload) => ipcRenderer.send(command, payload),
	on: (command, func) =>
		ipcRenderer.on(command, (event, args) => {
			func(event, args);
		}),
	invoke: (command, payload) => ipcRenderer.invoke(command, payload),
});
