import * as en from './en';
import * as ru from './ru';

const translate = (language) => {
	if (language == 'ru') {
		return ru.default;
	} else {
		return en.default;
	}
};

export default translate;
