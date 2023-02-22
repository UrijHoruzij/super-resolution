import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from 'ui-forest';
import { LangContext, MenuContext, Editor, Frame, Menu, Layout, EditorPanel } from '../components';

const editorPage = () => {
	const [messages] = useContext(LangContext);
	const [menuItem, changeMenu] = useContext(MenuContext);
	const [image, setImage] = useState({});
	const [percent, setPercent] = useState(0);
	const [progress, setProgress] = useState(false);
	const [save, setSave] = useState(0);
	const [scale, setScale] = useState(8);

	const router = useRouter();

	const changeScale = (e) => {
		setScale(e.target.value);
	};
	const upscayl = () => {
		setProgress(true);
		window.electron.send('upscayl', scale);
	};

	useEffect(() => {
		window.electron.send('opened-file');
		window.electron.on('opened-file', (event, file) => {
			setImage({
				url: file,
			});
		});
	}, []);
	useEffect(() => {
		window.electron.on('upscayl-done', (event, upscaylImg) => {
			setImage({
				url: upscaylImg,
			});
			setPercent(0);
			setProgress(false);
			setSave(true);
		});
		window.electron.on('upscayl-error', (event) => {});
		window.electron.on('upscayl-progress', (event, percent) => {
			setPercent(percent);
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
						name: 'Сохранить',
						shortcut: 'CTRL+S',
						disabled: !save,
						onClick: () => window.electron.send('save-file'),
					},
					{
						id: 'file-item-2',
						name: 'Главная',
						shortcut: 'CTRL+M',
						onClick: () => router.push('/'),
						// subMenu: [
						// 	{ id: 'file-item-4-sub-1', name: 'Сохранить', shortcut: 'CTRL+S' },
						// 	{ id: 'file-item-4-sub-2', name: 'Сохранить', shortcut: 'CTRL+S' },
						// ],
					},
				],
				[
					{
						id: 'file-item-5',
						name: 'Выход',
						shortcut: 'CTRL+Q',
						onClick: () => window.electron.send('window-main-close'),
					},
				],
			],
		},
		{
			id: 'settings',
			name: messages.settings.title,
			onClick: () => window.electron.send('settings'),
		},
		{ id: 'help', name: 'Справка', onClick: () => router.push('/help') },
	];

	return (
		<>
			<Head />
			<Frame nameWindow="main">
				<Menu menu={menu} menuItem={menuItem} changeMenu={changeMenu} />
			</Frame>
			<Layout type="type-2">
				<Editor image={image.url} progress={progress} percent={percent} />
				<EditorPanel>
					<Button onClick={upscayl}>{messages.upscayl.upscayle}</Button>
				</EditorPanel>
			</Layout>
		</>
	);
};
export default editorPage;
