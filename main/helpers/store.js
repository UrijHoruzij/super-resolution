const electron = require('electron');
const path = require('path');
const fs = require('fs');

const Store = (opts) => {
	const userDataPath = (electron.app || electron.remote.app).getPath('userData');
	const pathJSON = path.join(userDataPath, opts.configName + '.json');
	const parseDataFile = (filePath, defaults) => {
		try {
			return JSON.parse(fs.readFileSync(filePath));
		} catch (error) {
			return defaults;
		}
	};
	const data = parseDataFile(pathJSON, opts.defaults);
	const get = (key) => {
		return data[key];
	};
	const set = (key, val) => {
		data[key] = val;
		fs.writeFileSync(pathJSON, JSON.stringify(data));
	};
	return {
		get,
		set,
	};
};

module.exports = Store;
