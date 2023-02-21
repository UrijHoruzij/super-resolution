import React from 'react';
import styles from './EditorPanel.module.css';

const EditorPanel = (props) => {
	const { children } = props;
	return <div className={styles.wrapper}>{children}</div>;
};

export default EditorPanel;
