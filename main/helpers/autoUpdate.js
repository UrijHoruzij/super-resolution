const autoUpdate = (autoUpdater) => {
	autoUpdater.on('update-available', ({ releaseNotes, releaseName }) => {
		const dialogOpts = {
			type: 'info',
			buttons: ['Ok'],
			title: 'Application Update',
			message: process.platform === 'win32' ? releaseNotes : releaseName,
			detail: 'A new version is being downloaded.',
		};
		dialog.showMessageBox(dialogOpts).then((returnValue) => {});
	});

	autoUpdater.on('update-downloaded', (event) => {
		const dialogOpts = {
			type: 'info',
			buttons: ['Restart', 'Later'],
			title: 'Application Update',
			message: process.platform === 'win32' ? event.releaseNotes : event.releaseName,
			detail: 'A new version has been downloaded. Restart the application to apply the updates.',
		};
		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) autoUpdater.quitAndInstall();
		});
	});
};
module.exports = autoUpdate;
