import React, { useEffect, useContext } from 'react';
import { Splash, LangContext } from '../components';
import packageJson from '../../package.json';

const SplashPage = () => {
	const [messages, changeLang] = useContext(LangContext);
	useEffect(() => {
		window.electron.invoke('get-lang').then((lang) => {
			changeLang(lang);
		});
	}, []);
	return <Splash messages={messages} />;
};

export default SplashPage;

export const getStaticProps = async () => {
	return {
		props: {
			splash: true,
			version: packageJson.version,
		},
	};
};
