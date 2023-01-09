const withTM = require('next-transpile-modules')(['ui-forest']);

module.exports = withTM({
	images: {
		unoptimized: true,
	},
});
