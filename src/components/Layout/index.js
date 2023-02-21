import React from 'react';
import classnames from 'classnames';
import styles from './Layout.module.css';

const Layout = (props) => {
	const { children, type, changeMenu = () => {} } = props;
	const changeType = (type) => {
		console.log(type);
		switch (type) {
			case 'type-1':
				return styles.type_1;
			case 'type-2':
				return styles.type_2;
			case 'type-3':
				return styles.type_3;
			default:
				return styles.type_1;
		}
	};
	return (
		<div className={classnames(styles.layout, changeType(type))} onClick={changeMenu}>
			{children}
		</div>
	);
};

export default Layout;
