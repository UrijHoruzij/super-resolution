import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Button } from 'ui-forest';
import { Header, Sidebar, Main, LangContext, Image, Dragzone } from '../components';

const superResolutionPage = () => {
	const [messages] = useContext(LangContext);
	const [images, setImages] = useState([]);
	const [percent, setPercent] = useState(0);
	const [progress, setProgress] = useState(false);

	const superResolution = () => {
		setProgress(true);
		window.electron.send('upscayl');
	};
	const openFile = () => {
		window.electron.send('open-files');
	};
	const openDirectory = () => {
		window.electron.send('open-directory');
	};
	const drop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const files = [];
			for (const file of e.dataTransfer.files) {
				if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
					files.push(file.path);
				}
			}
			window.electron.send('drag-files', files);
		}
	};
	const dragOver = (event) => {
		event.preventDefault();
	};
	useEffect(() => {
		window.electron.on('open-files', (event, files) => {
			setImages(
				files.map((file) => {
					return {
						before: file,
					};
				}),
			);
		});
		window.electron.on('upscayl-done', (event, upscaylImg) => {
			setImages(
				images.map((image, i) => {
					if (i === upscaylImg.index) {
						return {
							before: image.before,
							after: upscaylImg.after,
						};
					}
					return {
						before: image.before,
					};
				}),
			);
			setPercent(0);
			setProgress(false);
		});
		window.electron.on('upscayl-error', (event) => {});

		window.electron.on('upscayl-progress', (event, percent) => {
			setPercent(percent);
		});
	});

	return (
		<>
			<Head />
			<Header title={messages.upscayl.title} />
			<Sidebar />
			<Main>
				{images.length > 0 ? (
					<>
						{images.map((image, index) => {
							return (
								<Image key={index} after={image.after} before={image.before} progress={progress} percent={percent} />
							);
						})}
						<Button onClick={superResolution}>{messages.upscayl.upscayle}</Button>
					</>
				) : (
					<Dragzone drop={drop} dragOver={dragOver} openFile={openFile}>
						{messages.upscayl.dragzone}
					</Dragzone>
				)}
				{/* <Button onClick={openDirectory}>{messages.upscayl.openDirectory}</Button> */}
			</Main>
		</>
	);
};
export default superResolutionPage;
