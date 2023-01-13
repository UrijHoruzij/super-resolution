import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Button } from 'ui-forest';
import { Header, Sidebar, Main, LangContext, Image } from '../components';

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
				{images
					? images.map((image, index) => {
							return (
								<Image key={index} after={image.after} before={image.before} progress={progress} percent={percent} />
							);
					  })
					: null}
				<Button onClick={openFile}>{messages.upscayl.openFile}</Button>
				{/* <Button onClick={openDirectory}>{messages.upscayl.openDirectory}</Button> */}
				<Button onClick={superResolution}>{messages.upscayl.upscayle}</Button>
			</Main>
		</>
	);
};
export default superResolutionPage;
