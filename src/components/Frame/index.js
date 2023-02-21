import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import classnames from 'classnames';
import { LangContext } from '../';
import styles from './Frame.module.css';

import logo from '../../../public/images/logo-big.svg';

const Frame = (props) => {
	const { children, nameWindow } = props;
	const [messages] = useContext(LangContext);
	const [maximise, setMaximize] = useState(false);

	const minimizeWindow = () => {
		window.electron.send(`window-${nameWindow}-min`);
	};
	const maximizeWindow = () => {
		window.electron.send(`window-${nameWindow}-max`);
		setMaximize(true);
	};
	const unmaximizeWindow = () => {
		window.electron.send(`window-${nameWindow}-unmax`);
		setMaximize(false);
	};
	const closeWindow = () => {
		window.electron.send(`window-${nameWindow}-close`);
	};
	useEffect(() => {
		window.electron?.invoke(`window-${nameWindow}-ismax`).then((max) => {
			setMaximize(max);
		});
	}, [maximise]);
	return (
		<>
			<header className={classnames(styles.titlebar, { [styles.maximized]: maximise })}>
				<div className={styles.drag_region}>
					<div className={styles.window_title}>
						<Image src={logo} alt={messages.frame.title} width={20} height={20} />
					</div>
					{children ? children : <div></div>}
					<div className={styles.window_controls}>
						<div
							title={messages.frame.minimize}
							className={classnames(styles.button, styles.min_button)}
							onClick={minimizeWindow}>
							<img
								className="icon"
								srcSet="icons/min-w-10.png 1x, icons/min-w-12.png 1.25x, icons/min-w-15.png 1.5x, icons/min-w-15.png 1.75x, icons/min-w-20.png 2x, icons/min-w-20.png 2.25x, icons/min-w-24.png 2.5x, icons/min-w-30.png 3x, icons/min-w-30.png 3.5x"
								draggable="false"
							/>
						</div>
						<div
							title={messages.frame.maximize}
							className={classnames(styles.button, styles.max_button)}
							onClick={maximizeWindow}>
							<img
								className="icon"
								srcSet="icons/max-w-10.png 1x, icons/max-w-12.png 1.25x, icons/max-w-15.png 1.5x, icons/max-w-15.png 1.75x, icons/max-w-20.png 2x, icons/max-w-20.png 2.25x, icons/max-w-24.png 2.5x, icons/max-w-30.png 3x, icons/max-w-30.png 3.5x"
								draggable="false"
							/>
						</div>
						<div
							title={messages.frame.unmaximize}
							className={classnames(styles.button, styles.restore_button)}
							onClick={unmaximizeWindow}>
							<img
								className="icon"
								srcSet="icons/restore-w-10.png 1x, icons/restore-w-12.png 1.25x, icons/restore-w-15.png 1.5x, icons/restore-w-15.png 1.75x, icons/restore-w-20.png 2x, icons/restore-w-20.png 2.25x, icons/restore-w-24.png 2.5x, icons/restore-w-30.png 3x, icons/restore-w-30.png 3.5x"
								draggable="false"
							/>
						</div>
						<div
							title={messages.frame.close}
							className={classnames(styles.button, styles.close_button)}
							onClick={closeWindow}>
							<img
								className="icon"
								srcSet="icons/close-w-10.png 1x, icons/close-w-12.png 1.25x, icons/close-w-15.png 1.5x, icons/close-w-15.png 1.75x, icons/close-w-20.png 2x, icons/close-w-20.png 2.25x, icons/close-w-24.png 2.5x, icons/close-w-30.png 3x, icons/close-w-30.png 3.5x"
								draggable="false"
							/>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Frame;
