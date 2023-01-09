import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import { Header, Sidebar, Main, LangContext } from '../components';

const Home = () => {
	const [messages, changeLang, lang, setLang] = useContext(LangContext);
	useEffect(() => {
		window.electron.invoke('get-lang').then((lang) => {
			setLang(lang);
			changeLang(lang);
		});
	}, []);
	return (
		<>
			<Head>
				<title>{messages.home.title}</title>
				<link rel="shortcut icon" href="resources/icon.ico" type="image/x-icon" />
			</Head>
			<Header title={messages.home.title} />
			<Sidebar />
			<Main></Main>
		</>
	);
};

export default Home;
