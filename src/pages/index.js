import React, { useEffect, useContext, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Sidebar, Main, LangContext, MenuContext, Layout, Frame, Menu, Dragzone, Preview } from '../components';

const Home = () => {
	const [messages, changeLang, lang, setLang] = useContext(LangContext);
	const [menuItem, changeMenu] = useContext(MenuContext);
	const [previews, setPreviews] = useState([]);
	const [dragEvent, setDragEvent] = useState(false);

	const router = useRouter();

	useEffect(() => {
		window.electron.invoke('get-lang').then((lang) => {
			setLang(lang);
			changeLang(lang);
		});
		window.electron.invoke('get-previews').then((previews) => {
			setPreviews(previews);
		});
	}, []);
	useEffect(() => {
		window.electron.on('open-file', (event, opened) => {
			if (opened) router.push('/editor');
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
						name: 'Открыть',
						shortcut: 'CTRL+N',
						onClick: () => openFile(),
					},
				],
				[{ id: 'file-item-3', name: 'Выход', onClick: () => window.electron.send('window-main-close') }],
			],
		},
		{ id: 'settings', name: messages.settings.title, onClick: () => router.push('/settings') },
		{ id: 'help', name: 'Справка', onClick: () => router.push('/help') },
	];
	const openFile = () => {
		window.electron.send('open-file');
	};
	const drop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const files = [];
			const file = e.dataTransfer.files[0];
			if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
				files.push(file.path);
			}
			window.electron.send('drag-file', files);
		}
	};
	const dragOver = (event) => {
		event.preventDefault();
	};
	const dragEnter = () => {
		setDragEvent(true);
	};
	const dragEnd = () => {
		setDragEvent(false);
	};
	return (
		<>
			<Head />
			<Frame nameWindow="main">
				<Menu menu={menu} menuItem={menuItem} changeMenu={changeMenu} />
			</Frame>
			<Layout type="type-1" changeMenu={changeMenu}>
				<Sidebar />
				<Main>
					<h1 style={{ padding: '16px' }}>{messages.home.title}</h1>
					<div style={{ padding: '16px' }}>
						<Dragzone
							dragEvent={dragEvent}
							dragEnter={dragEnter}
							dragEnd={dragEnd}
							drop={drop}
							dragOver={dragOver}
							openFile={openFile}>
							{messages.upscayl.dragzone}
						</Dragzone>
					</div>
					<div style={{ padding: '16px' }}>
						{previews.length > 0 && previews.map((item, index) => <Preview key={index} image={item} />)}
					</div>
					{/* <Button onClick={openDirectory}>{messages.upscayl.openDirectory}</Button> */}
				</Main>
			</Layout>
		</>
	);
};

export default Home;
