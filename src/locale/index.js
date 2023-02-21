import * as en from './en';
import * as ru from './ru';
import * as zh from './zh';

const translate = (language) => {
	switch (language) {
		case 'ru':
			return ru.default;
		case 'en':
			return en.default;
		case 'zh':
			return zh.default;
		default:
			return en.default;
	}
};

export default translate;
