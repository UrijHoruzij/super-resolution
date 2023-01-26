import React from 'react';
import styles from './Dragzone.module.css';

const Dragzone = (props) => {
	const { dragOver, drop, openFile, children } = props;
	return (
		<div onDragOver={dragOver} onDrop={drop} onClick={openFile} className={styles.wrapper}>
			<div className={styles.text}>{children}</div>
		</div>
	);
};

export default Dragzone;
