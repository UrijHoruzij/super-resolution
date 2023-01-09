import React, { useContext } from 'react';
import Head from 'next/head';
import { Header, Sidebar, Main, LangContext } from '../components';

const Help = () => {
	const [messages] = useContext(LangContext);
	return (
		<>
			<Head>
				<title>Super resolution</title>
				<link rel="shortcut icon" href="resources/icon.ico" type="image/x-icon" />
			</Head>
			<Header title={messages.help.title} />
			<Sidebar />
			<Main></Main>
		</>
	);
};

export default Help;
