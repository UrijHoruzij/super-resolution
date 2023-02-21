import React, { useEffect, useContext } from 'react';
import { Splash, LangContext } from '../components';
import packageJson from '../../package.json';

const SplashPage = (props) => {
	const { version } = props;
	const [messages, changeLang] = useContext(LangContext);
	useEffect(() => {
		window.electron.invoke('get-lang').then((lang) => {
			changeLang(lang);
		});
	}, []);
	return <Splash messages={messages} version={version} />;
};

export default SplashPage;

export const getStaticProps = async () => {
	return {
		props: {
			version: packageJson.version,
		},
	};
};
