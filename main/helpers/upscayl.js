const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { modelsPath, execPath } = require('./binaries');

const upscayl = (inputDir, outputDir = null, mainWindow, index) => {
	mainWindow.setProgressBar(0.01);
	mainWindow.webContents.send('upscayl-progress', 1);
	let failed = false;
	let outFile = '';
	let stats = fs.statSync(inputDir);
	let outputDirectory = '';
	if (outputDir) {
		outputDirectory = outputDir;
	} else {
		outputDirectory = path.dirname(inputDir);
	}
	console.log(outputDirectory);
	if (stats.isDirectory()) {
		outFile = outputDirectory;
	} else {
		const fileName = path.parse(inputDir).name;
		const fileExt = path.parse(inputDir).ext;
		outFile = `${outputDirectory}/${fileName}_upscayl${fileExt}`;
	}
	const upscayl = spawn(
		execPath('realesrgan'),
		['-i', inputDir, '-o', outFile, '-s', 4, '-m', modelsPath, '-n', 'realesrgan-x4plus'],
		{
			cwd: undefined,
			detached: false,
		},
	);
	upscayl.stderr.on('data', (data) => {
		data = data.toString();
		const percentString = data.match(/\d+,\d+%/) || [];
		if (percentString.length) {
			let percent = parseFloat(percentString[0].slice(0, -1)) / 100;
			if (percent > 0.01) {
				mainWindow.setProgressBar(percent);
				mainWindow.webContents.send('upscayl-progress', percent * 100);
			}
		}
		if (data.includes('invalid gpu') || data.includes('failed')) {
			failed = true;
		}
	});

	upscayl.on('error', (data) => {
		data.toString();
		console.log('error');
		failed = true;
		return;
	});
	upscayl.on('close', (code) => {
		mainWindow.setProgressBar(-1);
		if (!failed) {
			const out = outFile.split(path.sep).join(path.posix.sep);
			mainWindow.webContents.send('upscayl-done', { after: out, index });
		} else {
			mainWindow.webContents.send('upscayl-error');
		}
	});
};

module.exports = upscayl;
