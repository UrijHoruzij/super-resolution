const { app, remote, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const userDataPath = (app || remote.app).getPath('userData');

const copy = (oldPath, newPath) => {
	let readStream = fs.createReadStream(oldPath);
	let writeStream = fs.createWriteStream(newPath);
	readStream.on('error', () => {});
	writeStream.on('error', () => {});
	readStream.on('close', () => {
		fs.unlink(oldPath, () => {});
	});
	readStream.pipe(writeStream);
};
const previews = async (previews, filePath) => {
	if (!fs.existsSync(path.join(userDataPath, 'previews'))) {
		fs.mkdirSync(path.join(userDataPath, 'previews'));
	}
	const fileName = path.parse(filePath).name;
	const fileExt = path.parse(filePath).ext;
	const dest = path.join(userDataPath, `previews/${fileName}${fileExt}`);
	console.log(dest);
	await sharp(filePath)
		.resize(200, 200)
		.toFile(dest, (err, resizeImage) => {
			if (err) {
				console.log(err);
			} else {
				console.log(resizeImage);
			}
		});
	const oldPreviews = await previews.get('paths');
	await previews.set('paths', [...oldPreviews, `${dest.split(path.sep).join(path.posix.sep)}`]);
};

const openFile = async (temporary) => {
	const { filePaths } = await dialog.showOpenDialog({
		filters: [{ name: 'Изображения', extensions: ['jpg', 'png', 'gif'] }],
		properties: ['openFile'],
	});
	await temporary.set('file', [...filePaths]);
	await temporary.set('filePathPosix', [filePaths[0].split(path.sep).join(path.posix.sep)]);
};
const saveFile = async (temporary, previewsStore) => {
	const temp = await temporary.get('temp');
	if (temp) {
		const { filePath } = await dialog.showSaveDialog({
			filters: [
				{ name: 'JPEG', extensions: ['jpg', 'jpeg'] },
				{ name: 'PNG', extensions: ['png'] },
				{ name: 'GIF', extensions: ['gif'] },
			],
		});
		await previews(previewsStore, temp);
		await copy(temp, filePath);
		await temporary.set('temp', null);
	}
};
const closeFile = async (temporary) => {
	await temporary.set('temp', null);
	await temporary.set('file', []);
	await temporary.set('filePathPosix', []);
};

module.exports = { copy, previews, openFile, saveFile, closeFile };
