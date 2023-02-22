const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { modelsPath, execPath } = require('./binaries');

const upscayl = (input, output, percent) => {
	return new Promise((resolve, rejects) => {
		let failed = false;
		let out = '';
		let outputDir = '';
		let stats = fs.statSync(input);
		if (output) {
			outputDir = output;
		} else {
			outputDir = path.dirname(input);
		}
		if (stats.isDirectory()) {
			out = outputDir;
		} else {
			const fileName = path.parse(input).name;
			const fileExt = path.parse(input).ext;
			out = `${outputDir}/${fileName}${fileExt}`;
		}
		const upscayl = spawn(
			execPath('realesrgan'),
			['-i', input, '-o', out, '-s', 4, '-m', modelsPath, '-n', 'realesrgan-x4plus'],
			{
				cwd: undefined,
				detached: false,
			},
		);
		upscayl.stderr.on('data', (data) => {
			data = data.toString();
			const percentString = data.match(/\d+,\d+%/) || [];
			if (percentString.length) {
				let percentNumber = parseFloat(percentString[0].slice(0, -1));
				if (percentNumber > 1) percent(percentNumber);
			}
			if (data.includes('invalid gpu') || data.includes('failed')) failed = true;
		});
		upscayl.on('error', (data) => {
			data.toString();
			rejects(data);
			failed = true;
			return;
		});
		upscayl.on('close', () => {
			if (!failed) {
				const file = out.split(path.sep).join(path.posix.sep);
				resolve(file);
			}
		});
	});
};

module.exports = upscayl;
