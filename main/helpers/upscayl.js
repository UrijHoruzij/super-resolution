const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { modelsPath, execPath } = require('./binaries');

const upscayl = (inputDir, outputDir, mainWindow) => {
	mainWindow.setProgressBar(0.01);
	let failed = false;
	let outFile = '';
	let stats = fs.statSync(inputDir);
	if (stats.isDirectory()) {
		outFile = outputDir;
	} else {
		const fileName = path.parse(inputDir).name;
		const fileExt = path.parse(inputDir).ext;
		outFile = `${outputDir}/${fileName}_upscayl${fileExt}`;
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
			mainWindow.setProgressBar(percent);
		}
		if (data.includes('invalid gpu') || data.includes('failed')) {
			mainWindow.setProgressBar(-1);
			failed = true;
		}
	});

	upscayl.on('error', (data) => {
		data.toString();
		mainWindow.setProgressBar(-1);
		console.log('error');
		failed = true;
		return;
	});
	upscayl.on('close', (code) => {
		mainWindow.setProgressBar(-1);
		if (failed) {
		}
	});
};

module.exports = upscayl;
