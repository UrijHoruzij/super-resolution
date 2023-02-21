import React, { useContext, useEffect } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LangContext } from '../';
import styles from './Sidebar.module.css';
import { Button } from 'ui-forest';

import upscaleImage from '../../../public/images/image.svg';
import settingsImage from '../../../public/images/settings.svg';
import helpImage from '../../../public/images/help.svg';

const Sidebar = () => {
	const [messages] = useContext(LangContext);
	const router = useRouter();
	const openFile = () => {
		window.electron.send('open-file');
	};
	useEffect(() => {
		window.electron.on('open-file', (event, opened) => {
			if (opened) router.push('/editor');
		});
	});
	return (
		<div className={styles.sidebar}>
			<nav className={styles.sidebar__menu}>
				<ul className={styles.sidebar__list}>
					<Button onClick={openFile} variant="secondary">
						Открыть
					</Button>
				</ul>
			</nav>
			{/* <ul className={classnames(styles.sidebar__list, styles.sidebar__footer)}>
				<li
					className={classnames(styles.sidebar__item, {
						[styles.sidebar__itemActiv]: router.pathname == '/settings',
					})}>
					<Link href="/settings">
						<div className={styles.sidebar__item_image}>
							<Image
								className={styles.sidebar__item_image}
								src={settingsImage}
								alt={messages.settings.title}
								width={24}
								height={24}
							/>
						</div>
						{messages.settings.title}
					</Link>
				</li>
				<li
					className={classnames(styles.sidebar__item, {
						[styles.sidebar__itemActiv]: router.pathname == '/help',
					})}>
					<Link href="/help">
						<div className={styles.sidebar__item_image}>
							<Image
								className={styles.sidebar__item_image}
								src={helpImage}
								alt={messages.help.title}
								width={24}
								height={24}
							/>
						</div>
						{messages.help.title}
					</Link>
				</li>
			</ul> */}
		</div>
	);
};
export default Sidebar;
