import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Button, SliderBeforeAfter } from 'ui-forest';
import { Header, Sidebar, Main, LangContext } from '../components';

const superResolutionPage = () => {
	const [messages] = useContext(LangContext);
	const [images, setImages] = useState([]);
	const [progress, setProgress] = useState(0);
	const superResolution = () => {
		setProgress(1);
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
			setProgress(0);
		});
		window.electron.on('upscayl-error', (event) => {});

		window.electron.on('upscayl-progress', (event, percent) => {
			setProgress(percent);
		});
	});

	const progressRender = () => {
		if (progress > 0) {
			return { filter: 'blur(8px)' };
		} else {
			return {};
		}
	};
	return (
		<>
			<Head />
			<Header title={messages.upscayl.title} />
			<Sidebar />
			<Main>
				<div style={progressRender()}>
					{images
						? images.map((image, index) => {
								if (image.after) {
									return (
										<SliderBeforeAfter
											key={index}
											size={250}
											urlFirstImage={image.before}
											urlSecondImage={image.after}></SliderBeforeAfter>
									);
								} else {
									return <SliderBeforeAfter key={index} size={250} urlFirstImage={image.before}></SliderBeforeAfter>;
								}
						  })
						: null}
				</div>
				<Button onClick={openFile}>{messages.upscayl.openFile}</Button>
				<Button onClick={openDirectory}>{messages.upscayl.openDirectory}</Button>
				<Button onClick={superResolution}>{messages.upscayl.upscayle}</Button>
			</Main>
		</>
	);
};
export default superResolutionPage;
