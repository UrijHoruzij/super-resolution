import React, { useContext } from 'react';
import Head from 'next/head';
import { MenuContext, Sidebar, Main, LangContext, Frame, Menu } from '../components';

const Help = () => {
	const [messages] = useContext(LangContext);
	const [menuItem, changeMenu] = useContext(MenuContext);
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
				],
				[{ id: 'file-item-3', name: 'Выход', onClick: () => window.electron.send('window-main-close') }],
			],
		},
		{ id: 'settings', name: messages.settings.title, onClick: () => router.push('/settings') },
		{ id: 'help', name: 'Справка' },
	];
	return (
		<>
			<Head />
			<Frame nameWindow="main">
				<Menu menu={menu} menuItem={menuItem} changeMenu={changeMenu} />
			</Frame>
			<Sidebar />
			<Main></Main>
		</>
	);
};

export default Help;
