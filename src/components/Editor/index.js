import React, { useEffect, useRef, useState } from 'react';
import { Image } from '../';
import styles from './Editor.module.css';

const Editor = (props) => {
	const { image, progress, percent } = props;
	const editor = useRef(null);
	const [size, setSize] = useState(500);
	const resize = () => setSize(Math.min(editor.current.offsetWidth, editor.current.offsetHeight));
	useEffect(() => {
		resize();
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, []);
	return (
		<div ref={editor} className={styles.wrapper}>
			<Image image={image} size={size} progress={progress} percent={percent} />
		</div>
	);
};

export default Editor;
