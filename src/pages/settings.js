import React, { useEffect, useRef, useContext, useState } from 'react';
import Head from 'next/head';
import { Header, Sidebar, Main, LangContext } from '../components';
import { Button } from 'ui-forest';

function Settings() {
	const [messages, changeLang, lang, setLang] = useContext(LangContext);
	const [updateStatus, setUpdateStatus] = useState(null);
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
	const checkUpdateClick = () => {
		window.electron.send('check-update');
	};
	const updateClick = () => {
		window.electron.send('update');
	};
	const updateMessages = () => {
		if (updateStatus) {
			switch (updateStatus) {
				case 'checking-for-update':
					return messages.settings.autoUpdater.checkingForUpdate;
				case 'update-available':
					return messages.settings.autoUpdater.updateAvailable;
				case 'update-not-available':
					return messages.settings.autoUpdater.updateNotAvailable;
				case 'update-downloaded':
					return messages.settings.autoUpdater.updateDownloaded;
				case 'error':
					return messages.settings.autoUpdater.error;
				case 'download-progress':
					return messages.settings.autoUpdater.downloadProgress;
			}
		}
	};
	useEffect(() => {
		window.electron.on('update-status', (event, status) => {
			setUpdateStatus(status);
		});
	});
	return (
		<>
			<Head />
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
					<tr>
						<td>{updateMessages()}</td>
						<td>
							{updateStatus === 'update-downloaded' ? (
								<Button onClick={updateClick}>{messages.settings.autoUpdater.updateBtn}</Button>
							) : (
								<Button onClick={checkUpdateClick}>{messages.settings.autoUpdater.checkingForUpdateBtn}</Button>
							)}
						</td>
					</tr>
				</table>
			</Main>
		</>
	);
}

export default Settings;
