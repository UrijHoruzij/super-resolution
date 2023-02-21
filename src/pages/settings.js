import React, { useEffect, useRef, useContext, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout, Sidebar, Main, LangContext, MenuContext, Frame, Menu } from '../components';
import { Button } from 'ui-forest';

const Settings = () => {
	const [messages, changeLang, lang, setLang] = useContext(LangContext);
	const [menuItem, changeMenu] = useContext(MenuContext);
	const [updateStatus, setUpdateStatus] = useState(null);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [bytesPerSecond, setbytesPerSecond] = useState(0);
	const router = useRouter();

	const firstUpdate = useRef(true);
	const toggleLang = (e) => {
		changeLang(e.target.value);
		setLang(e.target.value);
	};
	useEffect(() => {
		window.electron.invoke('get-lang').then((lang) => {
			changeLang(lang);
		});
	}, []);
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
		window.electron.on('update-status', (event, { status, bytesPerSecond, percent, totalevent }) => {
			setUpdateStatus(status);
			if (status === 'download-progress') {
				setDownloadProgress(percent);
				setbytesPerSecond(bytesPerSecond);
			}
		});
	});
	const menu = [
		{
			id: 'file',
			name: 'Файл',
			list: [
				[
					{
						id: 'file-item-1',
						name: 'Главная',
						shortcut: 'CTRL+S',
						onClick: () => router.push('/'),
					},
					// {
					// 	id: 'file-item-2',
					// 	name: 'Скачать',
					// 	shortcut: 'CTRL+A',
					// 	subMenu: [
					// 		{ id: 'file-item-2-sub-1', name: 'Сохранить', shortcut: 'CTRL+S' },
					// 		{ id: 'file-item-2-sub-2', name: 'Сохранить', shortcut: 'CTRL+S' },
					// 		{ id: 'file-item-2-sub-3', name: 'Сохранить', shortcut: 'CTRL+S' },
					// 	],
					// },
				],
				[{ id: 'file-item-3', name: 'Выход', onClick: () => window.electron.send('window-main-close') }],
			],
		},
		{ id: 'settings', name: messages.settings.title, onClick: () => router.push('/settings') },
		{ id: 'help', name: 'Справка', onClick: () => router.push('/help') },
	];
	return (
		<>
			<Head />
			<Frame nameWindow="main">
				<Menu menu={menu} menuItem={menuItem} changeMenu={changeMenu} />
			</Frame>
			<Layout type="type-3">
				<Main>
					<table>
						<tr>
							<td>{messages.settings.changeLang}</td>
							<td>
								<select value={lang} onChange={toggleLang}>
									<option value="en">EN</option>
									<option value="ru">RU</option>
									<option value="zh">ZH</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>{messages.settings.changeDirectory}</td>
							<td></td>
						</tr>
						<tr>
							<td>
								{updateMessages()}
								{updateStatus === 'download-progress' ? (
									<div>
										{(bytesPerSecond / 1024).toFixed(0)}kB/s-{downloadProgress.toFixed(0)}%
									</div>
								) : null}
							</td>
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
			</Layout>
		</>
	);
};

export default Settings;
