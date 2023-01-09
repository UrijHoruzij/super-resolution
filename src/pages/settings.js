import React, { useEffect, useRef, useContext } from 'react';
import Head from 'next/head';
import { Header, Sidebar, Main, LangContext } from '../components';

function Settings() {
	const [messages, changeLang, lang, setLang] = useContext(LangContext);
	const firstUpdate = useRef(true);
	const toggleLang = (e) => {
		changeLang(e.target.value);
		setLang(e.target.value);
	};
	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
		} else {
			window?.electron.invoke('set-lang', lang).then((currentLang) => {
				changeLang(currentLang);
			});
		}
	}, [lang]);
	return (
		<>
			<Head>
				<title>Super resolution</title>
				<link rel="shortcut icon" href="resources/icon.ico" type="image/x-icon" />
			</Head>
			<Header title={messages.settings.title} />
			<Sidebar />
			<Main>
				<table>
					<tr>
						<td>{messages.settings.changeLang}</td>
						<td>
							<select value={lang} onChange={toggleLang}>
								<option value="en">EN</option>
								<option value="ru">RU</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>{messages.settings.changeDirectory}</td>
						<td></td>
					</tr>
				</table>
			</Main>
		</>
	);
}

export default Settings;
