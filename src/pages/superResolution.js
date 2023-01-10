import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Button, SliderBeforeAfter } from 'ui-forest';
import { Header, Sidebar, Main, LangContext } from '../components';
import Image from 'next/image';

const superResolutionPage = () => {
	const [messages] = useContext(LangContext);
	const [images, setImages] = useState([]);
	const [outImages, setOutImages] = useState([]);
	const superResolution = () => {
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
			setImages(files);
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
								<SliderBeforeAfter
									key={index}
									width={400}
									height={250}
									urlSecondImage=""
									urlFirstImage={image}></SliderBeforeAfter>
							);

							return <Image key={index} alt={index} width={150} height={150} src={image} />;
					  })
					: null}
				<Button onClick={openFile}>{messages.upscayl.openFile}</Button>
				<Button onClick={openDirectory}>{messages.upscayl.openDirectory}</Button>
				<Button onClick={superResolution}>{messages.upscayl.upscayle}</Button>
			</Main>
		</>
	);
};
export default superResolutionPage;
