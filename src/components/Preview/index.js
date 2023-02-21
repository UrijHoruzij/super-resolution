import React from 'react';
import styles from './Preview.module.css';

const Preview = (props) => {
	const { image } = props;
	return <img className={styles.image} src={image} alt="" />;
};

export default Preview;
