const { screen, BrowserWindow } = require('electron');
const Store = require('./store.js');
const createWindow = (windowName, options, splash = false) => {
	let win;
	if (splash) {
		win = new BrowserWindow({
			...options,
		});
		return win;
	}
	const store = Store({
		configName: `window-state-${windowName}`,
		defaults: {
			windowBounds: { width: options.width, height: options.height },
		},
	});
	let state = {};
	const key = 'window-state';
	const defaultSize = {
		width: options.width,
		height: options.height,
	};
	const restore = () => store.get(key);
	const getCurrentPosition = () => {
		const position = win.getPosition();
		const size = win.getSize();
		return {
			x: position[0],
			y: position[1],
			width: size[0],
			height: size[1],
		};
	};
	const windowWithinBounds = (windowState, bounds) => {
		return (
			windowState.x >= bounds.x &&
			windowState.y >= bounds.y &&
			windowState.x + windowState.width <= bounds.x + bounds.width &&
			windowState.y + windowState.height <= bounds.y + bounds.height
		);
	};
	const resetToDefaults = () => {
		const bounds = screen.getPrimaryDisplay().bounds;
		return Object.assign({}, defaultSize, {
			x: (bounds.width - defaultSize.width) / 2,
			y: (bounds.height - defaultSize.height) / 2,
		});
	};
	const ensureVisibleOnSomeDisplay = (windowState) => {
		const visible = screen.getAllDisplays().some((display) => {
			return windowWithinBounds(windowState, display.bounds);
		});
		if (!visible) {
			// Window is partially or fully not visible now.
			// Reset it to safe defaults.
			return resetToDefaults();
		}
		return windowState;
	};
	const saveState = () => {
		if (!win.isMinimized() && !win.isMaximized()) {
			Object.assign(state, getCurrentPosition());
		}
		store.set(key, state);
	};
	state = ensureVisibleOnSomeDisplay(restore());
	win = new BrowserWindow({
		...options,
		...state,
	});
	win.on('close', saveState);
	return win;
};
module.exports = createWindow;
