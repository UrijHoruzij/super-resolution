import React, { useContext } from 'react';
import Head from 'next/head';
import { Header, Sidebar, Main, LangContext } from '../components';

const Help = () => {
	const [messages] = useContext(LangContext);
	return (
		<>
			<Head />
			<Header title={messages.help.title} />
			<Sidebar />
			<Main></Main>
		</>
	);
};

export default Help;
