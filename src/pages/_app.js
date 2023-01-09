import '../styles/Global.css';
import { useState } from 'react';
import { Layout, LangContext } from '../components';
import translate from '../locale';

const MyApp = ({ Component, pageProps }) => {
	const [lang, setLang] = useState('en');
	const [messages, setMessages] = useState(translate(lang));
	const changeLang = (newLang) => {
		setMessages(translate(newLang));
	};
	return (
		<LangContext.Provider value={[messages, changeLang, lang, setLang]}>
			{pageProps.splash ? (
				<Component {...pageProps} />
			) : (
				<Layout>
					<Component {...pageProps} />
				</Layout>
			)}
		</LangContext.Provider>
	);
};

export default MyApp;
