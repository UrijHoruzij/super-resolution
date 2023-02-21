const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const store = require('./store');

const copy = (oldPath, newPath) => {
	let readStream = fs.createReadStream(oldPath);
	let writeStream = fs.createWriteStream(newPath);
	readStream.on('error', () => {});
	writeStream.on('error', () => {});
	readStream.on('close', () => {
		// fs.unlink(oldPath, () => {});
	});
	readStream.pipe(writeStream);
};
const previews = async (previews, userDataPath, filePath) => {
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

const openFile = async () => {
	const { filePaths } = await dialog.showOpenDialog({
		filters: [{ name: 'Изображения', extensions: ['jpg', 'png', 'gif'] }],
		properties: ['openFile'],
	});
	file = [...filePaths];
	filePathPosix = [filePaths[0].split(path.sep).join(path.posix.sep)];
	return { file, filePathPosix };
};

module.exports = { copy, previews, openFile };
