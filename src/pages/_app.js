import '../styles/Global.css';
import { useState } from 'react';
import { LangContext, MenuContext } from '../components';
import { ThemeProvider } from 'ui-forest';
import translate from '../locale';

const MyApp = ({ Component, pageProps }) => {
	const [lang, setLang] = useState('en');
	const [messages, setMessages] = useState(translate(lang));
	const changeLang = (newLang) => {
		setMessages(translate(newLang));
	};

	const [menuItem, setMenuItem] = useState(null);
	const changeMenu = (item = null) => {
		if (menuItem === item) {
			setMenuItem(null);
		} else {
			setMenuItem(item);
		}
	};
	return (
		<LangContext.Provider value={[messages, changeLang, lang, setLang]}>
			<MenuContext.Provider value={[menuItem, changeMenu]}>
				<ThemeProvider>
					<Component {...pageProps} />
				</ThemeProvider>
			</MenuContext.Provider>
		</LangContext.Provider>
	);
};

export default MyApp;
